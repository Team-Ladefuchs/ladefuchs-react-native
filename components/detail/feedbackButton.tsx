import React from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../../theme";

interface FeedbackButtonProps {
	onPress: () => void;
}

export function FeedbackButton({ onPress }: FeedbackButtonProps): JSX.Element {
	return (
		<SafeAreaView style={{ marginTop: 10, marginHorizontal: 0 }}>
			<TouchableOpacity activeOpacity={0.8} onPress={onPress}>
				<Text style={[styles.underlinedText]}>
					{"Preise falsch? Dann sag dem Fuchs Bescheid!"}
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = ScaledSheet.create({
	underlinedText: {
		textDecorationLine: "underline",
		color: colors.ladefuchsGrayTextColor,
		fontFamily: "Bitter",
		fontSize: "15@s",
		lineHeight: "20@s",
	},
});
