#import <AVFoundation/AVFoundation.h>
#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        if (argc < 3) {
            fprintf(stderr, "usage: extract_frames VIDEO OUTPUT_DIR [interval_seconds]\n");
            return 2;
        }

        NSString *inputPath = [NSString stringWithUTF8String:argv[1]];
        NSString *outputPath = [NSString stringWithUTF8String:argv[2]];
        double interval = argc >= 4 ? atof(argv[3]) : 1.0;
        [[NSFileManager defaultManager] createDirectoryAtPath:outputPath
                                  withIntermediateDirectories:YES
                                                   attributes:nil
                                                        error:nil];

        AVURLAsset *asset = [AVURLAsset URLAssetWithURL:[NSURL fileURLWithPath:inputPath] options:nil];
        double duration = CMTimeGetSeconds(asset.duration);
        AVAssetTrack *track = [[asset tracksWithMediaType:AVMediaTypeVideo] firstObject];
        if (track == nil) {
            fprintf(stderr, "no video track\n");
            return 3;
        }
        CGSize size = track.naturalSize;
        printf("duration=%.3f width=%d height=%d interval=%.3f\n",
               duration, (int)size.width, (int)size.height, interval);

        AVAssetImageGenerator *generator = [[AVAssetImageGenerator alloc] initWithAsset:asset];
        generator.appliesPreferredTrackTransform = YES;
        generator.requestedTimeToleranceBefore = kCMTimeZero;
        generator.requestedTimeToleranceAfter = kCMTimeZero;

        int index = 0;
        for (double timestamp = 0.0; timestamp <= duration; timestamp += interval, index++) {
            @autoreleasepool {
                NSError *error = nil;
                CGImageRef image = [generator copyCGImageAtTime:CMTimeMakeWithSeconds(timestamp, 600)
                                                     actualTime:nil
                                                          error:&error];
                if (image == nil) {
                    fprintf(stderr, "frame %d at %.3fs failed: %s\n",
                            index, timestamp, error.localizedDescription.UTF8String);
                    continue;
                }

                NSBitmapImageRep *bitmap = [[NSBitmapImageRep alloc] initWithCGImage:image];
                NSData *png = [bitmap representationUsingType:NSBitmapImageFileTypePNG properties:@{}];
                NSString *name = [NSString stringWithFormat:@"frame_%05d_%09.3f.png", index, timestamp];
                [png writeToFile:[outputPath stringByAppendingPathComponent:name] atomically:YES];
                CGImageRelease(image);
            }
        }

        printf("frames=%d\n", index);
    }
    return 0;
}
