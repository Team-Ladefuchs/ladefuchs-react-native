import React from "react";
import LottieView from "lottie-react-native";

export function LogoAnimation(props) {
	return (
		<LottieView
			source={require("../assets/flunkerfuchs.json")}
			autoPlay
			loop
			style={{ width: 64, height: 64 }}
		/>
	);
}
