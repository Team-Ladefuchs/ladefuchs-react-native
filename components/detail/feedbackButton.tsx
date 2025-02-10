import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { colors } from "@theme";
import i18n from "@translations/translations";

interface FeedbackButtonProps {
	onPress: () => void;
}

export function FeedbackButton({ onPress }: FeedbackButtonProps): JSX.Element {
	return (
		<View style={styles.container}>
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={onPress}
				hitSlop={scale(10)}
			>
				<Text style={[styles.underlinedText]}>
					{i18n.t("wrongPrice")}
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = ScaledSheet.create({
	container: {
		marginTop: "5@s",
		paddingBottom: "16@s",
	},
	underlinedText: {
		textDecorationLine: "underline",
		textAlign: "right",
		color: colors.ladefuchsGrayTextColor,
		fontFamily: "Bitter",
		fontStyle: "italic",
		fontSize: "13@s",
	},
});
