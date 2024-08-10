import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import Swipeable, {
	SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
	SharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";
import { ScaledSheet } from "react-native-size-matters";

import TrashIcon from "@assets/generic/trash.svg";

interface Props {
	onDelete: () => void;
	// isOpen: boolean;
	onOpenAction: () => void;
	disableAction: boolean;
	onCloseAction: () => void;
	children: React.ReactNode;
}

export function SwipeItem({
	onDelete,
	onOpenAction,
	disableAction,
	onCloseAction,
	children,
}: Props): JSX.Element {
	// const swipeableRef = useRef<SwipeableMethods>(null);
	const [width, setWidth] = useState(0);

	// useEffect(() => {
	// 	if (isOpen) {
	// 		console.log("o", isOpen);
	// 		swipeableRef.current?.openRight();
	// 	}
	// }, [isOpen]);

	const renderRightActions = (
		_prog: SharedValue<number>,
		drag: SharedValue<number>,
	) => {
		const styleAnimation = useAnimatedStyle(() => ({
			transform: [{ translateX: drag.value + width }],
		}));

		return (
			<Reanimated.View
				onLayout={(event) => {
					const { width } = event.nativeEvent.layout;
					setWidth(width);
				}}
				style={[styles.rightActionContainer, styleAnimation]}
			>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						onDelete();
					}}
					style={styles.trashIcon}
				>
					<TrashIcon />
				</TouchableOpacity>
			</Reanimated.View>
		);
	};

	if (!disableAction) {
		return <View>{children}</View>;
	}
	return (
		<Swipeable
			renderRightActions={renderRightActions}
			onSwipeableOpen={onOpenAction}
			// friction={2}
			rightThreshold={30}
			onSwipeableClose={onCloseAction}
		>
			{children}
		</Swipeable>
	);
}

const styles = ScaledSheet.create({
	rightActionContainer: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "red",
	},
	trashIcon: {
		padding: "16@s",
		paddingHorizontal: "24@s",
	},
	actionText: {
		fontSize: "16@s",
		color: "#fff",
		fontWeight: "bold",
	},
});
