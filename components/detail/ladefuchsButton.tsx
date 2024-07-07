import React from "react";
import { Text, TouchableOpacity, Platform } from "react-native";
import { colors } from "../../theme";
import { ScaledSheet } from "react-native-size-matters";

export function LadefuchsButton({
	link,
	onPress,
}: {
	link: string | null | undefined;
	onPress: () => void;
}): JSX.Element {
	if (!link) {
		return <></>;
	}
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={styles.button}
			onPress={onPress}
		>
			<Text style={styles.buttonText}>
				{"Senden".toLocaleUpperCase()}
			</Text>
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
	buttonText: {
		fontSize: "22@s",
		color: "#fff",
		textAlign: "center",
		fontWeight: "bold",
	},
});
