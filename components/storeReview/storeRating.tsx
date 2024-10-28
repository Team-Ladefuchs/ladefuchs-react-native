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

const ONE_MONTH = 3600 * 24 * 30 * 1000; // 1month in month

const appStoreUrl =
	"itms-apps://itunes.apple.com/app/viewContentsUserReviews/id1522882164?action=write-review";
const playStoreUrl =
	"market://details?id=app.ladefuchs.android&showAllReviews=true`";

const lastReviewPrompt = "lastReviewPrompt";
const lastreviewPromptRequest = "lastReviewPrompt";

export function Rating(): JSX.Element {
	const checkReviewPrompt = async () => {
		const lastRviewPromptRquestData =
			await retrieveFromStorage(lastReviewPrompt);

		if (lastRviewPromptRquestData) {
			return;
		}
		const lastRviewPromptDate = Number(
			(await retrieveFromStorage(lastReviewPrompt)) ?? 0,
		);
		const now = Date.now();

		if (!lastRviewPromptDate) {
			saveToStorage<number>(lastReviewPrompt, now);
			return;
		}
		try {
			if (
				now - lastRviewPromptDate >= ONE_MONTH &&
				!lastRviewPromptRquestData
			) {
				saveToStorage<number>(lastreviewPromptRequest, now);
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
		} else {
			openStoreLink(); // Fallback zu App Store/Play Store Link
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
			<TouchableOpacity activeOpacity={0.8} hitSlop={scale(10)}>
				<Text style={styles.settingsLink} onPress={requestReview}>
					{i18n.t("appRating")}
				</Text>
			</TouchableOpacity>
			<Line style={{ marginTop: scale(16) }} />
		</View>
	);
}
