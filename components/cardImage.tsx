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
					style={{
						height: "100%",
						overflow: "hidden",
						alignContent: "center",
						marginHorizontal: 6,
						marginVertical: 6,
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
	backgroundColor: "#fff",
	borderRadius: 4,
	aspectRatio: 1.6,
} satisfies StyleProp<ViewStyle>;

const styles = StyleSheet.create({
	cardImageContainer: {
		...card,
		...dropShadow,
		position: "relative",
		width: 80,
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
