import React, { useRef, forwardRef, Ref } from "react";
import { TouchableOpacity, View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import TrashIcon from "@assets/generic/trash.svg";
import Swipeable, {
	SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

interface Props {
	onDelete: () => void;
	disableSwipe: boolean;
	children: React.ReactNode;
}

/* eslint-disable no-unused-expressions */
export const SwipeItem = forwardRef<SwipeableMethods, Props>(
	(
		{ onDelete, children, disableSwipe }: Props,
		ref: Ref<SwipeableMethods>,
	) => {
		const swipeableRef = useRef<SwipeableMethods>(null);

		if (disableSwipe) {
			return <View>{children}</View>;
		}

		const renderRightActions = () => {
			return (
				<View style={styles.rightActionContainer}>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							onDelete();
							swipeableRef.current?.close();
						}}
						style={styles.trashIcon}
					>
						<TrashIcon />
					</TouchableOpacity>
				</View>
			);
		};

		return (
			<Swipeable
				ref={(node) => {
					// swipeableRef.current = node;
					if (typeof ref === "function") {
						ref(node);
					}
				}}
				renderRightActions={renderRightActions}
				friction={2}
				overshootRight={false}
				rightThreshold={30}
			>
				{children}
			</Swipeable>
		);
	},
);

const styles = ScaledSheet.create({
	rightActionContainer: {
		justifyContent: "center",
		backgroundColor: "red",
		alignItems: "flex-end", // Align to end for right-side action
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
