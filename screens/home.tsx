import React, { useState } from "react";
import { View, Text } from "react-native";
import { colors } from "../theme";
import OperatorPicker from "../components/operatorPicker";
import { useFonts } from "expo-font";
import { setSelectedValue } from "../types/operator";
import { useQuery } from "@tanstack/react-query";
import { fetchAllApiData } from "../functions/api";
import { TariffsTable } from "../components/tariffsTable";
import { Footer } from "../components/footer";
import { ChargingTableHeader } from "../components/chargingHeader";
import { AppDataProvider } from "../contexts/appDataContext";
import { TariffCondition } from "../types/conditions";

export function HomeScreen(props) {
	const [fontsLoaded] = useFonts({
		Bitter: require("../assets/fonts/Bitter-Italic.ttf"),
		// Fügen Sie hier weitere Schriftarten hinzu, falls erforderlich
		Roboto: require("../assets/fonts/Roboto-Bold.ttf"),
	});

	const left = {
		cardImage: require("../assets/icon_mail.png"),
		priceString: "0,45" /* Add other properties */,
	};
	const right = {
		cardImage: require("../assets/icon_masto.png"),
		priceString: "0,66" /* Add other properties */,
	};

	const [tariffConditions, setTariffConditions] = useState<TariffCondition[]>(
		[]
	);

	const allApiData = useQuery({
		queryKey: ["AllApiData"],
		queryFn: async () => {
			return await fetchAllApiData();
		},
	});

	const handlePickerSelect = (operatorId) => {
		setSelectedValue(operatorId);
		console.log("selected operatorId", operatorId);
		const tariffConditions = allApiData.data.chargingConditions.find(
			(item) => item.operatorId === operatorId
		)?.tariffConditions;

		// console.log("conditionsByOperator tariffConditions", tariffConditions);
		if (tariffConditions) {
			setTariffConditions(tariffConditions);
		}
	};

	if (allApiData.isPending || allApiData.error) {
		return null;
	}
	if (!fontsLoaded) {
		return <View></View>;
	}

	return (
		<AppDataProvider value={allApiData.data}>
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
						"AN WELCHER SÄULE STEHST DU?"
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
		</AppDataProvider>
	);
}
