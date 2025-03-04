import React from "react";

import FavStar from "@assets/favorite/favstern.svg";
import FavStarEmpty from "@assets/favorite/favstern_empty.svg";

import { Pressable, ViewStyle } from "react-native";
import { scale } from "react-native-size-matters";
import * as Haptics from "expo-haptics";
import { triggerHaptic } from "../../functions/util/haptics";

interface Props {
	checked: boolean;
	onValueChange: (value: boolean) => void;
	size?: number;
	style?: ViewStyle;
}

export function FavoriteCheckbox({
	checked,
	onValueChange,
	style,
	size = 26,
}: Props): JSX.Element {
	const mySize = scale(size);
	return (
		<Pressable
			hitSlop={scale(14)}
			style={style}
			onPress={() => {
				if (!checked) {
					triggerHaptic(Haptics.NotificationFeedbackType.Success);
				}
				onValueChange(!checked);
			}}
		>
			{checked ? (
				<FavStar height={mySize} width={mySize} />
			) : (
				<FavStarEmpty
					height={mySize}
					width={mySize}
					style={{ opacity: 0.65 }}
				/>
			)}
		</Pressable>
	);
}
