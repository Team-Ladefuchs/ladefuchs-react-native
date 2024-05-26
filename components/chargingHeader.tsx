import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../theme";
import CCS from "../assets/ccs.svg";
import Typ2 from "../assets/typ2.svg";

export function ChargingTableHeader() {
	return (
		<>
			<View style={styles.headerContainer}>
				<View style={styles.headerView}>
					<Text style={{ ...styles.headerText, marginRight: 8 }}>
						AC
					</Text>
					<Typ2 width={28} height={23} opacity="0.45" />
				</View>
				<View
					style={{
						width: 1,
						backgroundColor: "white",
					}}
				/>
				<View style={styles.headerView}>
					<Text style={{ ...styles.headerText, marginRight: 8 }}>
						DC
					</Text>
					<CCS width={30} height={36} opacity="0.45" />
				</View>
				<View
					style={{
						...dropShadow,
						position: "absolute",
						left: 0,
						right: 0,
						bottom: 10,
						opacity: 0.1,
						height: 10,
					}}
				/>
			</View>
		</>
	);
}

const dropShadow = {
	shadowOffset: {
		width: 0,
		height: -2,
	},
	shadowOpacity: 0.2,
	shadowRadius: 3,
	elevation: 4,
};

const styles = StyleSheet.create({
	headerContainer: {
		position: "relative",
		flexDirection: "row",
		alignItems: "center",
		height: 60,
		// Android shadow
	},
	headerText: {
		fontSize: 28,
		color: "black",
		fontFamily: "Roboto",
	},
	headerImage: {
		// width: 28,
		height: 28,
		resizeMode: "contain",
	},
	headerView: {
		flex: 1,
		flexDirection: "row",
		height: "100%",
		backgroundColor: colors.ladefuchsDarkBackground,
		alignItems: "center",
		justifyContent: "center",
	},
});
