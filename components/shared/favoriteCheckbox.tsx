import React from "react";

import Star from "@assets/favorite/star.svg";

import { Pressable, View, Text } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

interface Props {
	checked: boolean;
	onValueChange: (value: boolean) => void;
}

export function FavoriteCheckbox({
	checked,
	onValueChange,
}: Props): JSX.Element {
	return (
		<Pressable onPress={() => onValueChange(!checked)}>
			{checked ? <Star /> : <Text style={styles.starText}>⭐️</Text>}
		</Pressable>
	);
}

const styles = ScaledSheet.create({
	starText: {
		fontSize: "21@s",
	},
});
