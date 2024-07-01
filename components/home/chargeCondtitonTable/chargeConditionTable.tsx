import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { TariffCondition } from "../../../types/conditions";
import { fill, zip } from "../../../functions/util";
import { colors } from "../../../theme";
import { useAppStore } from "../../../state/state";
import { useShallow } from "zustand/react/shallow";
import { ChargeConditionRow } from "./chargeConditionRow";

export function ChargeConditionTable() {
	const {
		tariffs,
		tariffConditions,
		setTariffConditions,
		operatorId,
		chargingConditionsMap,
	} = useAppStore(
		useShallow((state) => ({
			tariffs: state.tariffs,
			tariffConditions: state.tariffConditions,
			setTariffConditions: state.setTariffConditions,
			operatorId: state.operatorId,
			chargingConditionsMap: state.chargingConditions,
		}))
	);

	useEffect(() => {
		if (!operatorId) {
			return;
		}
		const tariffConditions = chargingConditionsMap.get(operatorId);
		if (tariffConditions) {
			setTariffConditions(tariffConditions);
		}
	}, [operatorId, setTariffConditions, chargingConditionsMap]);

	const currentTariffConditions = useMemo(() => {
		const [acTariffCondition, dcTariffCondition] = fill(
			tariffConditions.filter((item) => item.chargingMode === "ac"),
			tariffConditions.filter((item) => item.chargingMode === "dc")
		);
		return zip(acTariffCondition, dcTariffCondition);
	}, [tariffConditions]);

	const flatListRef = useRef<FlatList>();

	useEffect(() => {
		if (currentTariffConditions.length) {
			flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
		}
	}, [operatorId]);

	const renderItem = useCallback(
		({
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
							backgroundColor: backgroundColor,
						},
					]}
				>
					<ChargeConditionRow
						tariffCondition={left}
						tariff={tariffs.get(left?.tariffId)}
					/>
					<View style={styles.space} />
					<ChargeConditionRow
						tariffCondition={right}
						tariff={tariffs.get(right?.tariffId)}
					/>
				</View>
			);
		},
		[tariffs]
	);

	return (
		<View style={styles.chargingTableContainer}>
			<FlatList
				ref={flatListRef as any}
				data={currentTariffConditions}
				renderItem={renderItem}
				scrollsToTop={true}
				keyExtractor={([left, right], _index) =>
					conditionKey(left) + conditionKey(right)
				}
			/>
		</View>
	);
}

function conditionKey(condition: TariffCondition | null): string {
	if (!condition) {
		return "";
	}

	return (
		condition.tariffId +
		condition.blockingFee +
		condition.pricePerKwh +
		condition.blockingFeeStart
	);
}

const styles = StyleSheet.create({
	chargingTableContainer: {
		flex: 89,
		backgroundColor: colors.ladefuchsLightBackground,
	},
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
