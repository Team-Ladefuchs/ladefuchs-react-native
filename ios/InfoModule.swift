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
  @MainActor
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
  
  // MARK: - Standortfreigabe Hinweis
  
  @objc
  @MainActor
  func showLocationPermissionHint(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
            let rootViewController = windowScene.windows.first?.rootViewController else {
        rejecter("VIEW_ERROR", "Konnte Root View Controller nicht finden", nil)
        return
      }
      
      let alert = UIAlertController(
        title: "Standortfreigabe für dynamische Preise",
        message: "Um dir die besten Preise für Ladestationen in deiner Nähe anzuzeigen, benötigen wir Zugriff auf deinen Standort. Die Standortdaten werden nur auf deinem Gerät verwendet und nicht gespeichert.",
        preferredStyle: .alert
      )
      
      alert.addAction(UIAlertAction(title: "Verstanden", style: .default) { _ in
        resolver(true)
      })
      
      rootViewController.present(alert, animated: true)
    }
  }
  
  // MARK: - Hallo Welt anzeigen
  
  @objc
  @MainActor
  func showHelloWorld(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
     DispatchQueue.main.async {
       guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
             let rootViewController = windowScene.windows.first?.rootViewController else {
         rejecter("VIEW_ERROR", "Konnte Root View Controller nicht finden", nil)
         return
       }
       
       let alert = UIAlertController(
         title: "Ab hier läuft Swift UIKit",
         message: "Wir könnten den Ladefuchs mit deren SDK verbinden",
         preferredStyle: .alert
       )
       
       alert.addAction(UIAlertAction(title: "Schau her", style: .default) { _ in
         if let url = URL(string: "https://github.com/elvah-hub/charge-sdk-ios") {
           UIApplication.shared.open(url, options: [:], completionHandler: nil)
         }
         resolver(true)
       })
       
       alert.addAction(UIAlertAction(title: "Abbrechen", style: .cancel) { _ in
         resolver(true)
       })
       
       rootViewController.present(alert, animated: true)
     }
   }
}

