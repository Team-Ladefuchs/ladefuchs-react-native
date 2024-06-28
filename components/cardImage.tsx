import { authHeader } from "../functions/api";
import { Tariff } from "../types/tariff";
import {
	View,
	Image,
	StyleSheet,
	Text,
	StyleProp,
	ViewStyle,
	ImageStyle,
} from "react-native";
import { HighlightCorner } from "./detail/highlightCorner";
import React, { useState } from "react";
import { colors } from "../theme";
import { scale } from "react-native-size-matters";
interface Props {
	tariff: Tariff;
	showHighlightCorner?: boolean;
	width: number;
	style?: ImageStyle;
}

function FallBack({ tariff }: { tariff: Tariff }): JSX.Element {
	return (
		<View
			style={{
				backgroundColor: colors.ladefuchsOrange,
				height: "100%",
				overflow: "hidden",
				alignContent: "center",
				borderRadius: 4,
			}}
		>
			<Text
				numberOfLines={3}
				style={{
					marginHorizontal: 6,
					marginVertical: 4,
					fontFamily: "RobotoCondensed",
					color: "#fff",
					fontSize: 12,
				}}
			>
				{tariff.name}
			</Text>
			<Image
				source={require("@assets/blitz.png")}
				resizeMethod={"scale"}
				fadeDuration={0}
				style={{
					position: "absolute",
					right: -2,
					bottom: -2,
					height: 23,
					objectFit: "scale-down",
					width: 23,
				}}
			/>
		</View>
	);
}

export function CardImage({
	tariff,
	showHighlightCorner = false,
	width,
	style: styleProp,
}: Props): JSX.Element {
	const [imageError, setImageError] = useState(false);
	return (
		<View
			style={{
				...styles.cardImageContainer,
				...styleProp,
				width: scale(width),
			}}
		>
			{showHighlightCorner && <HighlightCorner />}
			{!tariff.imageUrl || imageError ? (
				<FallBack tariff={tariff} />
			) : (
				<Image
					onError={() => setImageError(true)}
					source={{
						uri: tariff.imageUrl,
						...authHeader,
					}}
					style={{ ...styles.cardImage }}
				/>
			)}
		</View>
	);
}

export const dropShadow = {
	shadowColor: "#000",
	shadowOffset: {
		width: 0,
		height: 1,
	},
	shadowOpacity: 0.25,
	shadowRadius: 4,
	elevation: 4,
} satisfies StyleProp<ViewStyle>;

const card = {
	backgroundColor: "#fff",
	borderRadius: 4,
	aspectRatio: 1.6,
} satisfies StyleProp<ViewStyle>;

const styles = StyleSheet.create({
	cardImageContainer: {
		...card,
		...dropShadow,
		position: "relative",
	},
	cardImage: {
		...card,
		width: "100%",
	},
	priceText: {
		fontSize: 25,
		fontWeight: "400",
	},
});
