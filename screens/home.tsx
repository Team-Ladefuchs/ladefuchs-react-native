import React from "react";
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Linking,
	ScrollView,
} from "react-native";
import { colors } from "../theme";
import OperatorPicker from "../components/operatorPicker";
import { useFonts } from "expo-font";
import Tariffs from "../components/tariffs";
import { setSelectedValue } from "../types/operator";

export function HomeScreen(props) {
	const handlePickerSelect = (value) => {
		setSelectedValue(value);
		console.log("Home value:", value);
		// OperatorId aus dem Picker
	};
	const [fontsLoaded] = useFonts({
		Bitter: require("../assets/fonts/Bitter-Italic.ttf"),
		// Fügen Sie hier weitere Schriftarten hinzu, falls erforderlich
		Roboto: require("../assets/fonts/Roboto-Bold.ttf"),
	});

	if (!fontsLoaded) {
		return <View></View>;
	}

	const left = {
		cardImage: require("../assets/icon_mail.png"),
		priceString: "0,45" /* Add other properties */,
	};
	const right = {
		cardImage: require("../assets/icon_masto.png"),
		priceString: "0,66" /* Add other properties */,
	};
	const viewModel = { left, right /* Add other properties */ };

	return (
		<View style={{ flex: 1 }}>
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
						style={{ width: 26, height: 29, resizeMode: "contain" }} // Stil des Bildes anpassen
					/>
				</View>
			</View>

			<View
				style={{
					flex: 58, // Höhe des verfügbaren Platzes
					backgroundColor: colors.background,
				}}
			>
				<ScrollView>
					<Tariffs viewModel={viewModel} />
				</ScrollView>
			</View>
			<View
				style={{
					flex: 3, // 3% Höhe des verfügbaren Platzes
					paddingVertical: 10,
					backgroundColor: colors.ladefuchsDarkBackground,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{[
					{
						text: "AN WELCHER SÄULE STEHST DU?",
						style: {
							color: "black",
							fontFamily: "Roboto",
							fontSize: 16,
						},
					}, // Stil für die zweite Zeile
				].map((line, index) => (
					<Text key={index} style={line.style}>
						{line.text}
					</Text>
				))}
			</View>
			<View
				style={{
					flex: 30,
					alignItems: "center",
					justifyContent: "top",
				}}
			>
				<OperatorPicker onSelect={handlePickerSelect} />
			</View>
			{/* Footer beginnt hier */}
			<View
				style={{
					flex: 10,
					backgroundColor: colors.ladefuchsDarkBackground,
					alignItems: "center",
					height: 65,
					overflow: "visible", // Damit das Bild über den View hinausragt
				}}
			>
				{/* Fügen Sie hier die gewünschten Komponenten für den neuen View ein*/}
				<TouchableOpacity
					onPress={() =>
						Linking.openURL("https://shop.ladefuchs.app")
					}
				>
					<Image
						source={require("../assets/Footershop.png")} // Pfad zum Bild für AC anpassen
						style={{
							width: 250,
							height: 89,
							marginTop: -10,
						}} // Stil des Bildes anpassen
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}
