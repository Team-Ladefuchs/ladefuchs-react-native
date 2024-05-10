import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { Tariff } from "../types/tariff";
import { TariffCondition } from "../types/conditions";
import { useQuery } from "@tanstack/react-query";
import { fetchImage } from "../functions/api";

interface ChargeCardModel {
	tariff: Tariff;
	tariffCondition: TariffCondition;
}

const ChargeCard = ({ tariff, tariffCondition }: ChargeCardModel) => {
	// const cardImage = require("../assets/maingau.png");

	const imageQuery = useQuery({
		queryKey: [tariff.imageUrl],
		queryFn: async () => {
			return await fetchImage(tariff.imageUrl);
		},
	});
	const a = imageQuery.data;
	return (
		<View style={styles.cardAndPriceContainer}>
			<Image source={{ uri: imageQuery.data }} style={styles.cardImage} />
			<Text style={styles.priceText}>
				{tariffCondition.pricePerKwh.toFixed(2)}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	cardAndPriceContainer: {
		height: 75,
		flexDirection: "row", // Horizontal layout
		alignItems: "center", // Align items vertically
		paddingHorizontal: 20, // Adjust as needed
	},
	cardImage: {
		width: 80, // Adjust as needed
		height: 48, // Adjust as needed
		marginRight: 20, // Adjust as needed
	},
	priceText: {
		fontSize: 22, // Adjust font size as needed
		fontWeight: "600",
	},
});

export default ChargeCard;
