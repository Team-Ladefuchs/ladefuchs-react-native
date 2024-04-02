import React, { useState } from "react";
import {
	View,
	Text,
	Button,
	Image,
	TouchableOpacity,
	Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme";
import { Picker } from "@react-native-picker/picker";
import CustomPicker from "../components/CustomPickers";
import { useFonts } from "expo-font";

export function HomeScreen(props) {
	const navigation = useNavigation();
	const [selectedValue, setSelectedValue] = useState(""); // Zustand für die ausgewählte Option im Picker
	const handlePickerSelect = (value) => {
		console.log("Selected value:", value);
		// Fügen Sie hier die gewünschte Logik für die Behandlung des ausgewählten Werts hinzu
	};
	const [fontsLoaded] = useFonts({
		Bitter: require("../assets/fonts/Bitter-Italic.ttf"),
		// Fügen Sie hier weitere Schriftarten hinzu, falls erforderlich
		Roboto: require("../assets/fonts/Roboto-Bold.ttf"),
	});

	if (!fontsLoaded) {
		return <View></View>;
	}

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
					flex: 50, // 40% Höhe des verfügbaren Platzes
					backgroundColor: colors.background,
				}}
			></View>
			<View
				style={{
					flex: 3, // 20% Höhe des verfügbaren Platzes
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
				<CustomPicker onSelect={handlePickerSelect} />
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
