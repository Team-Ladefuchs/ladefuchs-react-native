import React, { useEffect } from "react";
import { View, Text, Platform, Linking, TouchableOpacity } from "react-native";
import * as StoreReview from "expo-store-review";
import { Line } from "../settings/line";
import { scale } from "react-native-size-matters";
import { styles } from "@theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@translations/translations";

export function Rating(): JSX.Element {
	const appStoreUrl =
		"itms-apps://itunes.apple.com/app/viewContentsUserReviews/id1522882164?action=write-review"; // Ersetze mit deinem echten App Store Link
	const playStoreUrl =
		"market://details?id=app.ladefuchs.android&showAllReviews=true`"; // Ersetze mit deinem echten Play Store Link
	const REVIEW_KEY = "lastReviewPrompt"; // Schlüssel zum Speichern des Datums der letzten Bewertungsaufforderung
	const ONE_MONTH = 60 * 60 * 1000; // 1h in Millisekunden

	// Funktion zur App Store Weiterleitung, basierend auf dem Betriebssystem
	const openStoreLink = () => {
		const url = Platform.OS === "ios" ? appStoreUrl : playStoreUrl;
		Linking.openURL(url);
	};

	// Bewertungsfunktion für Geräte, die Store Review unterstützen
	const requestReview = async () => {
		if (await StoreReview.isAvailableAsync()) {
			await StoreReview.requestReview();
		} else {
			openStoreLink(); // Fallback zu App Store/Play Store Link
		}
	};

	// Überprüfe, ob die Bewertungsaufforderung gezeigt werden soll
	const checkReviewPrompt = async () => {
		try {
			const lastPromptDate = await AsyncStorage.getItem(REVIEW_KEY);
			const now = Date.now();

			if (!lastPromptDate) {
				// Falls kein Datum gespeichert ist, speichere das aktuelle Datum
				await AsyncStorage.setItem(REVIEW_KEY, now.toString());
			} else if (now - parseInt(lastPromptDate) >= ONE_MONTH) {
				// Zeige die Bewertungsaufforderung, wenn mehr als ein Monat vergangen ist
				await requestReview();
				// Speichere das Datum der letzten Bewertungsaufforderung
				await AsyncStorage.setItem(REVIEW_KEY, now.toString());
			}
		} catch (error) {
			console.log("Fehler beim Überprüfen des Review-Prompts:", error);
		}
	};

	useEffect(() => {
		checkReviewPrompt(); // Prüfe bei jedem App-Start, ob die Aufforderung gezeigt werden soll
	}, []);

	return (
		<View style={styles.headLine}>
			<TouchableOpacity activeOpacity={0.8} hitSlop={scale(10)}>
				<Text style={styles.headLine} onPress={requestReview}>
					{i18n.t("appRating")}
				</Text>
			</TouchableOpacity>
			<Line style={{ marginTop: scale(16) }} />
		</View>
	);
}
