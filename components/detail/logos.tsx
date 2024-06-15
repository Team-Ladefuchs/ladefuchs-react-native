import { View, Image, Text } from "react-native";
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
			<View style={{ position: "relative" }}>
				<Image
					source={operatorImage}
					style={{
						height: 120,
						width: 180,
						objectFit: "scale-down",
					}}
				/>
				{/* Conditionally render the Text component over the image if operatorImageUrl is null */}
				{!operatorImageUrl && (
					<View
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: [
								{ translateX: -10 },
								{ translateY: -10 },
							],
							backgroundColor: "rgba(0, 0, 0, 0.2)",
							padding: 5,
						}}
					>
						{/* hier dann String aus operatorURL */}
						<Text style={{ color: "white", textAlign: "center" }}>
							Operator
						</Text>
					</View>
				)}
			</View>
		</View>
	);
}
