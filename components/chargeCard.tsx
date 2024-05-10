import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { Tariff } from "../types/tariff";
import { TariffCondition } from "../types/conditions";
import { useQuery } from "@tanstack/react-query";
import { fetchImage } from "../functions/api";

interface ChargeCardModel {
	tariff: Tariff | null;
	tariffCondition: TariffCondition | null;
}

const ChargeCard = ({ tariff, tariffCondition }: ChargeCardModel) => {
	if (!tariffCondition || !tariff) {
		return <View style={styles.cardAndPriceContainer}></View>;
	}

	const imageQuery = useQuery({
		queryKey: [tariff.imageUrl],
		queryFn: async () => {
			return await fetchImage(tariff.imageUrl);
		},
	});

	return (
		<View style={styles.cardAndPriceContainer}>
			<View style={styles.cardImageContainer}>
				<Image
					source={{ uri: imageQuery.data }}
					style={styles.cardImage}
				/>
			</View>

			<Text style={styles.priceText}>
				{tariffCondition.pricePerKwh.toFixed(2)}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	cardAndPriceContainer: {
		height: 64,
		display: "flex",
		alignContent: "center",
		// paddingVertical: 8,
		flexDirection: "row", // Horizontal layout
		alignItems: "center", // Align items vertically
		paddingHorizontal: 12, // Adjust as needed
	},
	cardImageContainer: {
		shadowColor: "#212121",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.3,
		shadowRadius: 0.5,
		elevation: 4,
	},
	cardImage: {
		borderRadius: 4,
		aspectRatio: 1.6,
		width: 78, // Adjust as needed
		marginRight: 20, // Adjust as needed
	},
	priceText: {
		// fontFamily: "Roboto",
		fontSize: 25, // Adjust font size as needed
		fontWeight: "400",
	},
});

export default ChargeCard;
