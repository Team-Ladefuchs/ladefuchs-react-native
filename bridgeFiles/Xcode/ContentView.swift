import SwiftUI
import ElvahCharge
import CoreLocation

struct ContentView: View {
    @State private var locationManager = LocationManager()
    @ChargeBannerSource private var chargeBannerSource

    // Demo‑Koordinaten als Fallback
    private let demoCoordinate = CLLocationCoordinate2D(
        latitude: 52.51786610212313,
        longitude: 13.27256389925166
    )

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
                        // Fallback: Demo‑Koordinaten
                        chargeBannerSource = .remote(near: demoCoordinate)
                    }
                } else {
                    // Fallback: Demo‑Koordinaten wenn keine Berechtigung
                    chargeBannerSource = .remote(near: demoCoordinate)
                }
            }
            return
        }

        // Primär: aktuelle Location
        if let currentLocation = locationManager.currentLocation {
            chargeBannerSource = .remote(near: currentLocation.coordinate)
            return
        }

        // Fallback: Demo‑Koordinaten
        chargeBannerSource = .remote(near: demoCoordinate)
    }
}

