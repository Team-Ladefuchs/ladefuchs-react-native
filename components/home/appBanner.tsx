import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Image,
	Linking,
	ImageStyle,
	StyleProp,
	Platform,
} from "react-native";
import { colors } from "@theme";
import { authHeader } from "../../functions/api/base";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../../state/appState";
import { scale } from "react-native-size-matters";

export function AppBanner(): JSX.Element {
	const [banner] = useAppStore(useShallow((state) => [state.banner]));
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		if (banner) {
			setImageLoaded(false);
		}
	}, [banner]);

	const imageStyle = (): StyleProp<ImageStyle> => {
		if (banner?.bannerType === "chargePrice") {
			return {
				width: "85%",
				aspectRatio: "6.4",
				marginTop: scale(35),
				overflow: "hidden",
				borderTopLeftRadius: scale(14),
				borderTopRightRadius: scale(14),
				objectFit: "scale-down",
			};
		}
		return {
			height: scale(100),
			marginTop: scale(18),
			aspectRatio: "2.8",
			objectFit: "scale-down",
		};
	};

	return (
		<View style={styles.viewContainer}>
			{banner && (
				<>
					<TouchableWithoutFeedback
						onPress={async () => {
							if (imageLoaded) {
								await Linking.openURL(banner.affiliateLinkUrl);
							}
						}}
						style={{ marginTop: scale(20) }}
					>
						<Image
							resizeMode="contain"
							source={{ uri: banner.imageUrl, ...authHeader }}
							style={imageStyle()}
							onLoad={() => setImageLoaded(true)}
							onError={() => setImageLoaded(false)}
							fadeDuration={0}
						/>
					</TouchableWithoutFeedback>
					{banner.bannerType === "chargePrice" && imageLoaded && (
						<View style={styles.blankBanner} />
					)}
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	viewContainer: {
		backgroundColor: colors.ladefuchsDarkBackground,
		alignItems: "center",
		overflow: "visible",
		flex: 16,
		display: "flex",
		justifyContent: "center",
	},
	blankBanner: {
		backgroundColor: "#fff",
		marginTop: -2,
		height: "100%",
		...Platform.select({
			android: {
				width: "85%",
			},
			default: {
				width: "85%",
			},
		}),
	},
});
