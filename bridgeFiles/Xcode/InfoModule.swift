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
  
  // MARK: - RCTBridgeModule
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  // MARK: - SDK Initialisierung mit API-Key
  
  @objc
  @MainActor
  func setAPIKey(_ apiKey: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard !apiKey.isEmpty else {
        rejecter("INIT_ERROR", "API-Key darf nicht leer sein", nil)
        return
      }
      
      InfoModule.apiKey = apiKey
      
      // SDK neu initialisieren, falls bereits initialisiert
      if InfoModule.isInitialized {
        // SDK mit neuem API-Key neu initialisieren
        // Erstelle ein Configuration-Objekt mit dem API-Key
        let configuration = Elvah.Configuration(apiKey: apiKey)
        Elvah.initialize(with: configuration)
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
       // Verwende API-Key falls gesetzt, sonst Simulator
       if !InfoModule.isInitialized {
         if let apiKey = InfoModule.apiKey, !apiKey.isEmpty {
           // Initialisierung mit API-Key
           // Erstelle ein Configuration-Objekt mit dem API-Key
           let configuration = Elvah.Configuration(apiKey: apiKey)
           Elvah.initialize(with: configuration)
         } else {
           // Fallback: Simulator-Modus (für Entwicklung)
           Elvah.initialize(with: .simulator)
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

