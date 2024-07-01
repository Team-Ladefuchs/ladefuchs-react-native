import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { colors } from "../theme";
import OperatorPicker from "../components/home/operatorPicker";
import { ChargeConditionTable } from "../components/home/chargeConditionTable";
import { AppBanner } from "../components/home/appBanner";
import { ChargingTableHeader } from "../components/chargingHeader";
import { useAppStore } from "../state/state";
import { OfflineView } from "../components/home/offline";
import { ScaledSheet } from "react-native-size-matters";

export function HomeScreen(): JSX.Element {
	const { operatorId, chargingConditions, setTariffConditions, appError } =
		useAppStore(
			useShallow((state) => ({
				operatorId: state.operatorId,
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
	}, [operatorId, setTariffConditions, chargingConditions]);

	if (appError) {
		return <OfflineView />;
	}

	return (
		<View style={{ flex: 1 }}>
			<ChargingTableHeader />
			<View style={styles.chargingTableContainer}>
				<ChargeConditionTable />
			</View>
			<View style={styles.pickerBanner}>
				<Text style={styles.pickerBannerText}>
					AN WELCHER SÄULE STEHST DU?
				</Text>
			</View>
			<View style={styles.pickerContainer}>
				<OperatorPicker />
			</View>
			<AppBanner />
		</View>
	);
}

const styles = ScaledSheet.create({
	chargingTableContainer: {
		flex: 89,
		backgroundColor: colors.ladefuchsLightBackground,
	},
	pickerContainer: {
		flex: 46,
		justifyContent: "center",
		alignContent: "center",
		backgroundColor: colors.ladefuchsLightBackground,
	},
	pickerBanner: {
		paddingTop: "10@s",
		paddingBottom: "10@s",
		backgroundColor: colors.ladefuchsDarkBackground,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 5,
		zIndex: 1,
	},
	pickerBannerText: {
		fontSize: "16@s",
		color: "black",
		fontFamily: "Roboto",
	},
});
