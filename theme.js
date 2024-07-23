// theme.js
import { scale } from "react-native-size-matters";

const colors = {
	primary: "#00700",
	ladefuchsLightBackground: "#F3EEE2",
	ladefuchsDarkBackground: "#C2B49C",
	ladefuchsLightGrayBackground: "rgba(194,180,156, 0.4)", // 20% opacity
	ladefuchsDarkGrayBackground: "rgba(194,180,156,0.6)", //dunkler Balken
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

const styles = {
	scrollView: {
		backgroundColor: colors.ladefuchsLightBackground,
	},
	headerView: {
		paddingHorizontal: scale(20),
		paddingVertical: scale(20),
	},
	headLine: {
		color: colors.ladefuchsOrange,
		fontFamily: "Roboto",
		fontSize: 20,
		lineHeight: 20,
	},
	headerText: {
		color: "black",
		fontFamily: "Bitter",
		fontSize: 15,
		lineHeight: 20,
	},
	sponsorText: {
		color: "black",
		fontFamily: "Bitter",
		fontSize: 15,
		lineHeight: 20,
		paddingBottom: 15,
	},
	sponsorTextLink: {
		color: "#f45c2d",
		fontFamily: "Bitter",
		fontSize: 15,
		lineHeight: 20,
		paddingBottom: 15,
	},
	arrow:{
		fontSize: 40,
		color: '#f45c2d',
		paddingLeft: 10,
	},
};
export { colors, fonts, styles };
