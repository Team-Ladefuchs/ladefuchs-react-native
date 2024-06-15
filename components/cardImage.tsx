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
	Platform,
} from "react-native";
import { HighlightCorner } from "./detail/highlightCorner";
import React from "react";
import { colors } from "../theme";

interface Props {
	tariff: Tariff;
	showHighlightCorner?: boolean;
	width?: number;
	style?: ImageStyle;
}

export function CardImage({
	tariff,
	showHighlightCorner = false,
	width = 80,
	style: styleProp,
}: Props): JSX.Element {
	const image = () => {
		if (!tariff.imageUrl) {
			return (
				<Text
					numberOfLines={3}
					style={{
						fontFamily: "RobotoCondensed",
						height: "100%",
						overflow: "hidden",
						color: "#fff",
						alignContent: "center",
						marginHorizontal: 6,
						marginVertical: 4,
						fontSize: 12,
					}}
				>
					{tariff.name}
				</Text>
			);
		}
		return (
			<Image
				source={{
					uri: tariff.imageUrl,
					...authHeader,
				}}
				style={{ ...styles.cardImage }}
			/>
		);
	};
	return (
		<View style={{ ...styles.cardImageContainer, ...styleProp, width }}>
			{showHighlightCorner && <HighlightCorner />}
			{image()}
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
	backgroundColor: colors.ladefuchsOrange,
	borderRadius: 4,
	aspectRatio: 1.6,
} satisfies StyleProp<ViewStyle>;

const styles = StyleSheet.create({
	cardImageContainer: {
		...card,
		...dropShadow,
		position: "relative",
		...Platform.select({
			android: {
				width: 76,
			},
			default: {
				width: 80,
			},
		}),
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
