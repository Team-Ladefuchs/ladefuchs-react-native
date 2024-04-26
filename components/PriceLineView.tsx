import React from "react";
import { View, StyleSheet } from "react-native";
import CardAndPriceView from "./CardAndPriceView";

const PriceLineView = ({ viewModel, index }) => {
	const backgroundColor = index % 2 === 0 ? "#f3eee2" : "#E0D7C8"; // Alternating background colors
	return (
		<View style={[styles.priceLineContainer, { backgroundColor }]}>
			<CardAndPriceView viewModel={viewModel.left} />
			<View style={styles.space} />
			<CardAndPriceView viewModel={viewModel.right} />
		</View>
	);
};

const styles = StyleSheet.create({
	priceLineContainer: {
		flexDirection: "row", // Horizontal layout
		justifyContent: "space-between", // Distribute space between items
		paddingHorizontal: 10, // Adjust as needed
		paddingVertical: 0, // Adjust as needed
	},
	space: {
		width: 2, // Adjust space width as needed
		backgroundColor: "white", // Set space background color
	},
});

export default PriceLineView;
