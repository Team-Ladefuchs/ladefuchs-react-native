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

	return (
		<View style={styles.viewContainer}>
			{banner && isVisible && (
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
							transition={0}						
							priority="high"
							style={[
								styles.image,
								{
									aspectRatio: "2.8",
								},
							]}
							onLoad={() => setImageLoaded(true)}
							onError={() => setImageLoaded(false)}
						/>
					</TouchableWithoutFeedback>
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
});
