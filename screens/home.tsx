import React, { useState } from "react";
import { View, Text, Button, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme";
import { Picker } from "@react-native-picker/picker";
import CustomPicker from "../components/CustomPickers";

export function HomeScreen(props) {
	const navigation = useNavigation();
	const [selectedValue, setSelectedValue] = useState(""); // Zustand für die ausgewählte Option im Picker
	const handlePickerSelect = (value) => {
		console.log("Selected value:", value);
		// Fügen Sie hier die gewünschte Logik für die Behandlung des ausgewählten Werts hinzu
	};

	return (
		<View
			style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
		>
			<CustomPicker onSelect={handlePickerSelect} />
		</View>
	);
}
