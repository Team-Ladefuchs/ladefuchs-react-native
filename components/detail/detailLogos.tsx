import { View, Image, Text } from "react-native";
import { authHeader } from "../../functions/api";
import { CardImage } from "../shared/cardImage";
import { Tariff } from "../../types/tariff";
import React, { useEffect, useState } from "react";
import { hyphenText } from "../../functions/util";
import { scale } from "react-native-size-matters";
interface Props {
	tariff: Tariff;
	operatorName: string;
	operatorImageUrl: string | null;
}

const fallBack = require("@assets/cpo_generic.png");

export function DetailLogos({
	tariff,
	operatorImageUrl,
	operatorName,
}: Props): JSX.Element {
	const [imageError, setImageError] = useState(false);
	let [operatorImage, setOperatorImage] = useState(
		operatorImageUrl ? { uri: operatorImageUrl, ...authHeader } : fallBack
	);

	useEffect(() => {
		if (!imageError) {
			return;
		}
		setOperatorImage(fallBack);
	}, [imageError, setOperatorImage]);

	const showFallBack = !operatorImageUrl || imageError;
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
				width={79}
				style={{
					transform: [{ rotate: "-15deg" }],
				}}
			/>
			<View style={{ position: "relative" }}>
				<Image
					source={operatorImage}
					onError={() => setImageError(true)}
					style={{
						height: scale(125),
						width: scale(180),
						objectFit: "scale-down",
					}}
				/>
				{showFallBack && (
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
