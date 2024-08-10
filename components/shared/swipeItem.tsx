import React, { useEffect, useRef } from "react";
import { TouchableOpacity, View } from "react-native";

import { ScaledSheet } from "react-native-size-matters";

import TrashIcon from "@assets/generic/trash.svg";
import { Swipeable } from "react-native-gesture-handler";

interface Props {
	onDelete: () => void;
	isOpen: boolean;
	onOpenAction: () => void;
	disableAction: boolean;
	children: React.ReactNode;
}

export function SwipeItem({
	onDelete,
	onOpenAction,
	disableAction,
	children,
	isOpen,
}: Props): JSX.Element {
	const swipeableRef = useRef<Swipeable>();

	useEffect(() => {
		if (isOpen) {
			swipeableRef.current?.openRight();
		} else {
			swipeableRef.current?.close();
		}
	}, [isOpen]);

	const renderRightActions = () => {
		return (
			<View style={styles.rightActionContainer}>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						onDelete();
					}}
					style={styles.trashIcon}
				>
					<TrashIcon />
				</TouchableOpacity>
			</View>
		);
	};

	if (!disableAction) {
		return <View>{children}</View>;
	}
	return (
		<Swipeable
			ref={swipeableRef}
			renderRightActions={renderRightActions}
			onSwipeableOpen={onOpenAction}
			friction={1}
			rightThreshold={10}
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
