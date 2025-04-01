// theme.js
import { ScaledSheet } from "react-native-size-matters";

export const colors = {
	// Light Mode Farben
	ladefuchsLightBackground: "#F3EEE2",
	ladefuchsDarkBackground: "#C2B49C",
	ladefuchsLightGrayBackground: "rgba(194,180,156, 0.4)", // 20% opacity
	ladefuchsDarkGrayBackground: "rgba(194,180,156,0.6)",
	ladefuchsDunklerBalken: "#E0D7C8",
	text: "#343a40",
	ladefuchsOrange: "#F2642D",
	ladefuchsGrayTextColor: "#716B61",

	// Dark Mode Farben
	darkModeBackground: "rgba(209, 199, 181, 0.4)",
	darkModeSecondaryBackground: "#1E1E1E",
	darkModeBorder: "#333333"
};

const fonts = {
	body: "Roboto",
	heading: "Roboto, serif",
	ladefuchsHeader: "Roboto",
	italicStyle: "italic",
};

export const styles = ScaledSheet.create({
	headLine: {
		color: colors.ladefuchsOrange,
		textTransform: "uppercase",
		fontFamily: "Roboto",
		fontSize: "18@s",
		marginBottom: "2@s",
	},
	headerText: {
		color: "black",
		fontFamily: "Bitter",
		lineHeight: "20@s",
	},
	settingsLink: {
		fontFamily: "Bitter",
		textDecorationLine: "underline",
	},
	italicText: {
		color: "black",
		fontFamily: "Bitter",
		lineHeight: "20@s",
	},
	arrow: {
		fontSize: "40@s",
		color: "#f45c2d",
		paddingLeft: "10@s",
	},
	// Dark Mode Styles
	darkModeText: {
		color: "#666000",
        fontFamily: "Bitter",
		marginTop: "15@s",
        marginLeft: "15@s",
	},
	lightModeText: {
		color: "colors.darkModeText",
        fontFamily: "Bitter",
		marginTop: "15@s",
        marginLeft: "15@s",
	},
	darkModeHeadline: {
		color: "#F2642D",
		textTransform: "uppercase",
		fontFamily: "Roboto",
		fontSize: "18@s",
		marginBottom: "2@s",
		marginLeft: "15@s",
	},
	lightModeHeadline: {
		color: "#F2642D",
		textTransform: "uppercase",
		fontFamily: "Roboto",
		fontSize: "18@s",
		marginBottom: "2@s",
		marginLeft: "15@s",
	},
	darkModeBackground: {
		backgroundColor: colors.darkModeBackground,
	},
	lightModeBackground: {
		backgroundColor: colors.ladefuchsLightBackground,
	},
});
export { fonts};
