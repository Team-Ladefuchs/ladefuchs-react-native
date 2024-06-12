import React from "react";
import { colors } from "../../theme";
import { Text, StyleSheet, Platform } from "react-native";
export function CardHeader({ text }: { text: string }): JSX.Element {
	return <Text style={styles.headerText}>{text.toLocaleUpperCase()}</Text>;
}

const styles = StyleSheet.create({
	headerText: {
		...Platform.select({
			android: {
				fontSize: 14.5,
			},
			default: {
				fontSize: 16,
			},
		}),
		paddingBottom: 4,
		fontWeight: "bold",
		color: colors.ladefuchsGrayTextColor,
	},
});
