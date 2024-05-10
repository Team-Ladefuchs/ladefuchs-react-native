// Tariffs.tsx

import React, { useContext } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { TariffCondition } from "../types/conditions";
import { AppStateContext } from "../contexts/appStateContext";
import ChargeCard from "./chargeCard";
export interface Props {
	tariffConditions: TariffCondition[];
}

export function TariffsTable({ tariffConditions }: Props) {
	// hier nutzen wir unseren globalen state

	const [type2TariffCondition, ccsTariffCondition] = fillLists(
		tariffConditions.filter((item) => item.chargingMode === "ac"),
		tariffConditions.filter((item) => item.chargingMode === "dc")
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
		const tariff = tariffs.get(tariffCondition?.tariffId);
		return (
			<View
				key={index}
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

function fillLists<T>(list1: T[], list2: T[]): [T[], T[]] {
	const len1 = list1.length;
	const len2 = list2.length;

	if (len1 < len2) {
		list1.push(...Array(len2 - len1).fill(null));
	} else if (len2 < len1) {
		list2.push(...Array(len1 - len2).fill(null));
	}

	return [list1, list2];
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
