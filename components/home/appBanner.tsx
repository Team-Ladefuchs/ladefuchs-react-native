import React, { useEffect, useState } from "react";
import {
	View,
	TouchableWithoutFeedback,
	Linking,
	Platform,
} from "react-native";
import { Image } from "expo-image";
import { colors } from "@theme";
import { authHeader } from "../../functions/api/base";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../../state/appState";
import { ScaledSheet } from "react-native-size-matters";

export function AppBanner(): JSX.Element {
	const [banner] = useAppStore(useShallow((state) => [state.banner]));
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		if (banner) {
			setImageLoaded(false);
		}
	}, [banner]);

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
					>
						<Image
							contentFit="contain"
							source={{ uri: banner.imageUrl, ...authHeader }}
							style={[
								styles.image,
								{
									aspectRatio:
										banner?.bannerType === "chargePrice"
											? "6.4"
											: "2.8",
								},
							]}
							onLoad={() => setImageLoaded(true)}
							onError={() => setImageLoaded(false)}
							transition={0}
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

const styles = ScaledSheet.create({
	viewContainer: {
		backgroundColor: colors.ladefuchsDarkBackground,
		alignItems: "center",
		overflow: "visible",
		flex: 16,
		display: "flex",
		justifyContent: "center",
	},
	image: {
		width: "85%",
		marginTop: "35@s",
		overflow: "hidden",
		borderTopLeftRadius: "14@s",
		borderTopRightRadius: "14@s",
		objectFit: "scale-down",
	},
	blankBanner: {
		backgroundColor: "#fff",
		marginTop: -2,
		height: "100%",
		...Platform.select({
			android: {
				width: "85%",
			},
			ios: {
				width: "85%",
			},
		}),
	},
});
