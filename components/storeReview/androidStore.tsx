import { Linking } from "react-native";

const androidPackageName = "app.ladefuchs.android";
// Open the Android Play Store in the browser -> redirects to Play Store on Android
Linking.openURL(
	`https://play.google.com/store/apps/details?id=${androidPackageName}&showAllReviews=true`,
);
// Open the Android Play Store directly
Linking.openURL(
	`market://details?id=${androidPackageName}&showAllReviews=true`,
);
