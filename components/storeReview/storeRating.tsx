import React, { useEffect } from "react";
import { View, Text, Platform, Linking, TouchableOpacity } from "react-native";
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

const ONE_MONTH = 3600 * 24 * 30 * 1000; // 1 Monat in Millisekunden
const appStoreUrl =
	"itms-apps://itunes.apple.com/app/viewContentsUserReviews/id1522882164?action=write-review";
const playStoreUrl =
	"market://details?id=app.ladefuchs.android&showAllReviews=true";
const lastReviewPrompt = "lastReviewPrompt";
const lastreviewPromptRequest = "lastReviewPrompt";

export function Rating(): JSX.Element {
	const checkReviewPrompt = async () => {
		try {
			const lastReviewPromptData =
				await retrieveFromStorage(lastReviewPrompt);
			const lastReviewPromptDate = Number(lastReviewPromptData ?? 0);
			const now = Date.now();

			if (!lastReviewPromptDate) {
				await saveToStorage<number>(lastReviewPrompt, now);
				return;
			}

			if (now - lastReviewPromptDate >= ONE_MONTH) {
				await saveToStorage<number>(lastreviewPromptRequest, now);
				await requestReview();
			}
		} catch (error) {
			console.error("error during review prompt", error);
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
		} else {
			openStoreLink();
		}
	};

	useEffect(() => {
		checkReviewPrompt();
	}, []);

	return (
		<View style={styles.headLine}>
			<Text style={styles.headLine}>
				{i18n.t("foxRating")} <FavStar height="25" width="25" />
			</Text>
			<TouchableOpacity
				activeOpacity={0.8}
				hitSlop={scale(10)}
				onPress={requestReview}
			>
				<Text style={styles.settingsLink}>{i18n.t("appRating")}</Text>
			</TouchableOpacity>
			<Line style={{ marginTop: scale(16) }} />
		</View>
	);
}
