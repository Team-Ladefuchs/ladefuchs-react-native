import React from "react";

import FavStar from "@assets/favorite/favstern.svg";
import FavStarEmpty from "@assets/favorite/favstern_empty.svg";

import { Pressable } from "react-native";
import { scale } from "react-native-size-matters";
import * as Haptics from "expo-haptics";

interface Props {
	checked: boolean;
	onValueChange: (value: boolean) => void;
	size?: number;
}

export function FavoriteCheckbox({
	checked,
	onValueChange,
	size = scale(26),
}: Props): JSX.Element {
	return (
		<Pressable
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
			{checked ? (
				<FavStar height={size} width={size} style={{ ...dropShadow }} />
			) : (
				<FavStarEmpty
					height={size}
					width={size}
					style={{ opacity: 0.75 }}
				/>
			)}
		</Pressable>
	);
}

const dropShadow = {
	elevation: 4,
	shadowColor: "rgb(70, 130, 180)",
	shadowOffset: {
		width: 0,
		height: 2,
	},
	//shadowOpacity: 0.3,
	shadowRadius: 2,
};

// const styles = ScaledSheet.create({
// 	starText: {
// 		fontSize: "21@s",
// 	},
// });
