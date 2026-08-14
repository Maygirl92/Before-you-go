import AVFoundation
import AppKit
import Foundation

guard CommandLine.arguments.count >= 3 else {
    fputs("usage: extract_frames.swift VIDEO OUTPUT_DIR [interval_seconds]\n", stderr)
    exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
let interval = CommandLine.arguments.count >= 4 ? (Double(CommandLine.arguments[3]) ?? 1.0) : 1.0

try FileManager.default.createDirectory(at: outputURL, withIntermediateDirectories: true)

let asset = AVURLAsset(url: inputURL)
let duration = try await asset.load(.duration)
let seconds = CMTimeGetSeconds(duration)
let tracks = try await asset.loadTracks(withMediaType: .video)
guard let track = tracks.first else {
    fputs("no video track\n", stderr)
    exit(3)
}
let naturalSize = try await track.load(.naturalSize)
print("duration=\(String(format: "%.3f", seconds)) width=\(Int(naturalSize.width)) height=\(Int(naturalSize.height)) interval=\(interval)")

let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero

var index = 0
var timestamp = 0.0
while timestamp <= seconds {
    autoreleasepool {
        let requestedTime = CMTime(seconds: timestamp, preferredTimescale: 600)
        do {
            let cgImage = try generator.copyCGImage(at: requestedTime, actualTime: nil)
            let bitmap = NSBitmapImageRep(cgImage: cgImage)
            guard let png = bitmap.representation(using: .png, properties: [:]) else {
                throw NSError(domain: "extract_frames", code: 1)
            }
            let name = String(format: "frame_%05d_%09.3f.png", index, timestamp)
            try png.write(to: outputURL.appendingPathComponent(name))
        } catch {
            fputs("frame \(index) at \(timestamp)s failed: \(error)\n", stderr)
        }
    }
    index += 1
    timestamp += interval
}

print("frames=\(index)")
