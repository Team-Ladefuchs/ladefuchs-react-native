import React from "react";
import { Text } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../../theme";

interface Props {
	text: string;
}

export function EmptyListText({ text }: Props): JSX.Element {
	return <Text style={styles.emptyListTextStyle}>{text}</Text>;
}

const styles = ScaledSheet.create({
	emptyListStyle: {
		color: colors.ladefuchsGrayTextColor,
		marginVertical: "auto",
		height: "250@s",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyListTextStyle: {
		fontStyle: "italic",
		lineHeight: "22@s",
		textAlign: "center",
		fontSize: "15@s",
		fontFamily: "Bitter",
	},
});
