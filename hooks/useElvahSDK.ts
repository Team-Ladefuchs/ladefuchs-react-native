import { useEffect } from "react";
import { Platform } from "react-native";
import { setElvahAPIKey } from "../functions/util/infoModule";

// API-Key aus Umgebungsvariable lesen
// Für Produktion: In .env Datei speichern: ELVAH_API_KEY=dein-api-key-hier
const ELVAH_API_KEY_RAW = process.env.ELVAH_API_KEY || "";

// API-Key aus dem String extrahieren (falls der vollständige String übergeben wurde)
function extractAPIKey(rawKey: string): string {
	if (!rawKey || rawKey.trim() === "") {
		return "";
	}
	// Prüfe, ob der String den vollständigen Format enthält
	const apiKeyMatch = rawKey.match(/api-key=([^\s]+)/);
	if (apiKeyMatch && apiKeyMatch[1]) {
		return apiKeyMatch[1];
	}
	// Falls nicht, verwende den String direkt (bereits nur der API-Key)
	return rawKey;
}

const ELVAH_API_KEY = extractAPIKey(ELVAH_API_KEY_RAW);

/**
 * Hook zur Initialisierung des elvah SDK mit API-Key beim App-Start
 * 
 * WICHTIG: Den API-Key in der .env Datei eintragen:
 * ELVAH_API_KEY=dein-api-key-hier
 * 
 * Oder direkt oben in der Datei eintragen (nicht empfohlen für Produktion)
 */
export function useElvahSDK() {
	useEffect(() => {
		// Nur auf iOS initialisieren
		if (Platform.OS !== "ios") {
			return;
		}

		// Prüfen, ob API-Key vorhanden ist
		if (!ELVAH_API_KEY || ELVAH_API_KEY.trim() === "") {
			console.warn(
				"ELVAH_API_KEY ist nicht gesetzt. SDK wird im Simulator-Modus laufen. Bitte in .env Datei eintragen: ELVAH_API_KEY=dein-api-key-hier"
			);
			return;
		}

		// API-Key setzen
		console.log("useElvahSDK: Setze API-Key...");
		setElvahAPIKey(ELVAH_API_KEY)
			.then(() => {
				console.log("useElvahSDK: API-Key erfolgreich gesetzt");
			})
			.catch((error) => {
				console.error("useElvahSDK: Fehler beim Setzen des API-Keys:", error);
			});
	}, []);
}

