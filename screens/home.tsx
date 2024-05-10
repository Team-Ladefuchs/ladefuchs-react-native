import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { colors } from "../theme";
import OperatorPicker from "../components/operatorPicker";
import { useFonts } from "expo-font";
import { setSelectedValue } from "../types/operator";
import { TariffsTable } from "../components/tariffsTable";
import { Footer } from "../components/footer";
import { ChargingTableHeader } from "../components/chargingHeader";
import { AppDataContext, AppDataProvider } from "../contexts/appDataContext";
import { TariffCondition } from "../types/conditions";

export function HomeScreen() {
	const [fontsLoaded] = useFonts({
		Bitter: require("../assets/fonts/Bitter-Italic.ttf"),
		// Fügen Sie hier weitere Schriftarten hinzu, falls erforderlich
		Roboto: require("../assets/fonts/Roboto-Bold.ttf"),
	});

	const {
		operatorId,
		setOperatorId,
		chargingConditions,
		operators,
		setTariffConditions,
		tariffConditions,
	} = useContext(AppDataContext);

	// lade die conditions aus dem cache wenn sich der operator geandert hat
	useEffect(() => {
		if (!operatorId) {
			return;
		}
		const tariffConditions = chargingConditions.find(
			(item) => item.operatorId === operatorId
		)?.tariffConditions;

		if (tariffConditions) {
			setTariffConditions(tariffConditions);
		}
	}, [operatorId, setOperatorId, setTariffConditions, chargingConditions]);

	// der erste operator aus der liste der aktuelle beim start
	useEffect(() => {
		const firstOperator = operators[0];
		if (!firstOperator) {
			return;
		}
		setOperatorId(firstOperator.identifier);
	}, [operators, setOperatorId]);

	const handlePickerSelect = (operatorId) => {
		console.log("selected operatorId", operatorId);
		setSelectedValue(operatorId);
	};

	if (!fontsLoaded) {
		return <View></View>;
	}

	return (
		<View style={{ flex: 1 }}>
			<ChargingTableHeader />
			<View
				style={{
					flex: 58, // Höhe des verfügbaren Platzes
					backgroundColor: colors.background,
				}}
			>
				<TariffsTable tariffConditions={tariffConditions} />
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
				<Text
					style={{
						color: "black",
						fontFamily: "Roboto",
						fontSize: 16,
					}}
				>
					AN WELCHER SÄULE STEHST DU?
				</Text>
			</View>
			<View
				style={{
					flex: 30,
					alignItems: "center",
				}}
			>
				<OperatorPicker onSelect={handlePickerSelect} />
			</View>
			<Footer />
		</View>
	);
}
