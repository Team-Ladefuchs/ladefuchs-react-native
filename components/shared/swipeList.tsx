import React, { useState } from "react";
import { FlatList, TouchableWithoutFeedback, View } from "react-native";
import AddCircle from "@assets/addRemove/add_circle_fill.svg";
import RemoveCircle from "@assets/addRemove/remove_circle_fill.svg";
import { ScaledSheet, scale } from "react-native-size-matters";
import { SwipeItem } from "./swipItem";

// Interface for the component props
interface Props<T extends { identifier: string }> {
	data: T[];
	onRemove(item: T): void;
	onAdd(item: T): void;
	renderItem: (item: T) => JSX.Element;
	exists: (item: T) => boolean;
}

export function SwipeList<T extends { identifier: string }>({
	data,
	onRemove,
	onAdd,
	exists,
	renderItem,
}: Props<T>): JSX.Element {
	const [currentOpenItem, setCurrentOpenItem] = useState<T>(null);
	const editButtonSize = scale(21);
	return (
		<FlatList
			contentContainerStyle={{ gap: 2 }}
			data={data}
			renderItem={({ item }) => (
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
							<View style={styles.item}>
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
			)}
			keyExtractor={(item) => item.identifier}
		/>
	);
}

const styles = ScaledSheet.create({
	item: {
		backgroundColor: "#DED7C5", // TODO light gray bg opacity
		paddingVertical: "5@s",
		paddingHorizontal: "14@s",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		height: "80@s",
		gap: 2,
		borderRadius: 2,
	},
	itemText: {
		flex: 2,
		fontSize: "16@s",
		fontWeight: "bold",
	},
});
