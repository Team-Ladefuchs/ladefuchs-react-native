import React, { useEffect, useRef, forwardRef, Ref } from "react";
import { TouchableOpacity, View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import TrashIcon from "@assets/generic/trash.svg";
import { Swipeable } from "react-native-gesture-handler";

interface Props {
	onDelete: () => void;
	children: React.ReactNode;
}

// Forward ref to the Swipeable component
export const SwipeItem = forwardRef<Swipeable, Props>(
	({ onDelete, children }: Props, ref: Ref<Swipeable>) => {
		const swipeableRef = useRef<Swipeable>(null);

		const renderRightActions = () => {
			return (
				<View style={styles.rightActionContainer}>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							onDelete();
							swipeableRef.current.close();
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
					swipeableRef.current = node;
					if (typeof ref === "function") {
						ref(node);
					}
				}}
				renderRightActions={renderRightActions}
				friction={1}
				rightThreshold={10}
			>
				{children}
			</Swipeable>
		);
	},
);

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
