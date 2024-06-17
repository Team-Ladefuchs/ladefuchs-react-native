import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Platform,
} from "react-native";
import { Tariff } from "../../types/tariff";
import { TariffCondition } from "../../types/conditions";
import { useNavigation } from "@react-navigation/native";
import { CardImage } from "../cardImage";
import { useFormatNumber } from "../../hooks/numberFormat";

interface ChargeCardModel {
	tariff: Tariff | null | undefined;
	tariffCondition: TariffCondition | null;
}

export function ChargeCondition({
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
		navigator.navigate("detailScreen", { tariff, tariffCondition });
	};
	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.8}
			style={styles.cardAndPriceContainer}
		>
			<CardImage
				tariff={tariff}
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
		height: 69,
		flex: 1,
		display: "flex",
		columnGap: 16,
		alignContent: "center",
		position: "relative",
		justifyContent: "center",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	priceText: {
		...Platform.select({
			android: {
				fontSize: 23,
			},
			default: {
				fontSize: 25,
				fontWeight: "400",
			},
		}),
	},
});

export default ChargeCondition;
