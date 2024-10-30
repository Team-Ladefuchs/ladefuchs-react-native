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

const ONE_MONTH = 3600 * 24 * 30 * 1000; // 1 month in ms
const appStoreUrl =
	"itms-apps://itunes.apple.com/app/viewContentsUserReviews/id1522882164?action=write-review";
const playStoreUrl =
	"market://details?id=app.ladefuchs.android&showAllReviews=true";
const lastReviewPrompt = "lastReviewPrompt";
const hasReviewedKey = "hasReviewed";

export function Rating(): JSX.Element {
	const [hasReviewed, setHasReviewed] = useState(false);

	const checkReviewPrompt = async () => {
		try {
			const reviewedStatus = await retrieveFromStorage(hasReviewedKey);

			if (reviewedStatus) {
				// check if user already reviewed
				setHasReviewed(true);
				return;
			}

			const lastReviewPromptDate = Number(
				(await retrieveFromStorage(lastReviewPrompt)) ?? 0,
			);
			const now = Date.now();

			if (!lastReviewPromptDate) {
				await saveToStorage(lastReviewPrompt, now);
				return;
			}

			if (now - lastReviewPromptDate >= ONE_MONTH) {
				await saveToStorage(lastReviewPrompt, now);
				await requestStoreReview();
			}
		} catch (error) {
			console.log("error during review prompt", error);
		}
	};

	const openStoreLink = () => {
		const url = Platform.OS === "ios" ? appStoreUrl : playStoreUrl;
		Linking.openURL(url);
	};

	const requestStoreReview = async () => {
		await saveToStorage(hasReviewedKey, true);
		setHasReviewed(true);
		if (await StoreReview.isAvailableAsync()) {
			await StoreReview.requestReview();
		} else {
			openStoreLink();
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
