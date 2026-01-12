//
// InfoModule.swift
// React Native Bridge für Settings öffnen und Info anzeigen
//

import Foundation
import React
import UIKit
import SwiftUI
import ElvahCharge

@objc(InfoModule)
class InfoModule: NSObject {
  
  // MARK: - Properties
  
  private static var apiKey: String?
  private static var isInitialized = false
  private static var useSimulatorMode = false
  
  // Prüft, ob Test-Modus aktiv ist (Simulator-Modus oder Test-API-Key)
  static func isTestModeActive() -> Bool {
    // Simulator-Modus ist aktiv
    if useSimulatorMode {
      return true
    }
    // Prüfe, ob Test-API-Key verwendet wird (beginnt mit "evpk_test_")
    if let apiKey = apiKey, apiKey.hasPrefix("evpk_test_") {
      return true
    }
    return false
  }
  
  // MARK: - RCTBridgeModule
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  // MARK: - SDK Modus wechseln (API-Key / Simulator)
  
  @objc
  @MainActor
  func setSimulatorMode(_ useSimulator: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      InfoModule.useSimulatorMode = useSimulator
      
      // SDK neu initialisieren mit dem neuen Modus
      if InfoModule.isInitialized {
        if useSimulator {
          Elvah.initialize(with: .simulator)
          print("InfoModule.setSimulatorMode: SDK auf Simulator-Modus umgeschaltet")
        } else {
          // Simulator-Modus wird deaktiviert - prüfe API-Key
          if let apiKey = InfoModule.apiKey, !apiKey.isEmpty {
            let configuration = Elvah.Configuration(apiKey: apiKey)
            Elvah.initialize(with: configuration)
            print("InfoModule.setSimulatorMode: SDK auf API-Key-Modus umgeschaltet")
          } else {
            // API-Key nicht gesetzt - aber nicht als Fehler behandeln, 
            // da er möglicherweise noch gesetzt wird (z.B. von React Native)
            print("InfoModule.setSimulatorMode: Warnung - Kein API-Key gesetzt. SDK wird beim nächsten showHelloWorld initialisiert.")
            // SDK nicht neu initialisieren, sondern warten bis API-Key gesetzt wird
            // oder beim nächsten showHelloWorld wird es initialisiert
          }
        }
      } else {
        // SDK noch nicht initialisiert - wird beim nächsten showHelloWorld initialisiert
        print("InfoModule.setSimulatorMode: SDK noch nicht initialisiert. Wird beim nächsten showHelloWorld initialisiert.")
      }
      
      resolver(true)
    }
  }
  
  // MARK: - SDK Initialisierung mit API-Key
  
  @objc
  @MainActor
  func setAPIKey(_ apiKey: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let trimmedKey = apiKey.trimmingCharacters(in: .whitespacesAndNewlines)
      
      guard !trimmedKey.isEmpty else {
        rejecter("INIT_ERROR", "API-Key darf nicht leer sein", nil)
        return
      }
      
      // Debugging: Log API-Key Info (ohne vollständigen Key zu loggen)
      print("InfoModule.setAPIKey: API-Key empfangen, Länge: \(trimmedKey.count)")
      print("InfoModule.setAPIKey: API-Key Start: \(String(trimmedKey.prefix(10)))...")
      
      InfoModule.apiKey = trimmedKey
      
      // SDK neu initialisieren, falls bereits initialisiert
      if InfoModule.isInitialized {
        // SDK mit neuem API-Key neu initialisieren
        // Erstelle ein Configuration-Objekt mit dem API-Key
        // Für Integration/Test-Umgebung könnte es einen environment Parameter geben:
        // let configuration = Elvah.Configuration(apiKey: trimmedKey, environment: .integration)
        // Falls nicht verfügbar, wird der Standard-Produktions-Endpunkt verwendet
        let configuration = Elvah.Configuration(apiKey: trimmedKey)
        Elvah.initialize(with: configuration)
        print("InfoModule.setAPIKey: SDK mit neuem API-Key neu initialisiert")
      }
      
      resolver(true)
    }
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
  
  // MARK: - ContentView anzeigen (elvah SDK)
  
  @objc
  @MainActor
  func showHelloWorld(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
     DispatchQueue.main.async {
       guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
             let rootViewController = windowScene.windows.first?.rootViewController else {
         rejecter("VIEW_ERROR", "Konnte Root View Controller nicht finden", nil)
         return
       }
       
       // Elvah SDK initialisieren
       // Verwende Simulator-Modus falls aktiviert, sonst API-Key
       if !InfoModule.isInitialized {
         if InfoModule.useSimulatorMode {
           // Simulator-Modus (für Entwicklung/Test)
           Elvah.initialize(with: .simulator)
           print("InfoModule.showHelloWorld: SDK im Simulator-Modus initialisiert")
         } else if let apiKey = InfoModule.apiKey, !apiKey.isEmpty {
           // Initialisierung mit API-Key
           let configuration = Elvah.Configuration(apiKey: apiKey)
           Elvah.initialize(with: configuration)
           print("InfoModule.showHelloWorld: SDK mit API-Key initialisiert")
         } else {
           // Fallback: Simulator-Modus wenn kein API-Key gesetzt
           Elvah.initialize(with: .simulator)
           print("InfoModule.showHelloWorld: SDK im Simulator-Modus (Fallback) initialisiert")
         }
         InfoModule.isInitialized = true
       }
       
       // ContentView als SwiftUI View erstellen
       let contentView = ContentView()
       let hostingController = UIHostingController(rootView: contentView)
       
       // Navigation Controller für bessere Präsentation
       let navigationController = UINavigationController(rootViewController: hostingController)
       
       // Schließen-Button hinzufügen
       hostingController.navigationItem.leftBarButtonItem = UIBarButtonItem(
         systemItem: .close,
         primaryAction: UIAction { [weak self] _ in
           navigationController.dismiss(animated: true) {
             resolver(true)
           }
         }
       )
       
       // Modal präsentieren
       navigationController.modalPresentationStyle = .pageSheet
       if let sheet = navigationController.sheetPresentationController {
         sheet.detents = [.large()]
         sheet.prefersGrabberVisible = true
       }
       
       rootViewController.present(navigationController, animated: true)
     }
   }
  
}

