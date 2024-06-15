import { View, Image, Text } from "react-native";
import { authHeader } from "../../functions/api";
import { CardImage } from "../cardImage";
import { Tariff } from "../../types/tariff";
import React from "react";

interface Props {
	tariff: Tariff;
	operatorName: string;
	operatorImageUrl: string | null;
}

export function DetailLogos({
	tariff,
	operatorImageUrl,
	operatorName,
}: Props): JSX.Element {
	operatorImageUrl = null;
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
				width={90}
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
							top: "25%",
							left: "50%",
							// backgroundColor: "red",
							width: 60,
							transform: [
								{ translateX: -6 },
								{ translateY: -12 },
							],
							paddingHorizontal: 4,
						}}
					>
						<Text
							style={{
								color: "white",
								paddingHorizontal: "auto",
								fontSize: 15,
								fontFamily: "RobotoCondensed",
								textAlign: "center",
							}}
						>
							{operatorName.replace(
								"Stadtwerke",
								"Stadt\u2010werke"
							)}
						</Text>
					</View>
				)}
			</View>
		</View>
	);
}
