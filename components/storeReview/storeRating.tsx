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

const appStoreUrl =
	"itms-apps://itunes.apple.com/app/viewContentsUserReviews/id1522882164?action=write-review";
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

			if (reviewedStatus) {
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
			const oneMonth = 3600 * 24 * 30 * 1000; // 1 month in ms
			if (now - lastReviewPromptDate >= oneMonth) {
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
			// fallback links to web url
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
