import React from "react";
import { Pressable } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import CheckMark from "@assets/generic/checkmark_bold.svg";
import { colors } from "../../theme";

interface Props {
	checked: boolean;
	onValueChange: (value: boolean) => void;
}

export function Checkbox({ checked, onValueChange }: Props): JSX.Element {
	return (
		<Pressable
			style={[styles.checkBox, checked && styles.checked]}
			hitSlop={scale(12)}
			onPress={() => {
				onValueChange(!checked);
			}}
		>
			<CheckMark
				opacity={checked ? 100 : 0}
				style={styles.checkMark}
				height={scale(18)}
				width={scale(18)}
			/>
		</Pressable>
	);
}

const styles = ScaledSheet.create({
	checkBox: {
		marginHorizontal: "8@s",
		borderRadius: "6@s",
		padding: "3@s",
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",
		opacity: 0.75,
		backgroundColor: colors.ladefuchsDarkGrayBackground,
	},
	checkMark: {
		left: "2@s",
		top: "2@s",
	},
	checked: {
		opacity: 1,
		backgroundColor: colors.ladefuchsOrange,
	},
});
