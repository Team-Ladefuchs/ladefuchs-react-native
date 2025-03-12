import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import { useAppStore } from "../../state/appState";
import { colors, styles as themeStyles } from "../../theme";
import i18n from "../../translations/translations";

export function DarkModeSettings(): JSX.Element {
	const { isDarkMode, setDarkMode } = useAppStore();

	const textStyle = isDarkMode
		? themeStyles.darkModeText
		: themeStyles.lightModeText;
	const headlineStyle = isDarkMode
		? themeStyles.darkModeHeadline
		: themeStyles.lightModeHeadline;
	const containerStyle = isDarkMode
        ? themeStyles.darkModeBackground
        : themeStyles.lightModeBackground;

	return (
		<View style={containerStyle}>
			<Text style={headlineStyle}>{i18n.t("darkMode")}</Text>

			<View style={styles.settingRow}>
				<View style={styles.textContainer}>
					<Text style={textStyle}>
						{i18n.t("darkModeDescription")}
					</Text>
				</View>
				<Switch
					value={isDarkMode}
					onValueChange={setDarkMode}
					trackColor={{
						false: "#767577",
						true: colors.ladefuchsOrange,
					}}
					thumbColor="#f4f3f4"
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({

	settingRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomColor: colors.ladefuchsDunklerBalken,

	},
	textContainer: {
		flex: 1,
		marginRight: scale(10),
	},
	settingTitle: {
		fontSize: scale(16),
		fontWeight: "500",
        marginLeft: scale(15),
	},
	settingDescription: {
        color: "black",
        fontFamily: "Bitter",
		marginTop: scale(4),
        marginLeft: scale(15),
	},
});
