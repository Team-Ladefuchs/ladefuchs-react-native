import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Tariff } from "../../../types/tariff";
import { TariffCondition } from "../../../types/conditions";
import { useNavigation } from "@react-navigation/native";
import { CardImage } from "../../shared/cardImage";
import { useFormatNumber } from "../../../hooks/useNumberFormat";
import { scale } from "react-native-size-matters";
import {
	TariffDetailScreenNavigationProp,
	appRoutes,
} from "../../../appRoutes";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../../../state/appState";

interface ChargeCardModel {
	tariff: Tariff | null | undefined;
	tariffCondition: TariffCondition | null;
}

export function ChargeConditionRow({
	tariff,
	tariffCondition,
}: ChargeCardModel): JSX.Element {
	const navigator = useNavigation<TariffDetailScreenNavigationProp>();
	const { formatNumber } = useFormatNumber();

	const { favoriteTariffIds } = useAppStore(
		useShallow((state) => ({
			favoriteTariffIds: state.favoriteTariffIds,
		})),
	);

	if (!tariffCondition || !tariff) {
		return <View style={styles.cardAndPriceContainer}></View>;
	}
	const noteLength = tariff?.note?.length ?? 0;
	const showHighlightCorner =
		tariffCondition?.blockingFee > 0 ||
		tariff?.monthlyFee > 0 ||
		noteLength > 0;

	const onPress = () => {
		navigator.navigate(appRoutes.detailScreen.key, {
			tariff,
			tariffCondition,
		});
	};
	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.8}
			style={styles.cardAndPriceContainer}
		>
			<CardImage
				name={tariff.name}
				imageUrl={tariff.imageUrl}
				width={72}
				isFavorite={favoriteTariffIds.has(tariff.identifier)}
				showHighlightCorner={showHighlightCorner}
			/>

			<Text style={styles.priceText}>
				{formatNumber(tariffCondition.pricePerKwh)}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	cardAndPriceContainer: {
		flex: 1,
		display: "flex",
		columnGap: scale(16),
		paddingVertical: scale(8),
		alignContent: "center",
		position: "relative",
		justifyContent: "center",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: scale(24),
	},
	priceText: {
		fontSize: scale(24),
		fontWeight: "400",
	},
});
