import React, { useEffect, useState } from "react";
import { scale } from "react-native-size-matters";
import { Operator } from "../../types/operator";
import { authHeader } from "../../functions/api";
import { Image, View, Text } from "react-native";
import { hyphenText } from "../../functions/util";

interface Props {
	operator: Operator | null;
	height: number;
	width: number;
	hideFallBackText?: boolean;
}

const fallBack = require("@assets/cpo_generic.png");

export function OperatorImage({
	operator,
	height,
	width,
	hideFallBackText = false,
}: Props): JSX.Element {
	const [imageError, setImageError] = useState(false);
	let [operatorImage, setOperatorImage] = useState(
		operator?.imageUrl
			? { uri: operator?.imageUrl, ...authHeader }
			: fallBack,
	);

	useEffect(() => {
		if (!imageError) {
			return;
		}
		setOperatorImage(fallBack);
	}, [imageError, setOperatorImage]);

	const showFallBack = !operator?.imageUrl || imageError;

	return (
		<View style={{ position: "relative" }}>
			<Image
				source={operatorImage}
				onError={() => setImageError(true)}
				style={{
					height: scale(height),
					width: scale(width),
					objectFit: "scale-down",
				}}
			/>
			{showFallBack && !hideFallBackText && (
				<View
					style={{
						position: "absolute",
						top: "25%",
						left: "50%",
						width: 62,
						transform: [{ translateX: -6 }, { translateY: -12 }],
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
						{hyphenText(operator?.name ?? "")}
					</Text>
				</View>
			)}
		</View>
	);
}
