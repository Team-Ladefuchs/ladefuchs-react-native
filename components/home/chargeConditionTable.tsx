// Tariffs.tsx

import React, { useRef } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { TariffCondition } from "../../types/conditions";
import ChargeCard from "./chargeCard";
import { fill, zip } from "../../functions/util";
import { colors } from "../../theme";
import { useAppStore } from "../../state/state";
import { useShallow } from "zustand/react/shallow";

export function ChargeConditionTable() {
	// hier nutzen wir unseren globalen state
	const { tariffs, tariffConditions } = useAppStore(
		useShallow((state) => ({
			tariffs: state.tariffs,
			tariffConditions: state.tariffConditions,
		}))
	);

	const [acTariffCondition, dcTariffCondition] = fill(
		tariffConditions.filter((item) => item.chargingMode === "ac"),
		tariffConditions.filter((item) => item.chargingMode === "dc")
	);
	const zipTariffConditions = zip(acTariffCondition, dcTariffCondition);
	const flatListRef = useRef<FlatList>();

	if (zipTariffConditions.length) {
		flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
	}

	const renderItem = ({
		item,
		index,
	}: {
		item: TariffCondition[];
		index: number;
	}): JSX.Element => {
		const [left, right] = item;
		const backgroundColor =
			index % 2 !== 0
				? colors.ladefuchsLightGrayBackground
				: colors.ladefuchsLightBackground;
		return (
			<View
				style={[
					styles.priceLineContainer,
					{
						flex: 1,
						backgroundColor: backgroundColor,
					},
				]}
			>
				<ChargeCard
					backgroundColor={backgroundColor}
					tariffCondition={left}
					tariff={tariffs.get(left?.tariffId)}
				/>
				<View style={styles.space} />
				<ChargeCard
					backgroundColor={backgroundColor}
					tariffCondition={right}
					tariff={tariffs.get(right?.tariffId)}
				/>
			</View>
		);
	};

	return (
		<FlatList
			ref={flatListRef}
			data={zipTariffConditions}
			renderItem={renderItem}
			scrollsToTop={true}
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
