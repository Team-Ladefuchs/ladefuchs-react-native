// Tariffs.tsx

import React, { useContext } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { TariffCondition } from "../types/conditions";
import { AppStateContext } from "../contexts/appStateContext";
import ChargeCard from "./chargeCard";
import { fill, zip } from "../functions/util";
export interface Props {
	tariffConditions: TariffCondition[];
}

export function ChargeConditionTable({ tariffConditions }: Props) {
	// hier nutzen wir unseren globalen state

	const [acTariffCondition, dcTariffCondition] = fill(
		tariffConditions.filter((item) => item.chargingMode === "ac"),
		tariffConditions.filter((item) => item.chargingMode === "dc")
	);
	const zipTariffConditions = zip(acTariffCondition, dcTariffCondition);
	const { tariffs } = useContext(AppStateContext);
	const renderItem = ({
		item,
		index,
	}: {
		item: TariffCondition[];
		index: number;
	}): JSX.Element => {
		const [left, right] = item;

		return (
			<View
				key={index}
				style={[
					styles.priceLineContainer,
					{
						flex: 1,
						backgroundColor:
							index % 2 !== 0 ? "#f3eee2" : "#E0D7C8",
					},
				]}
			>
				<ChargeCard
					tariffCondition={left}
					tariff={tariffs.get(left?.tariffId)}
				/>
				<View style={styles.space} />
				<ChargeCard
					tariffCondition={right}
					tariff={tariffs.get(right?.tariffId)}
				/>
			</View>
		);
	};

	return (
		<FlatList
			data={zipTariffConditions}
			renderItem={renderItem}
			// ItemSeparatorComponent={() => <Text>1</Text>}
			keyExtractor={([left, right], _index) =>
				conditionKey(left) + conditionKey(right)
			}
		/>
	);
}

function conditionKey(condition: TariffCondition | null): string {
	if (!condition) {
		return null;
	}

	return (
		condition.tariffId +
		condition.blockingFee +
		condition.pricePerKwh +
		condition.blockingFeeStart
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
		flexDirection: "row",
	},
	priceLineContainer: {
		flexDirection: "row", // Horizontal layout
		justifyContent: "space-between", // Distribute space between items
		paddingVertical: 0, // Adjust as needed
	},
	space: {
		width: 1, // Adjust space width as needed
		backgroundColor: "white", // Set space background color
	},
});
