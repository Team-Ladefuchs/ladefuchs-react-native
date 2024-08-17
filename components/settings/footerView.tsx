import React from "react";
import { View, Text } from "react-native";
import { colors, styles } from "../../theme";
import Constants from "expo-constants";
import { ScaledSheet } from "react-native-size-matters";

const expoVersion = Constants.expoConfig?.version ?? "";

export function AppFooter() {
	return (
		<View style={footerStyle.footerContainer}>
			<Text style={[styles.italicText, footerStyle.text]}>
				Handgefertigt aus ❤️ zur Elektromobilität in{"\n"} 👑 Aachen, ⚒️
				Ahlen und 🦅 Brandenburg
			</Text>
			<Text
				style={[
					styles.italicText,
					footerStyle.versionText,
					footerStyle.text,
				]}
			>
				v{expoVersion}
			</Text>
		</View>
	);
}

const footerStyle = ScaledSheet.create({
	footerContainer: {
		marginTop: "10@s",
		paddingBottom: "40@s",
		paddingTop: "18@s",
		backgroundColor: colors.ladefuchsDunklerBalken,
	},
	text: {
		textAlign: "center",
	},
	versionText: {
		opacity: 0.4,
		marginTop: "4@s",
	},
});
