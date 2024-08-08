import React, { useState, forwardRef, useMemo } from "react";
import {
	SectionList,
	StyleProp,
	TouchableWithoutFeedback,
	View,
	Text,
	ViewStyle,
	TouchableOpacity,
} from "react-native";
import AddCircle from "@assets/addRemove/add_circle_fill.svg";
import RemoveCircle from "@assets/addRemove/remove_circle_fill.svg";
import { ScaledSheet, scale } from "react-native-size-matters";
import { SwipeItem } from "./swipeItem";
import { colors } from "../../theme";

interface Props<T extends { identifier: string }> {
	data: T[];
	onRemove(item: T): void;
	onAdd(item: T): void;
	renderItem: (item: T) => JSX.Element;
	containerStyle: StyleProp<ViewStyle>;
	exists: (item: T) => boolean;
	itemHeight: number;
}

interface Section<T> {
	title: string;
	data: T[];
}

const isDigit = /[0-9]/;

export function SwipeList<T extends { identifier: string; name: string }>({
	data,
	onRemove,
	onAdd,
	exists,
	renderItem,
	containerStyle,
	itemHeight,
}: Props<T>) {
	const [currentOpenItem, setCurrentOpenItem] = useState<T | null>(null);
	const editButtonSize = scale(22);
	const sections: Section<T>[] = useMemo(() => {
		const sectionMap = data.reduce((acc, item) => {
			let firstLetter = item.name.charAt(0).toUpperCase();
			if (isDigit.test(firstLetter)) {
				firstLetter = "#";
			}
			if (!acc[firstLetter]) {
				acc[firstLetter] = {
					title: firstLetter,
					data: [],
				} satisfies Section<T>;
			}
			acc[firstLetter].data.push(item);
			return acc;
		}, {});

		return Object.values(sectionMap);
	}, [data]);

	// Define the height of each item (assuming all items have the same height)
	const getItemLayout = (_: any, index: number) => ({
		length: scale(itemHeight), // Adjust this to the actual item height
		offset: scale(itemHeight) * index,
		index,
	});

	const renderItemCallback = useMemo(
		() =>
			({ item }) => {
				const itemExist = exists(item);
				return (
					<SwipeItem
						onDelete={() => onRemove(item)}
						disableAction={itemExist}
						onCloseAction={() => setCurrentOpenItem(null)}
						onOpenAction={() => setCurrentOpenItem({ ...item })}
						isOpen={item.identifier === currentOpenItem?.identifier}
						item={
							<TouchableWithoutFeedback
								onPress={() => setCurrentOpenItem(null)}
							>
								<View style={[styles.item, containerStyle]}>
									<TouchableOpacity
										activeOpacity={0.9}
										style={styles.buttonTouchTarget}
										onPress={() =>
											itemExist
												? setCurrentOpenItem(item)
												: onAdd(item)
										}
									>
										{itemExist ? (
											<RemoveCircle
												height={editButtonSize}
												width={editButtonSize}
											/>
										) : (
											<AddCircle
												height={editButtonSize}
												width={editButtonSize}
											/>
										)}
									</TouchableOpacity>
									{renderItem(item)}
								</View>
							</TouchableWithoutFeedback>
						}
					/>
				);
			},
		[sections, currentOpenItem, exists],
	);
	return (
		<View>
			<View style={styles.separatorHeaderContainer} />
			<SectionList
				initialNumToRender={16}
				maxToRenderPerBatch={60}
				windowSize={100}
				stickySectionHeadersEnabled={true}
				sections={sections}
				ListEmptyComponent={() => (
					<Text style={styles.emptyListStyle}>
						Hier gibt es nichts zu sehen 🦊
					</Text>
				)}
				ItemSeparatorComponent={() => (
					<View style={styles.itemSeparator} />
				)}
				renderSectionHeader={({ section: { title } }) => (
					<Text style={styles.separatorHeader}>{title}</Text>
				)}
				getItemLayout={getItemLayout}
				renderItem={renderItemCallback}
				keyExtractor={(item) => item.identifier}
			/>
		</View>
	);
}

const styles = ScaledSheet.create({
	buttonTouchTarget: {
		padding: "7@s",
	},
	separatorHeaderContainer: {
		borderTopColor: colors.ladefuchsDarkGrayBackground,
		borderTopWidth: "2@s",
		opacity: 0.9,
	},
	separatorHeader: {
		fontWeight: "bold",
		paddingHorizontal: "18@s",
		paddingVertical: "4@s",
		fontSize: "16@s",
		color: "#66625A",
		backgroundColor: colors.ladefuchsDunklerBalken,
	},
	itemSeparator: {
		height: scale(1.5),
		backgroundColor: colors.ladefuchsLightGrayBackground,
	},
	emptyListStyle: {
		fontWeight: "bold",
		color: colors.ladefuchsGrayTextColor,
		fontStyle: "italic",
		textAlign: "center",
		fontSize: "15@s",
		marginTop: "38@s",
	},
	item: {
		backgroundColor: colors.ladefuchsLightBackground,
		flexDirection: "row",
		flex: 2,
		alignItems: "center",
	},
	// todo use it
	lastItem: {
		marginBottom: "22@s",
	},
});
