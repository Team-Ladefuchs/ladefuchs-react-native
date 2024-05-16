import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { colors } from "../theme";
import OperatorPicker from "../components/operatorPicker";
import { useFonts } from "expo-font";
import { ChargeConditionTable } from "../components/chargeConditionTable";
import { Banner } from "../components/banner";
import { ChargingTableHeader } from "../components/chargingHeader";
import { AppStateContext } from "../contexts/appStateContext";
import { repeatNTimes } from "../functions/util";
import { LadefuchsBanner } from "../types/banner";

export function HomeScreen() {
	const [fontsLoaded] = useFonts({
		Bitter: require("../assets/fonts/Bitter-Italic.ttf"),
		// Fügen Sie hier weitere Schriftarten hinzu, falls erforderlich
		Roboto: require("../assets/fonts/Roboto-Bold.ttf"),
	});

	const [selectedBanner, setSelectedBanner] =
		useState<LadefuchsBanner | null>(null);

	const {
		operatorId,
		setOperatorId,
		chargingConditions,
		operators,
		setTariffConditions,
		tariffConditions,
		ladefuchsBanners,
	} = useContext(AppStateContext);

	useEffect(() => {
		const bannerIds = ladefuchsBanners
			.flatMap((item) => repeatNTimes(item, item.frequency))
			.shuffle();

		const c = bannerIds.pickRandom();
		console.log("current ladefuchs banner: ", c.imageUrl);
		setSelectedBanner(c);
	}, [ladefuchsBanners]);
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
		// console.log("selected operatorId", operatorId);
		// setOperatorId(operatorId);
	};

	if (!fontsLoaded) {
		return <View></View>;
	}

	return (
		<View style={{ flex: 1 }}>
			<ChargingTableHeader />
			<View
				style={{
					flex: 75, // Höhe des verfügbaren Platzes
					backgroundColor: colors.ladefuchsLightBackground,
				}}
			>
				<ChargeConditionTable tariffConditions={tariffConditions} />
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
					flex: 26,
					justifyContent: "center",
					backgroundColor: colors.ladefuchsLightBackground,
					paddingTop: 20,
					paddingBottom: 16,
				}}
			>
				<OperatorPicker onSelect={handlePickerSelect} />
			</View>
			{selectedBanner && (
				<Banner
					imageUrl={selectedBanner.imageUrl}
					link={selectedBanner.affiliateLinkUrl}
				/>
			)}
		</View>
	);
}
