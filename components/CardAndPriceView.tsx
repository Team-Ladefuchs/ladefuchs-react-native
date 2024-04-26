import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const CardAndPriceView = ({ viewModel }) => {
	return (
		<View style={styles.cardAndPriceContainer}>
			<Image source={viewModel.cardImage} style={styles.cardImage} />
			<Text style={styles.priceText}>{viewModel.priceString}</Text>
			{/* Add other content as needed */}
		</View>
	);
};

const styles = StyleSheet.create({
	cardAndPriceContainer: {
		height: 99,
		flexDirection: "row", // Horizontal layout
		alignItems: "center", // Align items vertically
		paddingHorizontal: 10, // Adjust as needed
	},
	cardImage: {
		width: 100, // Adjust as needed
		height: 60, // Adjust as needed
		marginRight: 25, // Adjust as needed
	},
	priceText: {
		fontSize: 20, // Adjust font size as needed
		fontFamily: "Bitter",
	},
});

export default CardAndPriceView;
