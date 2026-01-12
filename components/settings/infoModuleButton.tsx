import React, { JSX, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { styles } from "../../theme";
import { scale } from "react-native-size-matters";
import SwiftIcon from "../../assets/generic/swift.svg";
import { showHelloWorld, setElvahSimulatorMode, setElvahAPIKey } from "../../functions/util/infoModule";
import { Checkbox } from "../shared/checkBox";
import { saveToStorage, retrieveFromStorage } from "../../functions/storage/storage";

const ELVAH_SIMULATOR_MODE_KEY = "elvahSimulatorMode";
const ELVAH_API_KEY = process.env.ELVAH_API_KEY || "";

export function InfoModuleButton(): JSX.Element {
	const isIOS = Platform.OS === "ios";
	const isAndroid = Platform.OS === "android";
	const [useSimulator, setUseSimulator] = useState(false);

	// Lade gespeicherten Simulator-Modus beim Start
	useEffect(() => {
		if (!isIOS) {
			return;
		}
		const loadSimulatorMode = async () => {
			try {
				const saved = await retrieveFromStorage<boolean>(ELVAH_SIMULATOR_MODE_KEY);
				if (saved !== null) {
					setUseSimulator(saved);
					// Setze den Modus im SDK
					await setElvahSimulatorMode(saved);
				}
			} catch (error) {
				console.error("Fehler beim Laden des Simulator-Modus:", error);
			}
		};
		loadSimulatorMode();
	}, [isIOS]);

	if (!isIOS && !isAndroid) {
		return <></>;
	}

	const handleSimulatorToggle = async (value: boolean) => {
		setUseSimulator(value);
		try {
			// Speichere den Modus
			await saveToStorage(ELVAH_SIMULATOR_MODE_KEY, value);
			
			// Wenn Simulator-Modus deaktiviert wird, stelle sicher, dass API-Key gesetzt ist
			if (!value) {
				const trimmedKey = ELVAH_API_KEY?.trim() || "";
				if (trimmedKey) {
					console.log("InfoModuleButton: Setze API-Key beim Deaktivieren des Simulator-Modus...");
					try {
						await setElvahAPIKey(trimmedKey);
						console.log("InfoModuleButton: API-Key erfolgreich gesetzt");
					} catch (apiKeyError) {
						console.warn("InfoModuleButton: Fehler beim Setzen des API-Keys:", apiKeyError);
						// Weiter mit setSimulatorMode, auch wenn API-Key-Setzen fehlschlägt
					}
				} else {
					console.warn("InfoModuleButton: Kein API-Key in Umgebungsvariable gefunden");
				}
			}
			
			// Setze den Modus im SDK
			await setElvahSimulatorMode(value);
		} catch (error) {
			console.error("Fehler beim Umschalten des Simulator-Modus:", error);
			// Bei Fehler wieder zurücksetzen
			setUseSimulator(!value);
		}
	};

	return (
		<View style={{ marginBottom: scale(16), marginLeft: scale(15) }}>
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<Text style={styles.headLine}>
					{isIOS ? "elvah Swift SDK" : "elvah Kotlin SDK"}
				</Text>
				{isIOS && <SwiftIcon width={scale(24)} height={scale(24)} />}
			</View>
			{isIOS && (
				<View style={{ marginTop: scale(8), flexDirection: "row", alignItems: "center" }}>
					<Checkbox checked={useSimulator} onValueChange={handleSimulatorToggle} />
					<Text style={[styles.italicText, { marginLeft: scale(15) }]}>
						Simulator-Modus (für Tests)
					</Text>
				</View>
			)}
			<View style={{ marginTop: scale(8) }}>
				<TouchableOpacity
					activeOpacity={0.8}
					hitSlop={scale(10)}
					onPress={async () => await showHelloWorld()}
					style={{ marginTop: scale(1) }}
				>
					<Text style={styles.settingsLink}>
						{isIOS ? "elvah charge SDK" : "Kelvah charge SDK"}
					</Text>
				</TouchableOpacity>

			</View>
		</View>
	);
}

