import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
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
		appError,
	} = useAppStore(
		useShallow((state) => ({
			operatorId: state.operatorId,
			setOperatorId: state.setOperatorId,
			chargingConditions: state.chargingConditions,
			setTariffConditions: state.setTariffConditions,
			appError: state.appError,
		}))
	);

	// Lade die Conditions aus dem Cache, wenn sich der Operator geändert hat
	useEffect(() => {
		if (!operatorId) {
			return;
		}
		const tariffConditions = chargingConditions.get(operatorId);
		if (tariffConditions) {
			setTariffConditions(tariffConditions);
		}
	}, [operatorId, setOperatorId, setTariffConditions, chargingConditions]);

	if (appError) {
		return (
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					alignContent: "center",
					marginTop: 50,
				}}
			>
				<Image
					source={require("../assets/ladefuchs.png")}
					style={{ width: 200, height: 200 }}
				/>
				<Text
					style={{
						color: "red",
						textAlign: "center",
						fontSize: 20,
						marginTop: 20,
					}}
				>
					Sorry, du bist offline.
				</Text>
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<ChargingTableHeader />
			<View
				style={{
					flex: 92,
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
					zIndex: 1,
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
					flex: 45,
					justifyContent: "center",
					alignContent: "center",
					backgroundColor: colors.ladefuchsLightBackground,
				}}
			>
				<OperatorPicker />
			</View>
			<AppBanner />
		</View>
	);
}
