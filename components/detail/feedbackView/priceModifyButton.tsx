import React, { useEffect, useState } from "react";
import { Platform, TouchableOpacity } from "react-native";

import PlusCircle from "@assets/plusMinus/plus_circle_fill.svg";
import MinusIcon from "@assets/plusMinus/minus_circle_fill.svg";
import { ScaledSheet, scale } from "react-native-size-matters";

interface Props {
	buttonType: "plus" | "minus";
	onPress: () => void;
	size?: number;
}

export function PriceModifyButton({
	buttonType,
	onPress,
	size = 23,
}: Props): JSX.Element {
	const editButtonSize = scale(size);

	const [intervalId, setIntervalId] = useState(null);

	const delayMs = Platform.OS === "ios" ? 170 : 250;

	useEffect(() => {
		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [intervalId]);

	const handlePressIn = () => {
		setIntervalId(
			setInterval(() => {
				onPress();
			}, delayMs)
		);
	};

	const handlePressOut = () => {
		clearInterval(intervalId);
		setIntervalId(null);
	};

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={style.button}
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
		>
			{buttonType === "plus" ? (
				<PlusCircle height={editButtonSize} width={editButtonSize} />
			) : (
				<MinusIcon height={editButtonSize} width={editButtonSize} />
			)}
		</TouchableOpacity>
	);
}

const style = ScaledSheet.create({
	button: {
		paddingVertical: "6@s",
		paddingHorizontal: "3@s",
	},
});