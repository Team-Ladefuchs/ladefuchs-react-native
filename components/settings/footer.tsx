import React from "react";
import { View, Text } from "react-native";
import { colors, styles } from "../../theme";
import Constants from "expo-constants";
import { ScaledSheet } from "react-native-size-matters";
import i18n from "@translations/translations";

const expoVersion = Constants.expoConfig?.version ?? "";

export function Footer(): JSX.Element {
	return (
		<View style={footerStyle.footerContainer}>
			<Text style={[footerStyle.text]}>{i18n.t("footer")}</Text>
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
		paddingBottom: "24@s",
		paddingTop: "18@s",
		backgroundColor: colors.ladefuchsDunklerBalken,
	},
	text: {
		textAlign: "center",
		color: "black",
		fontFamily: "Bitter",
	},
	versionText: {
		opacity: 0.4,
		marginTop: "4@s",
	},
});
