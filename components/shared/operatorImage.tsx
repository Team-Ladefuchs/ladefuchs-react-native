import React, { useState } from "react";
import { scale } from "react-native-size-matters";
import { authHeader } from "../../functions/api/base";
import { Image, View, Text } from "react-native";
import { hyphenText } from "../../functions/util";

interface Props {
	imageUrl: string | null;
	name?: string;
	height: number;
	width: number;
	hideFallBackText?: boolean;
}

const fallBack = require("@assets/generic/cpo_generic.png");

export function OperatorImage({
	imageUrl,
	name,
	height,
	width,
	hideFallBackText = false,
}: Props): JSX.Element {
	const [imageError, setImageError] = useState(false);

	return (
		<View style={{ position: "relative" }}>
			{!imageUrl || imageError ? (
				<FallBack
					name={name ?? ""}
					height={height}
					width={width}
					hideFallBackText={hideFallBackText}
				/>
			) : (
				<Image
					source={
						imageUrl ? { uri: imageUrl, ...authHeader } : fallBack
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
	name,
	height,
	width,
	hideFallBackText,
}: {
	name: string;
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
						{hyphenText(name ?? "")}
					</Text>
				)}
			</View>
		</>
	);
}
