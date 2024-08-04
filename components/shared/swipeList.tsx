import React, { useState, forwardRef, useMemo } from "react";
import {
	SectionList,
	StyleProp,
	TouchableWithoutFeedback,
	View,
	Text,
	ViewStyle,
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
}

interface Section<T> {
	title: string;
	data: T[];
}

const isDigit = /[0-9]/;

export const SwipeList = forwardRef(
	<T extends { identifier: string; name: string }>(
		{ data, onRemove, onAdd, exists, renderItem, containerStyle }: Props<T>,
		ref: React.Ref<any>,
	) => {
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
			length: scale(86), // Adjust this to the actual item height
			offset: scale(86) * index,
			index,
		});

		return (
			<SectionList
				ref={ref}
				// contentContainerStyle={styles.listContainer}
				sections={sections}
				ItemSeparatorComponent={() => (
					<View style={styles.itemSeparator} />
				)}
				renderSectionHeader={({ section: { title } }) => (
					<View style={styles.separatorHeaderContainer}>
						<Text style={styles.separatorHeader}>{title}</Text>
					</View>
				)}
				initialNumToRender={30}
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
	separatorHeaderContainer: {
		borderTopColor: colors.ladefuchsDarkGrayBackground,
		borderTopWidth: "2@s",
		opacity: 0.9,
		backgroundColor: colors.ladefuchsDunklerBalken,
	},
	separatorHeader: {
		fontWeight: "bold",
		paddingHorizontal: "18@s",
		paddingVertical: "4@s",
		fontSize: "16@s",
		color: "#66625A",
	},
	itemSeparator: {
		height: scale(1.5),
		backgroundColor: colors.ladefuchsLightGrayBackground,
	},
	item: {
		backgroundColor: colors.ladefuchsLightBackground,
		flexDirection: "row",
		alignItems: "center",
	},
	firstItemBorder: {
		// borderTopStartRadius: "8@s",
		// borderTopEndRadius: "8@s",
	},
	firstItem: {
		// marginTop: "18@s",
	},
	lastItemBorder: {
		// borderBottomStartRadius: "8@s",
		// borderBottomEndRadius: "8@s",
	},
	lastItem: {
		marginBottom: "20@s",
	},
});
