import React from "react";
import { View, TouchableOpacity, Image, Linking } from "react-native";
import { colors } from "../theme";
import { authHeader } from "../functions/api";

interface Props {
	link: string;
	imageUrl: string;
}

export function Banner({ link, imageUrl }: Props) {
	console.log(link);
	return (
		<View
			style={{
				flex: 12,
				backgroundColor: colors.ladefuchsDarkBackground,
				alignItems: "center", // Center the content horizontally
				overflow: "visible",
				marginTop: 16,
				height: 115,
				display: "flex",
				justifyContent: "center",
			}}
		>
			<TouchableOpacity
				onPress={() => Linking.openURL(link)}
				style={{ marginTop: 20 }}
			>
				<Image
					resizeMode="contain" // Ensure the image fits within the specified dimensions
					source={{ uri: imageUrl, ...authHeader }}
					style={{
						height: 125,
						marginTop: 22,
						aspectRatio: "2.8",
						objectFit: "fill",
					}}
				/>
			</TouchableOpacity>
		</View>
	);
}
