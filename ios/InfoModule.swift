//
// InfoModule.swift
// React Native Bridge für Settings öffnen und Info anzeigen
//

import Foundation
import React
import UIKit

@objc(InfoModule)
class InfoModule: NSObject {
  
  // MARK: - RCTBridgeModule
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  // MARK: - Settings öffnen
  
  @objc
  func openSettings(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard let settingsUrl = URL(string: UIApplication.openSettingsURLString) else {
        rejecter("SETTINGS_ERROR", "Konnte Settings URL nicht erstellen", nil)
        return
      }
      
      if UIApplication.shared.canOpenURL(settingsUrl) {
        UIApplication.shared.open(settingsUrl) { success in
          if success {
            resolver(true)
          } else {
            rejecter("SETTINGS_ERROR", "Konnte Settings nicht öffnen", nil)
          }
        }
      } else {
        rejecter("SETTINGS_ERROR", "Settings können nicht geöffnet werden", nil)
      }
    }
  }
  
  // MARK: - Hallo Welt anzeigen
  
  @objc
  func showHelloWorld(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
            let rootViewController = windowScene.windows.first?.rootViewController else {
        rejecter("VIEW_ERROR", "Konnte Root View Controller nicht finden", nil)
        return
      }
      
      let alert = UIAlertController(
        title: "Swift Info",
        message: "Hi Leute, wir switchen hier gerade auf Swift UIKit",
        preferredStyle: .alert
      )
      
      alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
        resolver(true)
      })
      
      rootViewController.present(alert, animated: true)
    }
  }
}

