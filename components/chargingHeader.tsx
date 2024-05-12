import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../theme";

export function ChargingTableHeader() {
	return (
		<View
			style={{ flexDirection: "row", alignItems: "center", height: 60 }}
		>
			<View style={styles.headerView}>
				<Text style={styles.headerText}>AC</Text>
				<Image
					source={require("../assets/typ2.png")} // Pfad zum Bild für AC anpassen
					style={styles.headerImage}
				/>
			</View>
			<View
				style={{
					width: 1, // Adjust space width as needed
					backgroundColor: "white", // Set space background color
				}}
			/>
			<View style={styles.headerView}>
				<Text style={styles.headerText}>DC</Text>
				<Image
					source={require("../assets/ccs.png")} // Pfad zum Bild für DC anpassen
					style={{
						width: 28,
						height: 34,
						marginLeft: 4,
						resizeMode: "contain",
					}}
				/>
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
