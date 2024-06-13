import { View, Image } from "react-native";
import { authHeader } from "../../functions/api";
import { CardImage } from "../cardImage";
import { Tariff } from "../../types/tariff";
import React from "react";

export function Logos({
	tariff,
	operatorImageUrl,
}: {
	tariff: Tariff;
	operatorImageUrl: string | null;
}): JSX.Element {
	let operatorImage = operatorImageUrl
		? { uri: operatorImageUrl, ...authHeader }
		: require("@assets/cpo_generic.png");

	return (
		<>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					gap: 5,
				}}
			>
				<CardImage
					tariff={tariff}
					width={88}
					style={{
						transform: [{ rotate: "-15deg" }],
					}}
				/>
				<Image
					source={operatorImage}
					height={120}
					width={180}
					style={{
						height: 120,
						width: 180,
						objectFit: "scale-down",
					}}
				/>
			</View>
		</>
	);
}
