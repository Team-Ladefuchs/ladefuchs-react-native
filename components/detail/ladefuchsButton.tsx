import React from "react";
import { Text, TouchableOpacity, Platform } from "react-native";
import { colors } from "../../theme";
import { ScaledSheet, scale } from "react-native-size-matters";

export function LadefuchsButton({
	onPress,
	text,
	disabled = false,
}: {
	text: string;
	disabled?: boolean;
	onPress: () => void;
}): JSX.Element {
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			hitSlop={scale(8)}
			disabled={disabled}
			style={[styles.button, disabled && styles.disabledButton]}
			onPress={onPress}
		>
			<Text style={styles.buttonText}>{text.toLocaleUpperCase()}</Text>
		</TouchableOpacity>
	);
}

const styles = ScaledSheet.create({
	button: {
		...Platform.select({
			android: {
				marginBottom: "14@s",
				padding: "8@s",
			},
			default: {
				marginBottom: "1@s",
				padding: "9@s",
			},
		}),
		backgroundColor: colors.ladefuchsOrange,
		borderRadius: "12@s",
	},
	disabledButton: {
		opacity: 0.7, // Customize opacity when disabled
	},
	buttonText: {
		fontSize: "22@s",
		color: "#fff",
		textAlign: "center",
		fontWeight: "bold",
	},
});
