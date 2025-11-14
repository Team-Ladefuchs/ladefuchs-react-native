/**
 * Plugsurfing Drive API Integration
 * 
 * Dokumentation: https://developer.plugsurfing.com/docs/about-drive-api
 * 
 * WICHTIG: Diese API erfordert:
 * - Registrierung bei Plugsurfing Developer Portal
 * - API-Key für Authentifizierung
 * - Möglicherweise vertragliche Vereinbarungen
 * 
 * Die API bietet:
 * - Echtzeit-Verfügbarkeit von Ladestationen
 * - Strukturierte Preisdaten
 * - Steckertypen und Leistung
 * - Möglichkeit, Ladevorgänge zu starten/stoppen
 */

// Plugsurfing API Base URL
const PLUGSURFING_API_BASE = "https://api.plugsurfing.com/drive/v1";

// API Key sollte aus Umgebungsvariablen oder Config kommen
// Für Produktion: In .env oder secure storage speichern
const PLUGSURFING_API_KEY = process.env.PLUGSURFING_API_KEY || "";

/**
 * Plugsurfing API Types
 */
export interface PlugsurfingLocation {
	latitude: number;
	longitude: number;
}

export interface PlugsurfingConnector {
	id: string;
	type: string; // z.B. "Type2", "CCS", "CHAdeMO"
	powerKw: number | null;
	status: "available" | "occupied" | "unknown" | "out_of_order";
}

export interface PlugsurfingPricing {
	currency: string;
	pricePerKwh: number | null;
	pricePerMinute: number | null;
	pricePerSession: number | null;
	minimumPrice: number | null;
}

export interface PlugsurfingStation {
	id: string;
	name: string;
	address: {
		street: string | null;
		city: string | null;
		postalCode: string | null;
		country: string | null;
	};
	location: PlugsurfingLocation;
	distance?: number; // in km, wird beim Abruf berechnet
	operator: {
		name: string;
		id: string;
	} | null;
	connectors: PlugsurfingConnector[];
	pricing: PlugsurfingPricing | null;
	availability: {
		available: number;
		total: number;
	};
	status: "operational" | "temporarily_unavailable" | "unknown";
	realTimeData: boolean; // Gibt an, ob Echtzeitdaten verfügbar sind
}

export interface PlugsurfingStationsResponse {
	stations: PlugsurfingStation[];
	total: number;
	page: number;
	pageSize: number;
}

/**
 * Sucht Ladestationen in der Nähe eines Standorts
 * 
 * @param location Standort (Latitude/Longitude)
 * @param radius Radius in km (Standard: 10km)
 * @param maxResults Maximale Anzahl Ergebnisse (Standard: 50)
 * @returns Array von Ladestationen
 */
export async function fetchPlugsurfingStations(
	location: PlugsurfingLocation,
	radius: number = 10,
	maxResults: number = 50,
): Promise<PlugsurfingStation[]> {
	if (!PLUGSURFING_API_KEY) {
		console.warn("Plugsurfing API Key nicht konfiguriert");
		return [];
	}

	try {
		const url = `${PLUGSURFING_API_BASE}/stations?latitude=${location.latitude}&longitude=${location.longitude}&radius=${radius}&limit=${maxResults}`;
		
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${PLUGSURFING_API_KEY}`,
				"Content-Type": "application/json",
				"Accept": "application/json",
			},
		});

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error("Plugsurfing API: Ungültiger API-Key");
			}
			if (response.status === 403) {
				throw new Error("Plugsurfing API: Zugriff verweigert - möglicherweise fehlende Berechtigungen");
			}
			throw new Error(`Plugsurfing API Fehler: ${response.status} ${response.statusText}`);
		}

		const data: PlugsurfingStationsResponse = await response.json();
		return data.stations || [];
	} catch (error) {
		console.error("Fehler beim Abrufen der Plugsurfing Stationen:", error);
		return [];
	}
}

/**
 * Ruft detaillierte Informationen zu einer spezifischen Station ab
 * 
 * @param stationId ID der Ladestation
 * @returns Detaillierte Stationsinformationen
 */
export async function fetchPlugsurfingStationDetails(
	stationId: string,
): Promise<PlugsurfingStation | null> {
	if (!PLUGSURFING_API_KEY) {
		console.warn("Plugsurfing API Key nicht konfiguriert");
		return null;
	}

	try {
		const url = `${PLUGSURFING_API_BASE}/stations/${stationId}`;
		
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${PLUGSURFING_API_KEY}`,
				"Content-Type": "application/json",
				"Accept": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Plugsurfing API Fehler: ${response.status}`);
		}

		const station: PlugsurfingStation = await response.json();
		return station;
	} catch (error) {
		console.error(`Fehler beim Abrufen der Station ${stationId}:`, error);
		return null;
	}
}

/**
 * Formatiert Preisdaten für die Anzeige
 */
export function formatPlugsurfingPrice(pricing: PlugsurfingPricing | null): string {
	if (!pricing) {
		return "Preis nicht verfügbar";
	}

	const parts: string[] = [];

	if (pricing.pricePerKwh !== null) {
		parts.push(`${pricing.pricePerKwh.toFixed(2)} ${pricing.currency}/kWh`);
	}
	if (pricing.pricePerMinute !== null) {
		parts.push(`${pricing.pricePerMinute.toFixed(2)} ${pricing.currency}/Min`);
	}
	if (pricing.pricePerSession !== null) {
		parts.push(`${pricing.pricePerSession.toFixed(2)} ${pricing.currency}/Session`);
	}

	return parts.length > 0 ? parts.join(" + ") : "Preis nicht verfügbar";
}

/**
 * Formatiert Verfügbarkeitsstatus für die Anzeige
 */
export function formatPlugsurfingAvailability(
	availability: PlugsurfingStation["availability"],
): string {
	return `${availability.available}/${availability.total} verfügbar`;
}


