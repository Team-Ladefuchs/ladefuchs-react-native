# Plugsurfing API Integration - Implementierungsleitfaden

## Übersicht

Dieses Dokument beschreibt die Integration der **Plugsurfing Drive API** für Echtzeit-Verfügbarkeits- und Preisdaten von Ladestationen.

## Verfügbarkeit der APIs

### ❌ Chargemap
- **Keine öffentliche API verfügbar**
- Direkte Integration nicht möglich
- Für Business-Lösungen möglicherweise verfügbar (Kontakt erforderlich)

### ✅ Plugsurfing Drive API
- **Öffentlich verfügbar** (nach Registrierung)
- Bietet Echtzeit-Verfügbarkeit
- Strukturierte Preisdaten
- Steckertypen mit Status
- Möglichkeit, Ladevorgänge zu starten/stoppen

## Voraussetzungen

1. **Registrierung bei Plugsurfing Developer Portal**
   - URL: https://developer.plugsurfing.com
   - Erstellen eines Developer-Accounts
   - Beantragung eines API-Keys

2. **API-Key Konfiguration**
   - API-Key sollte sicher gespeichert werden
   - Nicht im Code hardcoden
   - Empfohlen: Umgebungsvariablen oder secure storage

3. **Mögliche Vertragsvereinbarungen**
   - Je nach Nutzungsumfang können vertragliche Vereinbarungen erforderlich sein
   - Kontakt mit Plugsurfing für Details

## Implementierung

### 1. API-Funktionen

Die Datei `functions/api/plugsurfing.ts` enthält:
- TypeScript-Typen für Plugsurfing-Daten
- Funktionen zum Abrufen von Stationen
- Formatierungs-Hilfsfunktionen

### 2. Beispiel-Implementierung

Die Datei `screens/mapView.plugsurfing.example.tsx` zeigt:
- Integration in die MapView
- Anzeige von Verfügbarkeitsdaten
- Strukturierte Preisanzeige
- Status-Anzeige für Steckertypen

### 3. Features der Plugsurfing API

#### Verfügbare Daten:
- ✅ **Echtzeit-Verfügbarkeit** (available/total)
- ✅ **Strukturierte Preise** (pro kWh, pro Minute, pro Session)
- ✅ **Steckertypen mit Status** (verfügbar, belegt, außer Betrieb)
- ✅ **Standortdaten** (Adresse, Koordinaten)
- ✅ **Betreiberinformationen**
- ✅ **Echtzeitdaten-Flag** (zeigt an, ob Daten aktuell sind)

#### Zusätzliche Funktionen (optional):
- Benutzerkontenverwaltung
- Start/Stopp von Ladevorgängen
- Ladehistorien
- Zahlungsabwicklung

## Verwendung

### API-Key konfigurieren

```typescript
// In .env oder Konfigurationsdatei
PLUGSURFING_API_KEY=dein-api-key-hier
```

### Stationen abrufen

```typescript
import { fetchPlugsurfingStations } from "../functions/api/plugsurfing";

const stations = await fetchPlugsurfingStations(
  { latitude: 52.5200, longitude: 13.4050 },
  10, // Radius in km
  50  // Max. Ergebnisse
);
```

### Daten anzeigen

```typescript
import { 
  formatPlugsurfingPrice, 
  formatPlugsurfingAvailability 
} from "../functions/api/plugsurfing";

// Preis formatieren
const priceText = formatPlugsurfingPrice(station.pricing);
// Beispiel: "0.45 EUR/kWh + 0.10 EUR/Min"

// Verfügbarkeit formatieren
const availabilityText = formatPlugsurfingAvailability(station.availability);
// Beispiel: "3/4 verfügbar"
```

## Kombination mit OpenChargeMap

Die Plugsurfing API kann mit OpenChargeMap kombiniert werden:

1. **OpenChargeMap** für breite Abdeckung (viele Stationen)
2. **Plugsurfing** für detaillierte Daten (Verfügbarkeit, Preise) bei unterstützten Stationen

### Hybrid-Ansatz:

```typescript
// 1. OpenChargeMap für alle Stationen
const ocmStations = await fetchOpenChargeMapStations(lat, lon);

// 2. Plugsurfing für detaillierte Daten bei unterstützten Stationen
const psStations = await fetchPlugsurfingStations(lat, lon);

// 3. Daten zusammenführen
const enrichedStations = mergeStationData(ocmStations, psStations);
```

## Vorteile der Plugsurfing Integration

1. **Echtzeit-Verfügbarkeit**: Zeigt an, welche Ladepunkte gerade verfügbar sind
2. **Strukturierte Preise**: Einfache Darstellung und Vergleich von Preisen
3. **Aktuelle Daten**: Echtzeitdaten-Flag zeigt Aktualität an
4. **Detaillierte Stecker-Informationen**: Status pro Steckertyp

## Nachteile / Einschränkungen

1. **Registrierung erforderlich**: API-Key muss beantragt werden
2. **Mögliche Kosten**: Je nach Nutzungsumfang können Kosten anfallen
3. **Begrenzte Abdeckung**: Nicht alle Stationen sind im Plugsurfing-Netzwerk
4. **Vertragliche Vereinbarungen**: Möglicherweise erforderlich

## Nächste Schritte

1. ✅ API-Funktionen implementiert (`functions/api/plugsurfing.ts`)
2. ✅ Beispiel-Implementierung erstellt (`screens/mapView.plugsurfing.example.tsx`)
3. ⏳ Registrierung bei Plugsurfing Developer Portal
4. ⏳ API-Key konfigurieren
5. ⏳ Integration in die bestehende MapView testen
6. ⏳ Fehlerbehandlung und Fallbacks implementieren
7. ⏳ UI-Anpassungen für neue Datenfelder

## Weitere Ressourcen

- [Plugsurfing Developer Portal](https://developer.plugsurfing.com)
- [Drive API Dokumentation](https://developer.plugsurfing.com/docs/about-drive-api)
- [API-Zugriff](https://developer.plugsurfing.com/docs/accessing-the-api)

## Alternative APIs

Falls Plugsurfing nicht geeignet ist, könnten folgende Alternativen geprüft werden:

- **OCPI (Open Charge Point Interface)**: Standardprotokoll, aber erfordert Partnerschaften
- **Betreiber-spezifische APIs**: z.B. EnBW, Ionity, etc. (begrenzte Abdeckung)
- **MobilityData.io**: Open Data für Mobilität (keine Echtzeitdaten)


