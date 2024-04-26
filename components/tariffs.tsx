// Tariffs.tsx

import React from "react";
import { View } from "react-native";
import PriceLineView from "./PriceLineView";

const Tariffs = () => {
	// Define your view models
	const left = {
		cardImage: require("../assets/bonnet.png"),
		priceString: "0,48" /* Add other properties */,
	};
	const right = {
		cardImage: require("../assets/maingau.png"),
		priceString: "0,66" /* Add other properties */,
	};
	const viewModel = { left, right /* Add other properties */ };

	return (
		<View>
			{/* cardimage und price aus der API holen */}
			<PriceLineView viewModel={viewModel} index={0} />
			<PriceLineView viewModel={viewModel} index={1} />
			<PriceLineView viewModel={viewModel} index={0} />
			<PriceLineView viewModel={viewModel} index={1} />
			<PriceLineView viewModel={viewModel} index={0} />
			<PriceLineView viewModel={viewModel} index={1} />
			<PriceLineView viewModel={viewModel} index={0} />
			<PriceLineView viewModel={viewModel} index={1} />
		</View>
	);
};

export default Tariffs;
