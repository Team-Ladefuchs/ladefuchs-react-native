import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../../theme";
import { View, ViewStyle } from "react-native";
import React from "react";

interface Props {
	style?: ViewStyle;
}

export function Line({ style }: Props): JSX.Element {
	return <View style={[styles.line, style]} />;
}

const styles = ScaledSheet.create({
	line: {
		height: "1@s",
		backgroundColor: colors.ladefuchsDarkGrayBackground,
		marginTop: "8@s",
		marginBottom: "12@s",
	},
});
