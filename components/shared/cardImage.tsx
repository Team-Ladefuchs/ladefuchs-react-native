import {
	View,
	Image,
	Text,
	StyleProp,
	StyleSheet,
	ViewStyle,
	ImageStyle,
	Platform,
	ImageSourcePropType,
} from "react-native";
import { HighlightCorner } from "../detail/highlightCorner";
import React, { useState } from "react";
import { colors } from "@theme";
import { ScaledSheet, scale } from "react-native-size-matters";

import FavStar from "@assets/favorite/favstern.svg";
import { getImageSource } from "../../functions/util";

interface Props {
	imageUrl: string | ImageSourcePropType | null;
	name?: string;
	showHighlightCorner?: boolean;
	hideFallBackText?: boolean;
	isFavorite?: boolean;
	width: number;
	styleProp?: ImageStyle;
}

export function CardImage({
	imageUrl,
	name,
	showHighlightCorner = false,
	width,
	isFavorite = false,
	hideFallBackText = false,
	styleProp,
}: Props): JSX.Element {
	const [imageError, setImageError] = useState(false);
	const favoriteStarSize = 20;

	const image = getImageSource(imageUrl);
	return (
		<View
			style={[
				dropShadow,
				{
					...cardStyle.cardImageContainer,
					...styleProp,
				},
				{ width: scale(width) },
			]}
		>
			{isFavorite && (
				<FavStar
					height={scale(favoriteStarSize)}
					width={scale(favoriteStarSize)}
					style={styles.favoriteStar}
				/>
			)}

			{showHighlightCorner && <HighlightCorner />}
			{!imageUrl || imageError ? (
				<FallBack
					name={name ?? ""}
					hideFallBackText={hideFallBackText}
				/>
			) : (
				<Image
					onError={() => {
						setImageError(true);
					}}
					source={image!}
					style={styles.cardImage}
				/>
			)}
		</View>
	);
}

function FallBack({
	name,
	hideFallBackText,
}: {
	name: string;
	hideFallBackText: boolean;
}): JSX.Element {
	return (
		<View style={styles.fallbackContainer}>
			{!hideFallBackText && (
				<Text numberOfLines={3} style={styles.fallbackText}>
					{name}
				</Text>
			)}
			<Image
				source={require("@assets/generic/blitz.png")}
				resizeMethod={"scale"}
				fadeDuration={0}
				style={styles.fallbackImage}
			/>
		</View>
	);
}

export const dropShadow = {
	...Platform.select({
		ios: {
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.25,
			shadowRadius: 4,
		},
		android: {
			elevation: 4,
		},
	}),
} as StyleProp<ViewStyle>;

const card = {
	backgroundColor: "#fff",
	borderRadius: 4,
	aspectRatio: 1.6,
} satisfies StyleProp<ViewStyle>;

const cardStyle = StyleSheet.create({
	cardImageContainer: {
		...card,
		position: "relative",
	},
});
const styles = ScaledSheet.create({
	cardImage: {
		...card,
		width: "100%",
		height: "100%",
	},
	priceText: {
		fontSize: 25,
		fontWeight: "400",
	},
	fallbackContainer: {
		backgroundColor: colors.ladefuchsOrange,
		height: "100%",
		overflow: "hidden",
		alignContent: "center",
		borderRadius: 4,
	},
	fallbackText: {
		marginHorizontal: 6,
		marginVertical: 4,
		fontFamily: "RobotoCondensed",
		color: "#fff",
		fontSize: "10.5@s",
	},
	fallbackImage: {
		position: "absolute",
		right: -2,
		bottom: -2,
		height: "20@s",
		objectFit: "scale-down",
		width: "20@s",
	},
	favoriteStar: {
		position: "absolute",
		zIndex: 3,
		top: "-5@s",
		left: "-11.0@s",
		shadowColor: "#000",
		shadowOffset: { width: -0.1, height: 1.5 },
		shadowOpacity: 0.4,
		shadowRadius: 0.5,
		elevation: 5,
	},
});
