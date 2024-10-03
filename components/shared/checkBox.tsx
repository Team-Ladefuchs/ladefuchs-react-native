import React from "react";
import { DimensionValue, Pressable } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import CheckMark from "@assets/generic/checkmark_bold.svg";
import { colors } from "../../theme";
import * as Haptics from "expo-haptics";

interface Props {
	checked: boolean;
	size?: DimensionValue;
	onValueChange: (value: boolean) => void;
}

export function Checkbox({
	checked,
	onValueChange,
	size = scale(24),
}: Props): JSX.Element {
	return (
		<Pressable
			style={[
				styles.checkBox,
				checked && styles.checked,
				{ width: size, height: size },
			]}
			hitSlop={scale(12)}
			onPress={() => {
				if (!checked) {
					Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Success,
					);
				}

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
		marginHorizontal: "1@s",
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
