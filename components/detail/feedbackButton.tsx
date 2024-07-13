import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../../theme";

interface FeedbackButtonProps {
	onPress: () => void;
}

export function FeedbackButton({ onPress }: FeedbackButtonProps): JSX.Element {
	return (
		<View style={styles.container}>
			<TouchableOpacity activeOpacity={0.8} onPress={onPress}>
				<Text style={[styles.underlinedText]}>
					{"Preise falsch? Sag dem Fuchs Bescheid!"}
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = ScaledSheet.create({
	container: {
		marginTop: "3@s",
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
