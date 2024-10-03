import React from "react";

import Star from "@assets/favorite/star.svg";

import { Pressable, Text } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import * as Haptics from "expo-haptics";

interface Props {
	checked: boolean;
	onValueChange: (value: boolean) => void;
}

export function FavoriteCheckbox({
	checked,
	onValueChange,
}: Props): JSX.Element {
	return (
		<Pressable
			onPress={() => {
				if (!checked) {
					Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Success,
					);
				}
				onValueChange(!checked);
			}}
		>
			{checked ? <Text style={styles.starText}>⭐️</Text> : <Star />}
		</Pressable>
	);
}

const styles = ScaledSheet.create({
	starText: {
		fontSize: "21@s",
	},
});
