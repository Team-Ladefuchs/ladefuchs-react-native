import React, { useMemo, useRef } from "react";
import {
	StyleProp,
	TouchableWithoutFeedback,
	View,
	Text,
	ViewStyle,
	Keyboard,
} from "react-native";

import { FlashList } from "@shopify/flash-list";
// import AddCircle from "@assets/addRemove/add_circle_fill.svg";
// import RemoveCircle from "@assets/addRemove/remove_circle_fill.svg";

import { ScaledSheet, scale } from "react-native-size-matters";
import { SwipeItem } from "./swipeItem";
import { colors } from "../../theme";
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

import { removeItemByIndex } from "../../functions/util";
import { Checkbox } from "./checkBox";

interface Props<T extends { identifier: string }> {
	data: T[];
	onRemove(item: T): void;
	onAdd(item: T): void;
	renderItem: (item: T) => JSX.Element;
	containerStyle: StyleProp<ViewStyle>;
	exists: (item: T) => boolean;
	disableSwipe: boolean;
	estimatedItemSize: number;
}

const isLetter = /[a-zA-Z]/;

export function SwipeList<T extends { identifier: string; name: string }>({
	data,
	onRemove,
	onAdd,
	exists,
	disableSwipe,
	renderItem,
	containerStyle,
	estimatedItemSize,
}: Props<T>) {
	const itemsRef = useRef<SwipeableMethods[]>([]);

	const editButtonSize = scale(22);
	const sections = useMemo(() => {
		const sectionMap = data.reduce(
			(acc, item) => {
				let firstLetter = item.name.charAt(0).toUpperCase();
				if (!isLetter.test(firstLetter)) {
					firstLetter = "#";
				}
				if (!acc[firstLetter]) {
					acc[firstLetter] = [];
					acc[firstLetter].push(firstLetter);
				}
				acc[firstLetter].push(item);
				return acc;
			},
			{} as Record<string, (string | T)[]>,
		);

		return Object.values(sectionMap).flat();
	}, [data]);

	const renderItemCallback = ({
		item,
		index,
	}: {
		item: T;
		index: number;
	}) => {
		if (typeof item === "string") {
			// Rendering header
			return <Text style={styles.separatorHeader}>{item}</Text>;
		}

		const itemExist = exists(item);
		return (
			<SwipeItem
				disableSwipe={!itemExist || disableSwipe}
				ref={(el) => {
					if (el) {
						itemsRef.current[index] = el;
					}
				}}
				onDelete={() => {
					const ref = itemsRef.current[index];
					removeItemByIndex(itemsRef.current, index);
					onRemove(item);
					ref.close();
				}}
			>
				<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
					<View style={[styles.item, containerStyle]}>
						<Checkbox
							value={itemExist}
							onValueChange={(value) => {
								!value ? onRemove(item) : onAdd(item);
							}}
						/>

						{renderItem(item)}
					</View>
				</TouchableWithoutFeedback>
			</SwipeItem>
		);
	};
	return (
		<FlashList
			getItemType={(item) => {
				return typeof item === "string" ? "sectionHeader" : "row";
			}}
			estimatedItemSize={estimatedItemSize}
			ItemSeparatorComponent={SeparatorItem}
			data={sections as T[]}
			keyboardShouldPersistTaps={"handled"}
			stickyHeaderHiddenOnScroll={false}
			automaticallyAdjustKeyboardInsets
			stickyHeaderIndices={
				sections
					.map((item, index) => {
						return typeof item === "string" ? index : null;
					})
					.filter((item) => item !== null) as number[]
			}
			ListEmptyComponent={() => (
				<View style={styles.emptyListStyle}>
					<Text style={styles.emptyListTextStyle}>
						Hier gibt es nichts zu sehen,
					</Text>
					<Text style={styles.emptyListTextStyle}>
						bitte laden Sie weiter. 🦊
					</Text>
				</View>
			)}
			renderItem={renderItemCallback}
		/>
	);
}

function SeparatorItem() {
	return <View style={styles.itemSeparator} />;
}

const styles = ScaledSheet.create({
	buttonTouchTarget: {
		marginRight: "8@s",
	},
	separatorHeaderContainer: {
		borderTopColor: colors.ladefuchsDarkGrayBackground,
		borderTopWidth: "2@s",
	},
	separatorHeader: {
		fontWeight: "bold",
		paddingHorizontal: "18@s",
		paddingVertical: "4@s",
		fontSize: "16@s",
		opacity: 0.95,
		color: "#54524F",
		backgroundColor: colors.ladefuchsDunklerBalken,
	},
	itemSeparator: {
		height: scale(1.5),
		backgroundColor: colors.ladefuchsLightGrayBackground,
	},
	emptyListStyle: {
		color: colors.ladefuchsGrayTextColor,
		marginHorizontal: "16@s",
		marginTop: "38@s",
	},
	emptyListTextStyle: {
		fontStyle: "italic",
		textAlign: "center",
		fontSize: "15@s",
		fontWeight: "bold",
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
