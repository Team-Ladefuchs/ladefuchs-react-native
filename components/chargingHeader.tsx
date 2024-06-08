import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme";
import CCS from "@assets/ccs.svg";
import Typ2 from "@assets/typ2.svg";

export function ChargingTableHeader(): JSX.Element {
	const plugOpacity = 0.45;
	return (
		<View style={styles.headerContainer}>
			<View style={styles.headerView}>
				<Text style={{ ...styles.headerText, marginRight: 8 }}>AC</Text>
				<Typ2 width={28} height={23} opacity={plugOpacity} />
			</View>
			<View style={styles.divider} />
			<View style={styles.headerView}>
				<Text style={{ ...styles.headerText, marginRight: 8 }}>DC</Text>
				<CCS width={30} height={36} opacity={plugOpacity} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		height: 60,
		backgroundColor: colors.ladefuchsDarkBackground,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2, // Shadow at the bottom
		},
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 5, // For Android shadow
		zIndex: 1, // Ensures the shadow is above other views
	},
	headerText: {
		fontSize: 28,
		color: "black",
		fontFamily: "Roboto",
	},
	headerView: {
		flex: 1,
		flexDirection: "row",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	divider: {
		width: 1,
		backgroundColor: "white",
		height: "100%", // Ensures the divider spans the entire height
	},
});

export default ChargingTableHeader;
