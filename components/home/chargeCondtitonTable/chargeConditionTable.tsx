import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View, FlatList } from "react-native";
import { TariffCondition } from "../../../types/conditions";
import { fill, zip } from "../../../functions/util";
import { colors } from "../../../theme";
import { useAppStore } from "../../../state/appState";
import { useShallow } from "zustand/react/shallow";
import { ChargeConditionRow } from "./chargeConditionRow";
import { useQueryAppData } from "../../../hooks/useQueryAppData";
import { LoadingSpinner } from "../../shared/loadingSpinner";
import { EmptyListText } from "../../shared/emptyListText";
import { ScaledSheet } from "react-native-size-matters";
import i18n from "@translations/translations";

export function ChargeConditionTable(): JSX.Element {
	const [allChargeConditionsQuery] = useQueryAppData();

	const {
		tariffs,
		tariffConditions,
		setTariffConditions,
		operatorId,
		chargingConditionsMap,
		isFavoriteTariffOnly,
		favoriteTariffIds,
	} = useAppStore(
		useShallow((state) => ({
			tariffs: state.tariffs,
			tariffConditions: state.tariffConditions,
			setTariffConditions: state.setTariffConditions,
			operatorId: state.operatorId,
			chargingConditionsMap: state.chargingConditions,
			isFavoriteTariffOnly: state.isFavoriteTariffOnly,
			favoriteTariffIds: state.favoriteTariffIds,
		})),
	);

	useEffect(() => {
		// Early return if operatorId is not defined
		if (!operatorId) return;

		const tariffConditions = chargingConditionsMap.get(operatorId);

		// Early return if no tariff conditions are found
		if (!tariffConditions) return;

		// Set filtered or all tariff conditions based on the isFavoriteTariffOnly flag
		const updatedTariffConditions = isFavoriteTariffOnly
			? tariffConditions.filter((item) =>
					favoriteTariffIds.has(item.tariffId),
				)
			: tariffConditions;

		setTariffConditions(updatedTariffConditions);
	}, [
		operatorId,
		setTariffConditions,
		chargingConditionsMap,
		isFavoriteTariffOnly,
		favoriteTariffIds, // added missing dependency for consistency
	]);

	const currentTariffConditions = useMemo(() => {
		const [acTariffCondition, dcTariffCondition] = fill(
			tariffConditions.filter((item) => item.chargingMode === "ac"),
			tariffConditions.filter((item) => item.chargingMode === "dc"),
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
		[tariffs],
	);

	return (
		<View style={styles.chargingTableContainer}>
			{allChargeConditionsQuery.isLoading ? (
				<LoadingSpinner />
			) : (
				<FlatList
					ref={flatListRef as any}
					data={currentTariffConditions}
					renderItem={renderItem}
					ListEmptyComponent={() => {
						if (
							!allChargeConditionsQuery.data?.chargingConditions
						) {
							return <View></View>;
						}
						return (
							<View style={styles.emptyContainer}>
								<EmptyListText
									text={i18n.t(
										isFavoriteTariffOnly
											? "chargeTableFavoritePlaceholder"
											: "chargeTableFavoritePlaceholder",
									)}
								/>
							</View>
						);
					}}
					scrollsToTop={true}
					keyExtractor={([left, right], _index) =>
						conditionKey(left) + conditionKey(right)
					}
				/>
			)}
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

const styles = ScaledSheet.create({
	chargingTableContainer: {
		flex: 92,
		backgroundColor: colors.ladefuchsLightBackground,
	},
	scrollContainer: {
		flex: 1,
		flexDirection: "row",
	},
	priceLineContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 0,
	},
	space: {
		width: 1,
		backgroundColor: "white",
	},
	emptyContainer: {
		height: "100%",
		marginTop: "130@s",
	},
});
