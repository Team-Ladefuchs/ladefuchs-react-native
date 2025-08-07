import React, { JSX } from "react";
import { View, Text } from "react-native";
import { colors } from "../../../theme";
import CCS from "@assets/plugs/ccs.svg";
import Typ2 from "@assets/plugs/typ2.svg";
import { ScaledSheet, scale } from "react-native-size-matters";

export function ChargingTableHeader(): JSX.Element {
	const plugOpacity = 0.5;
	return (
		<View style={styles.headerContainer}>
			<View style={styles.headerView}>
				<Text style={styles.headerText}>AC</Text>
				<Typ2
					width={scale(26)}
					height={scale(21)}
					opacity={plugOpacity}
				/>
			</View>
			<View style={styles.divider} />
			<View style={styles.headerView}>
				<Text style={styles.headerText}>DC</Text>
				<CCS
					width={scale(28)}
					height={scale(32)}
					opacity={plugOpacity}
				/>
			</View>
		</View>
	);
}

const styles = ScaledSheet.create({
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		height: "51@s",
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
		marginRight: 8,
		fontSize: "26@s",
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
