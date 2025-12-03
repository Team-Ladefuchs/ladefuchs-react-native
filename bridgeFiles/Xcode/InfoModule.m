//
// InfoModule.m
// Objective-C Bridge für InfoModule
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(InfoModule, NSObject)

// Settings öffnen
RCT_EXTERN_METHOD(openSettings:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// Hallo Welt anzeigen
RCT_EXTERN_METHOD(showHelloWorld:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

@end
