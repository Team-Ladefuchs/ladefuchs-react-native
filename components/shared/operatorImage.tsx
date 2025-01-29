import React, { useState } from "react";
import { scale } from "react-native-size-matters";
import { View, Text, ImageSourcePropType } from "react-native";
import { Image } from "expo-image";
import { getImageSource, hyphenText } from "../../functions/util";

interface Props {
	imageUrl: string | null | ImageSourcePropType;
	name?: string;
	height: number;
	width: number;
	hideFallBackText?: boolean;
}

const fallBack = require("@assets/generic/cpo_generic.png");

const commonImageStyles = (height: number, width: number) => ({
	height: scale(height),
	width: scale(width),
	contentFit: "scale-down" as const,
});

export function OperatorImage({
	imageUrl,
	name,
	height,
	width,
	hideFallBackText = false,
}: Props): JSX.Element {
	const [imageError, setImageError] = useState(false);
	const image = getImageSource(imageUrl);
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
					source={image ?? fallBack}
					onError={() => setImageError(true)}
					style={commonImageStyles(height, width)}
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
			<Image source={fallBack} style={commonImageStyles(height, width)} />
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
