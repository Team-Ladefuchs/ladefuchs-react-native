import React, { useEffect, useState } from "react";
import {
	View,
	TouchableWithoutFeedback,
	Linking,
	Platform,
	AppState,
	AppStateStatus,
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
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
			if (nextAppState === 'active') {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		});

		return () => {
			subscription.remove();
		};
	}, []);

	useEffect(() => {
		if (banner) {
			setImageLoaded(false);
		}
	}, [banner]);

	if (!isVisible) return <View />;

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
											? "6.0"
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
		marginTop: "30@s",
		overflow: "hidden",
		borderTopLeftRadius: "14@s",
		borderTopRightRadius: "14@s",
		objectFit: "scale-down",
	},
	blankBanner: {
		backgroundColor: "white",
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
