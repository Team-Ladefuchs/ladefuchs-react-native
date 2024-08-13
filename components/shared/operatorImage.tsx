import React, { useState } from "react";
import { scale } from "react-native-size-matters";
import { Operator } from "../../types/operator";
import { apiUrl, authHeader } from "../../functions/api/base";
import { Image, View, Text } from "react-native";
import { hyphenText } from "../../functions/util";

interface Props {
	operator: Operator;
	height: number;
	width: number;
	hideFallBackText?: boolean;
}

const fallBack = require("@assets/generic/cpo_generic.png");

export function OperatorImage({
	operator,
	height,
	width,
	hideFallBackText = false,
}: Props): JSX.Element {
	const [imageError, setImageError] = useState(false);

	if (hideFallBackText && !operator?.imageUrl) {
		operator!.imageUrl = `${apiUrl}/images/generic/cpo_generic_fuchs.png`;
	}

	return (
		<View style={{ position: "relative" }}>
			{!operator.imageUrl || imageError ? (
				<FallBack
					operator={operator}
					height={height}
					width={width}
					hideFallBackText={hideFallBackText}
				/>
			) : (
				<Image
					source={
						operator?.imageUrl
							? { uri: operator?.imageUrl, ...authHeader }
							: fallBack
					}
					onError={() => setImageError(true)}
					style={{
						height: scale(height),
						width: scale(width),
						objectFit: "scale-down",
					}}
				/>
			)}
		</View>
	);
}

function FallBack({
	operator,
	height,
	width,
	hideFallBackText,
}: {
	operator: Operator;
	height: number;
	width: number;
	hideFallBackText: boolean;
}): JSX.Element {
	return (
		<>
			<Image
				source={fallBack}
				style={{
					height: scale(height),
					width: scale(width),
					objectFit: "scale-down",
				}}
			/>
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
				{!hideFallBackText && (
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
				)}
			</View>
		</>
	);
}
