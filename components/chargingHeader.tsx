import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../theme";
import CCS from "../assets/ccs.svg";
import Typ2 from "../assets/typ2.svg";

export function ChargingTableHeader() {
	return (
		<View
			style={{ flexDirection: "row", alignItems: "center", height: 60 }}
		>
			<View style={styles.headerView}>
				<Text style={styles.headerText}>AC</Text>
				<Typ2 width={30} marginLeft={4} />
			</View>
			<View
				style={{
					width: 1, // Adjust space width as needed
					backgroundColor: "white", // Set space background color
				}}
			/>
			<View style={styles.headerView}>
				<Text style={styles.headerText}>DC</Text>
				<CCS height={40} width={40} marginLeft={2} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	headerText: {
		fontSize: 33,
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
