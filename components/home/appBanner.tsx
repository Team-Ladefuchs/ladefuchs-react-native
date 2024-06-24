import React, { useEffect, useState } from "react";
import {
	View,
	TouchableWithoutFeedback,
	Image,
	Linking,
	ImageStyle,
	StyleProp,
} from "react-native";
import { colors } from "../../theme";
import { authHeader } from "../../functions/api";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../../state/state";

export function AppBanner(): JSX.Element {
	const [banner] = useAppStore(useShallow((state) => [state.banner]));
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		setImageLoaded(false);
	}, [banner]);

	const imageStyle = (): StyleProp<ImageStyle> => {
		if (banner?.bannerType === "chargePrice") {
			return {
				width: "85%",
				aspectRatio: "6.4",
				marginTop: 35,
				overflow: "hidden",
				borderTopLeftRadius: 14,
				borderTopRightRadius: 14,
				objectFit: "scale-down",
			};
		}
		return {
			height: 120,
			marginTop: 30,
			aspectRatio: "2.8",
			objectFit: "scale-down",
		};
	};

	return (
		<View
			style={{
				backgroundColor: colors.ladefuchsDarkBackground,
				alignItems: "center",
				overflow: "visible",
				flex: 16,
				display: "flex",
				justifyContent: "center",
			}}
		>
			{banner && (
				<>
					<TouchableWithoutFeedback
						onPress={async () => {
							if (imageLoaded) {
								await Linking.openURL(banner.affiliateLinkUrl);
							}
						}}
						style={{ marginTop: 20 }}
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
						<View
							style={{
								backgroundColor: "#fff",
								width: "84.5%",
								marginTop: -2,
								height: "100%",
							}}
						/>
					)}
				</>
			)}
		</View>
	);
}
