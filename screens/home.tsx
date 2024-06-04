import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { colors } from "../theme";
import OperatorPicker from "../components/home/operatorPicker";
import { ChargeConditionTable } from "../components/home/chargeConditionTable";
import { AppBanner } from "../components/home/appBanner";
import { ChargingTableHeader } from "../components/chargingHeader";
import { useAppStore } from "../state/state";

export function HomeScreen(): JSX.Element {
	const {
		operatorId,
		setOperatorId,
		chargingConditions,
		setTariffConditions,
	} = useAppStore(
		useShallow((state) => ({
			operatorId: state.operatorId,
			setOperatorId: state.setOperatorId,
			chargingConditions: state.chargingConditions,
			setTariffConditions: state.setTariffConditions,
		}))
	);

	// lade die conditions aus dem cache wenn sich der operator geandert hat
	useEffect(() => {
		if (!operatorId) {
			return;
		}
		const tariffConditions = chargingConditions.get(operatorId);
		if (tariffConditions) {
			setTariffConditions(tariffConditions);
		}
	}, [operatorId, setOperatorId, setTariffConditions, chargingConditions]);

	return (
		<View style={{ flex: 1 }}>
			<ChargingTableHeader />
			<View
				style={{
					flex: 90, // Höhe des verfügbaren Platzes
					backgroundColor: colors.ladefuchsLightBackground,
				}}
			>
				<ChargeConditionTable />
			</View>
			<View
				style={{
					paddingTop: 12,
					paddingBottom: 12,
					backgroundColor: colors.ladefuchsDarkBackground,
					alignItems: "center",
					justifyContent: "center",
					shadowColor: "#000",
					shadowOffset: { width: 0, height: -2 },
					shadowOpacity: 0.3,
					shadowRadius: 3,
					elevation: 5, // nur für Android
					zIndex:1,
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
					justifyContent: "center",
					backgroundColor: colors.ladefuchsLightBackground,
					paddingTop: 20,
					paddingBottom: 16,
				}}
			>
				<OperatorPicker />
			</View>
			<AppBanner />
		</View>
	);
}
