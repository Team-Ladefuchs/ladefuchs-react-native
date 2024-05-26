import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { colors } from "../theme";
import OperatorPicker from "../components/operatorPicker";
import { ChargeConditionTable } from "../components/chargeConditionTable";
import { Banner } from "../components/banner";
import { ChargingTableHeader } from "../components/chargingHeader";
import { useAppStore } from "../state/state";

export function HomeScreen() {
	const {
		operatorId,
		setOperatorId,
		chargingConditions,
		setTariffConditions,
		banner,
	} = useAppStore((state) => ({
		operatorId: state.operatorId,
		setOperatorId: state.setOperatorId,
		chargingConditions: state.chargingConditions,
		setTariffConditions: state.setTariffConditions,
		banner: state.banner,
	}));

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
					flex: 75, // Höhe des verfügbaren Platzes
					backgroundColor: colors.ladefuchsLightBackground,
				}}
			>
				<ChargeConditionTable />
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
				<OperatorPicker />
			</View>
			{banner && (
				<Banner
					imageUrl={banner.imageUrl}
					link={banner.affiliateLinkUrl}
				/>
			)}
		</View>
	);
}
