// theme.js
const colors = {
	primary: "#00700",
	ladefuchsLightBackground: "#F3EEE2",
	ladefuchsDarkBackground: "#C2B49C",
	ladefuchsLightGrayBackground: "rgba(194,180,156, 0.4)", // 20% opacity
	ladefuchsDarkGrayBackground: "rgba(194,180,156,0.6)", //dunkler Balken
	ladefuchsDunklerBalken: "#E0D7C8",
	text: "#343a40",
	ladefuchsOrange: "#F2642D",
	ladefuchsGrayTextColor: "rgba(0, 0, 0, 0.5)",
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
		paddingHorizontal: 30,
		paddingVertical: 20,
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
	memberView: {
		flexDirection: "row",
		paddingHorizontal: 30,
		paddingVertical: 20,
		color: "black",
		fontFamily: fonts.bitter,
		fontSize: 15,
	},
	memberImage: {
		width: 120,
		height: 120,
		borderRadius: 100,
		marginRight: 30,
	},
	memberText: {
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
	textInput: {
        height: 100, // Erhöhte Höhe für mehrere Zeilen
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '100%',
        alignSelf: 'center',
        textAlignVertical: 'top' // Text beginnt oben
    },
	picker: {
        width: '100%',
        alignSelf: 'center',
    },

    buttonContainer: {
        marginTop: 2,
        width: '80%',
        alignSelf: 'center',
    },
};
export { colors, fonts, styles };
