import { Linking, Platform } from "react-native";

const itunesItemId = 1522882164;
const androidPackageName = "app.ladefuchs.android";

const openStore = () => {
	if (Platform.OS != "android") {
		// Open the iOS App Store directly
		Linking.openURL(
			`itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`,
		);
	} else {
		// Open the Android Play Store directly
		Linking.openURL(
			`market://details?id=${androidPackageName}&showAllReviews=true`,
		);
	}
};
