import React, { useState } from "react";
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
import { SwipeItem } from "./swipItem";

interface Props<T extends { identifier: string }> {
	data: T[];
	onRemove(item: T): void;
	onAdd(item: T): void;
	renderItem: (item: T) => JSX.Element;
	containerStyle: StyleProp<ViewStyle>;
	exists: (item: T) => boolean;
}

export function SwipeList<T extends { identifier: string }>({
	data,
	onRemove,
	onAdd,
	exists,
	renderItem,
	containerStyle,
}: Props<T>): JSX.Element {
	const [currentOpenItem, setCurrentOpenItem] = useState<T>(null);
	const editButtonSize = scale(22);
	return (
		<FlatList
			contentContainerStyle={{ gap: scale(1) }}
			data={data}
			initialNumToRender={10}
			renderItem={({ item, index }) => {
				return (
					<SwipeItem
						onDelete={() => {
							onRemove(item);
						}}
						onCloseAction={() => {
							setCurrentOpenItem(null);
						}}
						onOpenAction={() => {
							setCurrentOpenItem({ ...item });
						}}
						isOpen={item.identifier === currentOpenItem?.identifier}
						item={
							<TouchableWithoutFeedback
								onPress={() => setCurrentOpenItem(null)}
							>
								<View
									style={[
										styles.item,
										containerStyle,
										index === 0 && styles.firstItem,
										index === data.length - 1 &&
											styles.lastItem,
									]}
								>
									<View>
										{exists(item) ? (
											<RemoveCircle
												height={editButtonSize}
												width={editButtonSize}
												onPress={() => {
													setCurrentOpenItem(item);
												}}
											/>
										) : (
											<AddCircle
												onPress={() => {
													onAdd(item);
												}}
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
				);
			}}
			keyExtractor={(item) => item.identifier}
		/>
	);
}

const styles = ScaledSheet.create({
	item: {
		backgroundColor: "#E1D8C7",
		flexDirection: "row",
		alignItems: "center",
	},
	firstItem: {
		borderTopStartRadius: "8@s",
		borderTopEndRadius: "8@s",
		marginTop: "18@s",
	},
	lastItem: {
		borderBottomStartRadius: "8@s",
		borderBottomEndRadius: "8@s",
		marginBottom: "20@s",
	},
});
