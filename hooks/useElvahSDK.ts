import { useEffect } from "react";
import { Platform } from "react-native";
import { setElvahAPIKey, setElvahSimulatorMode } from "../functions/util/infoModule";
import { retrieveFromStorage } from "../functions/storage/storage";

const ELVAH_SIMULATOR_MODE_KEY = "elvahSimulatorMode";

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

		const initializeSDK = async () => {
			// Prüfe zuerst, ob Simulator-Modus aktiviert ist
			const useSimulator = await retrieveFromStorage<boolean>(ELVAH_SIMULATOR_MODE_KEY);
			
			if (useSimulator === true) {
				// Simulator-Modus aktivieren
				console.log("useElvahSDK: Simulator-Modus ist aktiviert");
				try {
					await setElvahSimulatorMode(true);
					console.log("useElvahSDK: Simulator-Modus erfolgreich aktiviert");
				} catch (error) {
					console.error("useElvahSDK: Fehler beim Aktivieren des Simulator-Modus:", error);
				}
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
			try {
				await setElvahAPIKey(trimmedKey);
				console.log("useElvahSDK: API-Key erfolgreich gesetzt");
			} catch (error) {
				console.error("useElvahSDK: Fehler beim Setzen des API-Keys:", error);
			}
		};

		initializeSDK();
	}, []);
}

