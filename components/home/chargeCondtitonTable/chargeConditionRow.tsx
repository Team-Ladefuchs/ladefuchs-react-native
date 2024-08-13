import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Tariff } from "../../../types/tariff";
import { TariffCondition } from "../../../types/conditions";
import { useNavigation } from "@react-navigation/native";
import { CardImage } from "../../shared/cardImage";
import { useFormatNumber } from "../../../hooks/useNumberFormat";
import { scale } from "react-native-size-matters";
import { appRoutes } from "../../../appRoutes";

interface ChargeCardModel {
	tariff: Tariff | null | undefined;
	tariffCondition: TariffCondition | null;
}

export function ChargeConditionRow({
	tariff,
	tariffCondition,
}: ChargeCardModel): JSX.Element {
	const navigator = useNavigation();
	const { formatNumber } = useFormatNumber();

	if (!tariffCondition || !tariff) {
		return <View style={styles.cardAndPriceContainer}></View>;
	}
	const noteLength = tariff?.note?.length ?? 0;
	const showHighlightCorner =
		tariffCondition?.blockingFee > 0 ||
		tariff?.monthlyFee > 0 ||
		noteLength > 0;

	const onPress = () => {
		//@ts-ignore
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
				tariff={tariff}
				width={72}
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
