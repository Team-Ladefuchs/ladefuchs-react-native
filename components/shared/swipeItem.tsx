import React, { useEffect, useRef } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { ScaledSheet } from "react-native-size-matters";

interface Props {
	item: JSX.Element;
	onDelete: () => void;
	isOpen: boolean;
	onOpenAction: () => void;
	disableAction: boolean;
	onCloseAction: () => void;
}

export function SwipeItem({
	item,
	onDelete,
	isOpen,
	onOpenAction,
	disableAction,
	onCloseAction,
}: Props): JSX.Element {
	const swipeableRef = useRef<Swipeable>(null);

	useEffect(() => {
		if (isOpen) {
			swipeableRef.current?.openRight();
		} else {
			swipeableRef.current?.close();
		}
	}, [isOpen, swipeableRef]);

	const renderRightActions = () => (
		<TouchableOpacity
			activeOpacity={1}
			style={styles.rightActionContainer}
			onPress={() => {
				onDelete();
				swipeableRef.current?.close();
			}}
		>
			<Text style={styles.actionText}>Entfernen</Text>
		</TouchableOpacity>
	);

	if (!disableAction) {
		return <View>{item}</View>;
	}
	return (
		<Swipeable
			ref={swipeableRef}
			renderRightActions={renderRightActions}
			onSwipeableOpen={onOpenAction}
			// onSwipeableClose={onCloseAction}
		>
			{item}
		</Swipeable>
	);
}

const styles = ScaledSheet.create({
	rightActionContainer: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "red",
		borderRadius: 2,
		padding: "8@s",
	},
	actionText: {
		fontSize: "16@s",
		color: "#fff",
		fontWeight: "bold",
	},
});
