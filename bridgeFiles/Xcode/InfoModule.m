//
// InfoModule.m
// Objective-C Bridge für InfoModule
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(InfoModule, NSObject)

// Settings öffnen
RCT_EXTERN_METHOD(openSettings:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// Standortfreigabe Hinweis
RCT_EXTERN_METHOD(showLocationPermissionHint:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// API-Key setzen für SDK-Initialisierung
RCT_EXTERN_METHOD(setAPIKey:(NSString *)apiKey
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// Simulator-Modus aktivieren/deaktivieren
RCT_EXTERN_METHOD(setSimulatorMode:(BOOL)useSimulator
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// Hallo Welt anzeigen
RCT_EXTERN_METHOD(showHelloWorld:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

@end
