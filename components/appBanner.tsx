import React from "react";
import {
	View,
	TouchableWithoutFeedback,
	Image,
	Linking,
	ImageStyle,
	StyleProp,
} from "react-native";
import { colors } from "../theme";
import { authHeader } from "../functions/api";
import { Banner } from "../types/banner";

interface Props {
	banner: Banner;
}

export function AppBanner({ banner }: Props) {
	const width = "85%";
	const { bannerType, imageUrl, affiliateLinkUrl } = banner;
	const imageStyle = (): StyleProp<ImageStyle> => {
		if (bannerType === "chargePrice") {
			return {
				width,
				aspectRatio: "6.4",
				marginTop: 35,
				overflow: "hidden",
				borderTopLeftRadius: 14,
				borderTopRightRadius: 14,
				objectFit: "scale-down",
			};
		}
		return {
			height: 125,
			marginTop: 30,
			aspectRatio: "2.8",
			objectFit: "scale-down",
		};
	};
	return (
		<View
			style={{
				flex: 12,
				backgroundColor: colors.ladefuchsDarkBackground,
				alignItems: "center", // Center the content horizontally
				overflow: "visible",
				height: 115,
				display: "flex",
				justifyContent: "center",
			}}
		>
			<TouchableWithoutFeedback
				onPress={() => Linking.openURL(affiliateLinkUrl)}
				style={{ marginTop: 20 }}
			>
				<Image
					resizeMode="contain" // Ensure the image fits within the specified dimensions
					source={{ uri: imageUrl, ...authHeader }}
					style={imageStyle()}
				/>
			</TouchableWithoutFeedback>
			{bannerType === "chargePrice" && (
				<View
					style={{
						backgroundColor: "white",
						width,
						height: "103%",
					}}
				/>
			)}
		</View>
	);
}
