import SwiftUI
import ElvahCharge
import CoreLocation

struct ContentView: View {
    @State private var locationManager = LocationManager()
    @ChargeBannerSource private var chargeBannerSource

    // Demo‑Koordinaten als Fallback (Berlin)
    private let demoCoordinate = CLLocationCoordinate2D(
        latitude: 52.51786610212313,
        longitude: 13.27256389925166
    )
    
    // Test-Koordinaten für Honduras (für Test-API-Key mit simulierten Stationen)
    private let testCoordinate = CLLocationCoordinate2D(
        latitude: 14.0712,
        longitude: -87.1802
    )
    
    // Prüft, ob Test-Modus aktiv ist (Simulator-Modus oder Test-API-Key)
    private var isTestMode: Bool {
        return InfoModule.isTestModeActive()
    }

    var body: some View {
        VStack(spacing: 16) {
            Text("EV‑Laden mit elvah")
                .font(.title)

            // Status anzeigen
            Text("Location: \(locationStatusText)")
                .font(.caption)
                .foregroundColor(.secondary)

            Button("Nahegelegene Angebote laden") {
                loadNearbyOffers()
            }
            .buttonStyle(.borderedProminent)

            Text("Source ist \(chargeBannerSource == nil ? "nil" : "gesetzt")")
                .font(.caption)
                .foregroundColor(.secondary)

            if let $chargeBannerSource {
                ChargeBanner(source: $chargeBannerSource)
                    .variant(.large)
            } else {
                Text("Noch keine Angebote verfügbar")
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .task {
            // Automatisch Location starten, wenn schon erlaubt
            if locationManager.authorizationStatus == .authorizedWhenInUse {
                locationManager.startUpdatingLocation()
            }
        }
    }

    private var locationStatusText: String {
        switch locationManager.authorizationStatus {
        case .notDetermined:
            return "Freigabe erforderlich"
        case .denied, .restricted:
            return "Location deaktiviert"
        case .authorizedWhenInUse, .authorizedAlways:
            return locationManager.currentLocation != nil ? "Verfügbar" : "Wird geladen..."
        @unknown default:
            return "Unbekannt"
        }
    }

    private func loadNearbyOffers() {
        // Erst Location‑Freigabe anfordern, falls nötig
        if locationManager.authorizationStatus != .authorizedWhenInUse {
            Task {
                locationManager.requestPermission()
                // Warte kurz, damit die Berechtigung verarbeitet werden kann
                try? await Task.sleep(nanoseconds: 500_000_000) // 0.5 Sekunden
                if locationManager.authorizationStatus == .authorizedWhenInUse {
                    locationManager.startUpdatingLocation()
                    // Warte auf Location-Update
                    try? await Task.sleep(nanoseconds: 1_000_000_000) // 1 Sekunde
                    if let currentLocation = locationManager.currentLocation {
                        chargeBannerSource = .remote(near: currentLocation.coordinate)
                    } else {
                        // Fallback: Test-Koordinaten wenn Test-Modus, sonst Demo-Koordinaten
                        chargeBannerSource = .remote(near: isTestMode ? testCoordinate : demoCoordinate)
                    }
                } else {
                    // Fallback: Test-Koordinaten wenn Test-Modus, sonst Demo-Koordinaten
                    chargeBannerSource = .remote(near: isTestMode ? testCoordinate : demoCoordinate)
                }
            }
            return
        }

        // Primär: aktuelle Location (außer im Test-Modus)
        if let currentLocation = locationManager.currentLocation, !isTestMode {
            chargeBannerSource = .remote(near: currentLocation.coordinate)
            return
        }

        // Im Test-Modus: Test-Koordinaten (Honduras) verwenden
        // Sonst: Demo‑Koordinaten als Fallback
        chargeBannerSource = .remote(near: isTestMode ? testCoordinate : demoCoordinate)
    }
}

