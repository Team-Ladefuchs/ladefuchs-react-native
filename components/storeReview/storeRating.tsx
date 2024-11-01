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

// Konstanten für den URL und Speicher
const ONE_MONTH = 3600 * 24 * 30 * 1000; // 1 Monat in Millisekunden
const appStoreUrl =
	"itms-apps://itunes.apple.com/app/id1522882164?action=write-review";
const appStoreWebUrl =
	"https://itunes.apple.com/app/id1522882164?action=write-review";
const playStoreUrl =
	"market://details?id=app.ladefuchs.android&showAllReviews=true";
const playStoreWebUrl =
	"https://play.google.com/store/apps/details?id=app.ladefuchs.android&showAllReviews=true";

const lastReviewPrompt = "lastReviewPrompt";
const hasReviewedKey = "hasReviewed";

export function Rating(): JSX.Element {
	const [hasReviewed, setHasReviewed] = useState(false);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const checkReviewPrompt = async () => {
		try {
			const reviewedStatus = await retrieveFromStorage(hasReviewedKey);

			// Benutzer hat bereits eine Bewertung abgegeben
			if (reviewedStatus) {
				setHasReviewed(true);
				return;
			}

			const lastReviewPromptDate = Number(
				(await retrieveFromStorage(lastReviewPrompt)) ?? 0,
			);
			const now = Date.now();

			// Speichere das aktuelle Datum, wenn dies die erste Aufforderung ist
			if (!lastReviewPromptDate) {
				await saveToStorage(lastReviewPrompt, now);
				return;
			}

			// Prüfe, ob ein Monat seit der letzten Aufforderung vergangen ist
			if (now - lastReviewPromptDate >= ONE_MONTH) {
				await saveToStorage(lastReviewPrompt, now);
				await requestStoreReview();
			}
		} catch (error) {
			console.log("Error during review prompt:", error);
		}
	};

	const openStoreLink = () => {
		const url = Platform.OS === "ios" ? appStoreUrl : playStoreUrl;
		const webUrl = Platform.OS === "ios" ? appStoreWebUrl : playStoreWebUrl;

		Linking.openURL(url).catch(() => {
			// Falls itms-apps oder market Link fehlschlägt, öffne die Web-URL
			Linking.openURL(webUrl).catch((err) => {
				console.log("Error opening Web URL:", err);
				Alert.alert(i18n.t("error"), i18n.t("unableToOpenStore"));
			});
		});
	};

	const requestStoreReview = async () => {
		await saveToStorage(hasReviewedKey, true);
		setHasReviewed(true);
		if (await StoreReview.isAvailableAsync()) {
			await StoreReview.requestReview();
		} else {
			openStoreLink(); // Fallback zu App Store/Play Store Link
		}
	};

	useEffect(() => {
		checkReviewPrompt();
	}, [checkReviewPrompt]);

	const handleReviewPress = () => {
		if (hasReviewed) {
			// Wenn bereits eine Bewertung abgegeben wurde, zeige einen Alert mit Link an
			Alert.alert(
				i18n.t("reviewAlreadyGiven"),
				i18n.t("noFurtherReview"),
				[
					{
						text: i18n.t("viewReview"),
						onPress: openStoreLink,
					},
					{ text: i18n.t("ok"), style: "cancel" },
				],
			);
		} else {
			requestStoreReview();
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
