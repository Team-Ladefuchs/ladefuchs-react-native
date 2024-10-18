import React from "react";
import { colors } from "@theme";
import { Text } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

export function CardHeader({ text }: { text: string }): JSX.Element {
	return (
		<Text style={styles.headerText} lineBreakStrategyIOS="hangul-word">
			{text.toLocaleUpperCase()}
		</Text>
	);
}

const styles = ScaledSheet.create({
	headerText: {
		paddingBottom: 5,
		fontWeight: "bold",
		color: colors.ladefuchsGrayTextColor,
		fontSize: "14@s",
	},
});
