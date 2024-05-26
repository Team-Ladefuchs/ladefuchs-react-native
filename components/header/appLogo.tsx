import React from "react";
import LottieView from "lottie-react-native";
import { DimensionValue } from "react-native";

interface Props {
	size: DimensionValue;
}

export function AppLogo({ size }: Props): JSX.Element {
	return (
		<LottieView
			source={require("@assets/flunkerfuchs.json")}
			autoPlay
			loop
			style={{ width: size, height: size }}
		/>
	);
}
