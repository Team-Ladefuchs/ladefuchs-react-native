import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Tariff } from "../types/tariff";
import { TariffCondition } from "../types/conditions";
import { authHeader } from "../functions/api";
import { Svg, G, Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

interface ChargeCardModel {
	tariff: Tariff | null;
	tariffCondition: TariffCondition | null;
}

const ChargeCard = ({ tariff, tariffCondition }: ChargeCardModel) => {
	const navigator = useNavigation();

	if (!tariffCondition || !tariff) {
		return <View style={styles.cardAndPriceContainer}></View>;
	}
	const showHighlightCorner =
		tariffCondition?.blockingFee > 0 ||
		tariff?.monthlyFee > 0 ||
		tariff?.note?.length > 0;

	const onPress = () => {
		navigator.navigate("detailScreen", { tariff, tariffCondition });
	};
	return (
		<View style={styles.cardAndPriceContainer}>
			<View style={styles.cardImageContainer}>
				{showHighlightCorner && <HighlightCorner />}
				<TouchableOpacity onPress={onPress}>
					<Image
						source={{
							uri: tariff.imageUrl,
							...authHeader,
						}}
						style={styles.cardImage}
					/>
				</TouchableOpacity>
			</View>

			<Text style={styles.priceText}>
				{tariffCondition.pricePerKwh.toFixed(2)}
			</Text>
		</View>
	);
};

function HighlightCorner() {
	return (
		<Svg
			style={styles.highlightCorner}
			width="20"
			height="20"
			viewBox="0 0 78 79"
			fillRule="evenodd"
			clipRule="evenodd"
			strokeLinejoin="round"
			strokeMiterlimit={2}
		>
			<G transform="matrix(1,0,0,1,-477,-756)">
				<G transform="matrix(0.878467,0,0,0.878467,63.1579,98.0008)">
					<Path
						d="M547.547,836.094L473.494,762.04C471.455,760.002 470.845,756.936 471.948,754.272C473.052,751.609 475.651,749.872 478.534,749.872L540.241,749.872C550.99,749.872 559.716,758.598 559.716,769.346L559.716,831.054C559.716,833.937 557.979,836.536 555.315,837.639C552.652,838.743 549.586,838.133 547.547,836.094Z"
						fill="rgb(228,40,16)"
					/>
				</G>
			</G>
		</Svg>
	);
}

const dropShadow = {
	shadowOffset: {
		width: 0,
		height: 1,
	},
	shadowOpacity: 0.5,
	shadowRadius: 4,
	elevation: 4,
};

const styles = StyleSheet.create({
	cardAndPriceContainer: {
		height: 64,
		display: "flex",
		flex: 1,
		alignContent: "center",
		position: "relative",
		flexDirection: "row", // Horizontal layout
		alignItems: "center", // Align items vertically
		paddingHorizontal: 24, // Adjust as needed
	},
	highlightCorner: {
		...dropShadow,
		shadowOpacity: 0.1,
		position: "absolute",
		height: 16,
		width: 16,
		zIndex: 2,
		top: -3,
		right: 17,
	},
	cardImageContainer: {
		...dropShadow,
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
