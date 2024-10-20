const itunesItemId = 1522882164;
// Open the iOS App Store in the browser -> redirects to App Store on iOS
Linking.openURL(
	`https://apps.apple.com/app/apple-store/id${itunesItemId}?action=write-review`,
);
// Open the iOS App Store directly
Linking.openURL(
	`itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`,
);
