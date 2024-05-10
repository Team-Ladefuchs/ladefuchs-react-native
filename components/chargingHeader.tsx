import { View, Text, Image } from "react-native";
import { colors } from "../theme";

export function ChargingTableHeader() {
	return (
		<View style={{ flexDirection: "row", alignItems: "center" }}>
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					paddingVertical: 15,
					backgroundColor: colors.ladefuchsDarkBackground,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text
					style={{
						color: "black",
						fontFamily: "Roboto",
						fontSize: 26,
					}}
				>
					AC{" "}
				</Text>
				<Image
					source={require("../assets/typ2.png")} // Pfad zum Bild für AC anpassen
					style={{ width: 26, height: 26, resizeMode: "contain" }} // Stil des Bildes anpassen
				/>
			</View>
			<View
				style={{
					width: 1, // Adjust space width as needed
					backgroundColor: "white", // Set space background color
				}}
			/>
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					paddingVertical: 15,
					backgroundColor: colors.ladefuchsDarkBackground,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text
					style={{
						color: "black",
						fontFamily: "Roboto",
						fontSize: 26,
					}}
				>
					DC{" "}
				</Text>
				<Image
					source={require("../assets/ccs.png")} // Pfad zum Bild für DC anpassen
					style={{ width: 26, height: 29, resizeMode: "contain" }} // Stil des Bildes
				/>
			</View>
		</View>
	);
}
