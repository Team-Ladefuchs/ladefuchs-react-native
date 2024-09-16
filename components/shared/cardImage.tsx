import { authHeader } from "../../functions/api/base";
import {
	View,
	Image,
	StyleSheet,
	Text,
	StyleProp,
	ViewStyle,
	ImageStyle,
	Platform,
} from "react-native";
import { HighlightCorner } from "../detail/highlightCorner";
import React, { useState } from "react";
import { colors } from "../../theme";
import { scale } from "react-native-size-matters";

interface Props {
	imageUrl: string | null;
	name?: string;
	showHighlightCorner?: boolean;
	hideFallBackText?: boolean;
	width: number;
	elevation?: number;
	style?: ImageStyle;
}

export function CardImage({
	imageUrl,
	name,
	showHighlightCorner = false,
	width,
	elevation = 4,
	hideFallBackText = false,
	style: styleProp,
}: Props): JSX.Element {
	const [imageError, setImageError] = useState(false);

	return (
		<View
			style={[
				{
					...styles.cardImageContainer,
					...styleProp,
				},
				{ width: scale(width), elevation },
			]}
		>
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
					source={{
						uri: imageUrl,
						...authHeader,
					}}
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
		default: {
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.25,
			shadowRadius: 4,
		},
	}),
} as StyleProp<ViewStyle>;

const card = {
	backgroundColor: "#fff",
	borderRadius: 4,
	aspectRatio: 1.6,
} satisfies StyleProp<ViewStyle>;

const styles = StyleSheet.create({
	cardImageContainer: {
		...card,
		position: "relative",
	},
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
		fontSize: scale(10.5),
	},
	fallbackImage: {
		position: "absolute",
		right: -2,
		bottom: -2,
		height: scale(20),
		objectFit: "scale-down",
		width: scale(20),
	},
});
