import { useEffect, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showLocationPermissionHint } from "../functions/util/infoModule";

const LOCATION_HINT_STORAGE_KEY = "locationPermissionHintShown";

export function useLocationPermissionHint() {
	const [shouldShowHint, setShouldShowHint] = useState(false);

	useEffect(() => {
		if (Platform.OS !== "ios") {
			return;
		}

		const checkAndShowHint = async () => {
			try {
				const hasShownHint = await AsyncStorage.getItem(LOCATION_HINT_STORAGE_KEY);
				if (!hasShownHint) {
					await showLocationPermissionHint();
					await AsyncStorage.setItem(LOCATION_HINT_STORAGE_KEY, "true");
					setShouldShowHint(false);
				}
			} catch (error) {
				console.error("Fehler beim Anzeigen des Standortfreigabe-Hinweises:", error);
			}
		};

		checkAndShowHint();
	}, []);

	return { shouldShowHint };
}

