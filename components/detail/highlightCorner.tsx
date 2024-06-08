import React from "react";
import { View, StyleSheet } from "react-native";
import HighlightCornerSvg from "@assets/highlightCorner.svg";

export function HighlightCorner(): JSX.Element {
	return (
		<View style={styles.highlightCorner}>
			<HighlightCornerSvg width={18} height={18} />
		</View>
	);
}

const styles = StyleSheet.create({
	highlightCorner: {
		position: "absolute",
		top: -1,
		right: -1,
		shadowOffset: { width: -1, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
	},
});
