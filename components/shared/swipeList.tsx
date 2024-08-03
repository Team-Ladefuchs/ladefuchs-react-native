import React, {
	useState,
	useImperativeHandle,
	forwardRef,
	useRef,
} from "react";
import {
	FlatList,
	StyleProp,
	TouchableWithoutFeedback,
	View,
	ViewStyle,
} from "react-native";
import AddCircle from "@assets/addRemove/add_circle_fill.svg";
import RemoveCircle from "@assets/addRemove/remove_circle_fill.svg";
import { ScaledSheet, scale } from "react-native-size-matters";
import { SwipeItem } from "./swipeItem";

interface Props<T extends { identifier: string }> {
	data: T[];
	onRemove(item: T): void;
	onAdd(item: T): void;
	renderItem: (item: T) => JSX.Element;
	containerStyle: StyleProp<ViewStyle>;
	exists: (item: T) => boolean;
}

export const SwipeList = forwardRef(
	<T extends { identifier: string }>(
		{ data, onRemove, onAdd, exists, renderItem, containerStyle }: Props<T>,
		ref: React.Ref<any>,
	) => {
		const [currentOpenItem, setCurrentOpenItem] = useState<T | null>(null);
		const editButtonSize = scale(22);
		const flatListRef = useRef<FlatList<T> | null>(null);

		useImperativeHandle(ref, () => ({
			scrollToIndex: (index: number) => {
				flatListRef.current?.scrollToIndex({ index, animated: true });
			},
		}));

		// Define the height of each item (assuming all items have the same height)
		const getItemLayout = (_: any, index: number) => ({
			length: scale(86), // Adjust this to the actual item height
			offset: scale(86) * index,
			index,
		});

		return (
			<FlatList
				ref={flatListRef}
				contentContainerStyle={{
					gap: scale(1),
					paddingLeft: scale(12),
					paddingRight: scale(16),
				}}
				data={data}
				initialNumToRender={10}
				getItemLayout={getItemLayout}
				renderItem={({ item, index }) => {
					const isFirst = index === 0;
					const isLast = index === data.length - 1;
					const itemExist = exists(item);
					return (
						<View
							style={[
								isFirst && styles.firstItem,
								isLast && styles.lastItem,
							]}
						>
							<SwipeItem
								onDelete={() => onRemove(item)}
								disableAction={itemExist}
								onCloseAction={() => setCurrentOpenItem(null)}
								onOpenAction={() =>
									setCurrentOpenItem({ ...item })
								}
								isOpen={
									item.identifier ===
									currentOpenItem?.identifier
								}
								item={
									<TouchableWithoutFeedback
										onPress={() => setCurrentOpenItem(null)}
									>
										<View
											style={[
												styles.item,
												containerStyle,
												isFirst &&
													styles.firstItemBorder,
												isLast && styles.lastItemBorder,
											]}
										>
											<View>
												{itemExist ? (
													<RemoveCircle
														height={editButtonSize}
														width={editButtonSize}
														onPress={() =>
															setCurrentOpenItem(
																item,
															)
														}
													/>
												) : (
													<AddCircle
														onPress={() =>
															onAdd(item)
														}
														height={editButtonSize}
														width={editButtonSize}
													/>
												)}
											</View>
											{renderItem(item)}
										</View>
									</TouchableWithoutFeedback>
								}
							/>
						</View>
					);
				}}
				keyExtractor={(item) => item.identifier}
			/>
		);
	},
);

const styles = ScaledSheet.create({
	item: {
		backgroundColor: "#E1D8C7",
		flexDirection: "row",
		alignItems: "center",
	},
	firstItemBorder: {
		borderTopStartRadius: "8@s",
		borderTopEndRadius: "8@s",
	},
	firstItem: {
		marginTop: "18@s",
	},
	lastItemBorder: {
		borderBottomStartRadius: "8@s",
		borderBottomEndRadius: "8@s",
	},
	lastItem: {
		marginBottom: "20@s",
	},
});
