// Tariffs.tsx

import React, { useContext } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { TariffCondition } from "../types/conditions";
import { AppStateContext } from "../contexts/appStateContext";
import ChargeCard from "./chargeCard";
export interface Props {
	tariffConditions: TariffCondition[];
}

export function TariffsTable({ tariffConditions }: Props) {
	// hier nutzen wir unseren globalen state
	const type2TariffCondition = tariffConditions.filter(
		(item) => item.chargingMode === "ac"
	);
	const ccsTariffCondition = tariffConditions.filter(
		(item) => item.chargingMode === "dc"
	);
	console.log("ccsTariffCondition", ccsTariffCondition);

	return (
		<ScrollView>
			<View style={styles.scrollContainer}>
				<TariffColumn tariffConditions={type2TariffCondition} />
				<View style={styles.space} />
				<TariffColumn tariffConditions={ccsTariffCondition} />
			</View>
		</ScrollView>
	);
}

function TariffColumn({ tariffConditions }: Props) {
	const { tariffs } = useContext(AppStateContext);

	const cardsList = tariffConditions.map((tariffCondition, index) => {
		const tariff = tariffs.get(tariffCondition.tariffId);
		return (
			<View
				key={tariffCondition.tariffId + index}
				style={[
					styles.priceLineContainer,
					{
						backgroundColor:
							index % 2 === 0 ? "#f3eee2" : "#E0D7C8",
					},
				]}
			>
				<ChargeCard tariffCondition={tariffCondition} tariff={tariff} />
			</View>
		);
	});
	return <View style={{ flex: 1 }}>{cardsList}</View>;
}

const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
		flexDirection: "row",
	},
	priceLineContainer: {
		flexDirection: "row", // Horizontal layout
		justifyContent: "space-between", // Distribute space between items
		paddingHorizontal: 10, // Adjust as needed
		paddingVertical: 0, // Adjust as needed
	},
	space: {
		width: 1, // Adjust space width as needed
		backgroundColor: "white", // Set space background color
	},
});
