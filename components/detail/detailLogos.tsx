import { View, Image, Text } from "react-native";
import { authHeader } from "../../functions/api";
import { CardImage } from "../cardImage";
import { Tariff } from "../../types/tariff";
import React from "react";
import { hyphenText } from "../../functions/util";

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
						height: 125,
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
							width: 62,
							transform: [
								{ translateX: -6 },
								{ translateY: -12 },
							],
							paddingHorizontal: 3,
						}}
					>
						<Text
							lineBreakMode="tail"
							style={{
								color: "white",
								paddingHorizontal: "auto",
								fontSize: 13,
								fontFamily: "RobotoCondensed",
								textAlign: "center",
							}}
							numberOfLines={3}
						>
							{hyphenText(operatorName)}
						</Text>
					</View>
				)}
			</View>
		</View>
	);
}
