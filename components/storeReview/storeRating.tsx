import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Platform,
	Linking,
	TouchableOpacity,
	Alert,
} from "react-native";
import * as StoreReview from "expo-store-review";
import { Line } from "../settings/line";
import { scale } from "react-native-size-matters";
import { styles } from "@theme";
import i18n from "@translations/translations";
import FavStar from "@assets/favorite/favstern.svg";
import {
	retrieveFromStorage,
	saveToStorage,
} from "../../functions/storage/storage";

// Konstanten
const ONE_MONTH = 3600 * 24 * 30 * 1000; // 1 Monat in Millisekunden
const appStoreUrl =
	"itms-apps://itunes.apple.com/app/viewContentsUserReviews/id1522882164?action=write-review";
const playStoreUrl =
	"market://details?id=app.ladefuchs.android&showAllReviews=true";
const lastReviewPrompt = "lastReviewPrompt";
const hasReviewedKey = "hasReviewed"; // Neuer Schlüssel für die Überprüfung

export function Rating(): JSX.Element {
	const [hasReviewed, setHasReviewed] = useState(false);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const checkReviewPrompt = async () => {
		try {
			const reviewedStatus = await retrieveFromStorage(hasReviewedKey);

			// Überprüfen, ob der Benutzer bereits eine Bewertung abgegeben hat
			if (reviewedStatus) {
				setHasReviewed(true);
				return;
			}

			const lastReviewPromptDate = Number(
				(await retrieveFromStorage(lastReviewPrompt)) ?? 0,
			);
			const now = Date.now();

			// Speichern des aktuellen Datums, wenn dies die erste Aufforderung ist
			if (!lastReviewPromptDate) {
				await saveToStorage(lastReviewPrompt, now);
				return;
			}

			// Review-Prompt anzeigen, wenn mehr als ein Monat seit dem letzten vergangen ist
			if (now - lastReviewPromptDate >= ONE_MONTH) {
				await saveToStorage(lastReviewPrompt, now);
				await requestReview();
			}
		} catch (error) {
			console.log("error during review prompt", error);
		}
	};

	const openStoreLink = () => {
		const url = Platform.OS === "ios" ? appStoreUrl : playStoreUrl;
		Linking.openURL(url);
	};

	// Bewertungsfunktion für Geräte, die Store Review unterstützen
	const requestReview = async () => {
		if (await StoreReview.isAvailableAsync()) {
			await StoreReview.requestReview();
			await saveToStorage(hasReviewedKey, true); // Markieren, dass eine Bewertung abgegeben wurde
			setHasReviewed(true);
		} else {
			openStoreLink();
			await saveToStorage(hasReviewedKey, true);
			setHasReviewed(true);
		}
	};

	useEffect(() => {
		checkReviewPrompt();
	}, [checkReviewPrompt]);

	const handleReviewPress = () => {
		if (hasReviewed) {
			Alert.alert(
				i18n.t("reviewAlreadyGiven"),
				i18n.t("noFurtherReview"),
			);
		} else {
			requestReview();
		}
	};

	return (
		<View style={styles.headLine}>
			<Text style={styles.headLine}>
				{i18n.t("foxRating")} <FavStar height="25" width="25" />
			</Text>
			<TouchableOpacity
				activeOpacity={0.8}
				hitSlop={scale(10)}
				onPress={handleReviewPress}
			>
				<Text style={styles.settingsLink}>{i18n.t("appRating")}</Text>
			</TouchableOpacity>
			<Line style={{ marginTop: scale(16) }} />
		</View>
	);
}
