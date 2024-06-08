import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Tariff } from "../../types/tariff";
import { TariffCondition } from "../../types/conditions";
import { useNavigation } from "@react-navigation/native";
import { CardImage } from "../cardImage";

interface ChargeCardModel {
	tariff: Tariff | null;
	tariffCondition: TariffCondition | null;
}

export function ChargeCondition({
	tariff,
	tariffCondition,
}: ChargeCardModel): JSX.Element {
	const navigator = useNavigation();

	if (!tariffCondition || !tariff) {
		return <View style={styles.cardAndPriceContainer}></View>;
	}
	const showHighlightCorner =
		tariffCondition?.blockingFee > 0 ||
		tariff?.monthlyFee > 0 ||
		tariff?.note?.length > 0;

	const onPress = () => {
		//@ts-ignore
		navigator.navigate("detailScreen", { tariff, tariffCondition });
	};
	return (
		<View style={styles.cardAndPriceContainer}>
			<TouchableOpacity onPress={onPress} activeOpacity={0.8}>
				<CardImage
					tariff={tariff}
					showHighlightCorner={showHighlightCorner}
				/>
			</TouchableOpacity>

			<Text style={styles.priceText}>
				{tariffCondition.pricePerKwh.toFixed(2)}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	cardAndPriceContainer: {
		height: 69,
		display: "flex",
		flex: 1,
		columnGap: 20,
		alignContent: "center",
		position: "relative",
		flexDirection: "row", // Horizontal layout
		alignItems: "center", // Align items vertically
		paddingHorizontal: 24, // Adjust as needed
	},
	priceText: {
		fontSize: 25,
		fontWeight: "400",
	},
});

export default ChargeCondition;
