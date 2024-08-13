// theme.js
import { ScaledSheet } from "react-native-size-matters";

const colors = {
	primary: "#00700",
	ladefuchsLightBackground: "#F3EEE2",
	ladefuchsDarkBackground: "#C2B49C",
	ladefuchsLightGrayBackground: "rgba(194,180,156, 0.4)", // 20% opacity
	ladefuchsDarkGrayBackground: "rgba(194,180,156,0.6)",
	ladefuchsDunklerBalken: "#E0D7C8",
	text: "#343a40",
	ladefuchsOrange: "#F2642D",
	ladefuchsGrayTextColor: "#716B61",
};

const fonts = {
	body: "Roboto",
	heading: "Roboto, serif",
	ladefuchsHeader: "Roboto",
	italicStyle: "italic",
};

const styles = ScaledSheet.create({
	scrollView: {
		backgroundColor: colors.ladefuchsLightBackground,
		paddingHorizontal: "20@s",
		flex: 1,
	},
	headLine: {
		color: colors.ladefuchsOrange,
		fontFamily: "Roboto",
		fontSize: "18@s",
		marginBottom: "10@s",
	},
	headerText: {
		color: "black",
		fontFamily: "Bitter",
		lineHeight: "20@s",
	},
	italicText: {
		color: "black",
		fontFamily: "Bitter",
		lineHeight: "20@s",
	},
	italicTextLink: {
		color: "#f45c2d",
		fontFamily: "Bitter",
		lineHeight: "20@s",
	},
	arrow: {
		fontSize: "40@s",
		color: "#f45c2d",
		paddingLeft: "10@s",
	},
});
export { colors, fonts, styles };
