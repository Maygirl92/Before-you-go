#import <Foundation/Foundation.h>
#import <ImageIO/ImageIO.h>
#import <Vision/Vision.h>

static CGImageRef loadImage(NSString *path) {
    NSURL *url = [NSURL fileURLWithPath:path];
    CGImageSourceRef source = CGImageSourceCreateWithURL((__bridge CFURLRef)url, NULL);
    if (source == NULL) return NULL;
    CGImageRef image = CGImageSourceCreateImageAtIndex(source, 0, NULL);
    CFRelease(source);
    return image;
}

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        if (argc < 2) {
            fprintf(stderr, "usage: ocr_frames IMAGE...\n");
            return 2;
        }

        for (int i = 1; i < argc; i++) {
            @autoreleasepool {
                NSString *path = [NSString stringWithUTF8String:argv[i]];
                CGImageRef image = loadImage(path);
                if (image == NULL) continue;

                VNRecognizeTextRequest *request = [[VNRecognizeTextRequest alloc] init];
                request.recognitionLevel = VNRequestTextRecognitionLevelAccurate;
                request.recognitionLanguages = @[@"zh-Hans", @"en-US"];
                request.usesLanguageCorrection = YES;
                request.minimumTextHeight = 0.006;

                VNImageRequestHandler *handler = [[VNImageRequestHandler alloc] initWithCGImage:image options:@{}];
                NSError *error = nil;
                BOOL ok = [handler performRequests:@[request] error:&error];
                if (!ok) {
                    fprintf(stderr, "%s: %s\n", path.UTF8String, error.localizedDescription.UTF8String);
                    CGImageRelease(image);
                    continue;
                }

                NSArray<VNRecognizedTextObservation *> *sorted = [request.results sortedArrayUsingComparator:^NSComparisonResult(VNRecognizedTextObservation *a, VNRecognizedTextObservation *b) {
                    CGFloat ay = CGRectGetMaxY(a.boundingBox);
                    CGFloat by = CGRectGetMaxY(b.boundingBox);
                    if (fabs(ay - by) > 0.012) return ay > by ? NSOrderedAscending : NSOrderedDescending;
                    return CGRectGetMinX(a.boundingBox) < CGRectGetMinX(b.boundingBox) ? NSOrderedAscending : NSOrderedDescending;
                }];

                NSMutableArray *items = [NSMutableArray array];
                for (VNRecognizedTextObservation *observation in sorted) {
                    VNRecognizedText *candidate = [[observation topCandidates:1] firstObject];
                    if (candidate == nil || candidate.confidence < 0.20) continue;
                    CGRect box = observation.boundingBox;
                    [items addObject:@{
                        @"text": candidate.string,
                        @"confidence": @(candidate.confidence),
                        @"x": @(box.origin.x),
                        @"y": @(box.origin.y),
                        @"w": @(box.size.width),
                        @"h": @(box.size.height)
                    }];
                }

                NSDictionary *record = @{
                    @"file": path.lastPathComponent,
                    @"texts": items
                };
                NSData *json = [NSJSONSerialization dataWithJSONObject:record options:0 error:nil];
                fwrite(json.bytes, 1, json.length, stdout);
                fputc('\n', stdout);
                fflush(stdout);
                CGImageRelease(image);
            }
        }
    }
    return 0;
}
