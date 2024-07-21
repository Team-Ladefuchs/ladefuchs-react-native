import React from "react";
import LottieView from "lottie-react-native";
import { scale } from "react-native-size-matters";

interface Props {
	size: number;
}

export function AppLogo({ size }: Props): JSX.Element {
	const scaledSize = scale(size);
	return (
		<LottieView
			source={require("@assets/fuchs/wackelfuchs.json")}
			autoPlay
			loop
			style={{
				width: scaledSize,
				height: scaledSize,
			}}
		/>
	);
}
