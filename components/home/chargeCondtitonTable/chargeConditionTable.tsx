import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View, LayoutRectangle } from "react-native";
import { ListRenderItem } from "@shopify/flash-list";
import { TariffCondition } from "../../../types/conditions";
import { fill, zip } from "../../../functions/util";
import { colors } from "../../../theme";
import { useAppStore } from "../../../state/appState";
import { useShallow } from "zustand/react/shallow";
import { ChargeConditionRow } from "./chargeConditionRow";
import { useQueryAppData } from "../../../hooks/useQueryAppData";
import { LoadingSpinner } from "../../shared/loadingSpinner";
import { EmptyListText } from "../../shared/emptyListText";
import { ScaledSheet, scale } from "react-native-size-matters";
import i18n from "@translations/translations";
import { FlashList } from "@shopify/flash-list";

// Types
type TariffPair = [TariffCondition | null, TariffCondition | null];

// Constants
const INITIAL_SCROLL_OFFSET = 0;
const EMPTY_ARRAY: TariffCondition[] = [];
const ROW_HEIGHT = scale(70);
const ESTIMATED_ITEM_SIZE = 78;

// Memoized style objects
const evenRowStyle = { backgroundColor: colors.ladefuchsLightBackground };
const oddRowStyle = { backgroundColor: colors.ladefuchsLightGrayBackground };

// Pure Components for better performance
const Divider = React.memo(() => <View style={styles.space} />);
Divider.displayName = "Divider";

const LoadingView = React.memo(() => (
	<View style={styles.chargingTableContainer}>
		<LoadingSpinner />
	</View>
));
LoadingView.displayName = "LoadingView";

export function ChargeConditionTable(): JSX.Element {
	const [allChargeConditionsQuery] = useQueryAppData();
	const flatListRef = useRef<FlashList<TariffPair>>(null);
	const [dimensions, setDimensions] = React.useState<LayoutRectangle | null>(
		null,
	);
	const isMounted = useRef(true);

	// Cleanup bei Unmount
	useEffect(() => {
		return () => {
			if (flatListRef.current) {
				flatListRef.current.recordInteraction();
			}
		};
	}, []);

	// Component Lifecycle optimieren
	useEffect(() => {
		return () => {
			// FlashList handles its own cleanup
		};
	}, []);
	// Save State-Update
	const safeSetDimensions = useCallback(
		(newDimensions: LayoutRectangle | null) => {
			if (isMounted.current) {
				setDimensions(newDimensions);
			}
		},
		[],
	);

	// Optimized State-Selector
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

	// Memoized Tariff-Conditions with early Return
	const filteredTariffConditions = useMemo(() => {
		if (!operatorId || !chargingConditionsMap.has(operatorId))
			return EMPTY_ARRAY;

		const conditions = chargingConditionsMap.get(operatorId)!;
		return isFavoriteTariffOnly
			? conditions.filter((item) => favoriteTariffIds.has(item.tariffId))
			: conditions;
	}, [
		operatorId,
		chargingConditionsMap,
		isFavoriteTariffOnly,
		favoriteTariffIds,
	]);

	// Optimized grouping with cache
	const currentTariffConditions = useMemo(() => {
		const acConditions = new Set<TariffCondition>();
		const dcConditions = new Set<TariffCondition>();

		tariffConditions.forEach((item) => {
			(item.chargingMode === "ac" ? acConditions : dcConditions).add(
				item,
			);
		});

		const [filledAc, filledDc] = fill(
			Array.from(acConditions),
			Array.from(dcConditions),
		);
		return zip(filledAc, filledDc);
	}, [tariffConditions]);

	// Optimized scroll reset with abort controller
	const resetScroll = useCallback(() => {
		if (!isMounted.current) return;

		if (currentTariffConditions.length && flatListRef.current) {
			const animationFrame = requestAnimationFrame(() => {
				if (isMounted.current && flatListRef.current) {
					flatListRef.current.scrollToOffset({
						animated: true,
						offset: INITIAL_SCROLL_OFFSET,
					});
				}
			});

			return () => cancelAnimationFrame(animationFrame);
		}
	}, [currentTariffConditions.length]);

	// Reset scroll when changing operator
	useEffect(() => {
		resetScroll();
	}, [operatorId, resetScroll]);

	useEffect(() => {
		if (isMounted.current) {
			setTariffConditions(filteredTariffConditions);
		}
	}, [filteredTariffConditions, setTariffConditions]);

	const onLayout = useCallback(
		(event: { nativeEvent: { layout: LayoutRectangle } }) => {
			safeSetDimensions(event.nativeEvent.layout);
		},
		[safeSetDimensions],
	);

	// Memoized Render-Function
	const renderItem: ListRenderItem<TariffPair> = useCallback(
		({ item: [left, right], index }) => {
			// Sichere Tarif-Zugriffe
			const leftTariff = left?.tariffId
				? tariffs.get(left.tariffId)
				: undefined;
			const rightTariff = right?.tariffId
				? tariffs.get(right.tariffId)
				: undefined;

			return (
				<View
					style={[
						styles.priceLineContainer,
						index % 2 === 0 ? evenRowStyle : oddRowStyle,
					]}
				>
					<ChargeConditionRow
						tariffCondition={left}
						tariff={leftTariff}
					/>
					<Divider />
					<ChargeConditionRow
						tariffCondition={right}
						tariff={rightTariff}
					/>
				</View>
			);
		},
		[tariffs],
	);

	const EmptyComponent = useCallback(() => {
		if (!allChargeConditionsQuery.data?.chargingConditions) return null;

		const textKey = isFavoriteTariffOnly
			? "chargeTableFavoritePlaceholder"
			: "chargeTablePlaceholder";

		return (
			<View style={styles.emptyContainer}>
				<EmptyListText text={i18n.t(textKey)} />
			</View>
		);
	}, [
		allChargeConditionsQuery.data?.chargingConditions,
		isFavoriteTariffOnly,
	]);

	const keyExtractor = useCallback((item: TariffPair): string => {
		const [left, right] = item;
		return conditionKey(left) + "-" + conditionKey(right);
	}, []);

	if (allChargeConditionsQuery.isLoading) {
		return <LoadingView />;
	}

	return (
		<View style={styles.chargingTableContainer} onLayout={onLayout}>
			<FlashList
				ref={flatListRef}
				data={currentTariffConditions}
				renderItem={renderItem}
				ListEmptyComponent={EmptyComponent}
				scrollsToTop={true}
				keyExtractor={keyExtractor}
				removeClippedSubviews={true}
				maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
				style={dimensions ? { height: dimensions.height } : undefined}
				estimatedItemSize={ESTIMATED_ITEM_SIZE}
				estimatedListSize={dimensions || undefined}
			/>
		</View>
	);
}

const getItemLayout = (data: any, index: number) => ({
	length: ROW_HEIGHT,
	offset: ROW_HEIGHT * index,
	index,
});

function conditionKey(condition: TariffCondition | null): string {
	if (!condition) return "";
	const { tariffId, blockingFee, pricePerKwh, blockingFeeStart } = condition;
	return `${tariffId}-${blockingFee}-${pricePerKwh}-${blockingFeeStart}`;
}

const styles = ScaledSheet.create({
	chargingTableContainer: {
		flex: 92,
		backgroundColor: colors.ladefuchsLightBackground,
	},
	priceLineContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 0,
		height: ROW_HEIGHT,
	},
	space: { width: 1, backgroundColor: "white" },
	emptyContainer: { height: "100%", marginTop: "130@s" },
});
