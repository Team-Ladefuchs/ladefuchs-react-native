import { useEffect } from "react";
import { Platform } from "react-native";
import { setElvahAPIKey } from "../functions/util/infoModule";

// API-Key aus Umgebungsvariable lesen
// Für Produktion: In .env Datei speichern: ELVAH_API_KEY=dein-api-key-hier
const ELVAH_API_KEY = process.env.ELVAH_API_KEY || "";

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
		const trimmedKey = ELVAH_API_KEY?.trim() || "";
		if (!trimmedKey) {
			console.warn(
				"ELVAH_API_KEY ist nicht gesetzt. SDK wird im Simulator-Modus laufen. Bitte in .env Datei eintragen: ELVAH_API_KEY=dein-api-key-hier"
			);
			return;
		}

		// API-Key setzen (mit Debugging)
		console.log("useElvahSDK: Setze API-Key...");
		console.log("useElvahSDK: API-Key Länge:", trimmedKey.length);
		console.log("useElvahSDK: API-Key Start:", trimmedKey.substring(0, 10) + "...");
		setElvahAPIKey(trimmedKey)
			.then(() => {
				console.log("useElvahSDK: API-Key erfolgreich gesetzt");
			})
			.catch((error) => {
				console.error("useElvahSDK: Fehler beim Setzen des API-Keys:", error);
			});
	}, []);
}

