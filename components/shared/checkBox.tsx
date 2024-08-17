import React, { useState } from "react";
import { Pressable } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import CheckMark from "@assets/generic/checkmark.svg";
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
		borderWidth: "2@s",
		padding: "1@s",
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",
		borderColor: colors.ladefuchsOrange,
	},
	checkMark: {
		left: "3@s",
		top: "3@s",
		padding: 10,
	},
	checked: {
		backgroundColor: colors.ladefuchsOrange,
	},
});
