import React from "react";
import { View, ActivityIndicator } from "react-native";
import { colors } from "@theme";

export function LoadingSpinner(): JSX.Element {
	return (
		<View style={{ margin: "auto" }}>
			<ActivityIndicator size="large" color={colors.ladefuchsOrange} />
		</View>
	);
}
