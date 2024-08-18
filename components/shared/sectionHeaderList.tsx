import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	StyleProp,
	TouchableWithoutFeedback,
	View,
	Text,
	ViewStyle,
	Keyboard,
	LayoutAnimation,
} from "react-native";

import { FlashList } from "@shopify/flash-list";

import { ScaledSheet, scale } from "react-native-size-matters";
import { ItemMethods, SectionListItem } from "./sectionListItem";
import { colors } from "../../theme";

import { removeItemByIndex } from "../../functions/util";
import { Checkbox } from "./checkBox";
import { useShakeDetector } from "../../hooks/useShakeDetector";

interface Props<T extends { identifier: string }> {
	data: T[];
	onRemove(item: T): void;
	onAdd(item: T): void;
	renderItem: (item: T) => JSX.Element;
	containerStyle: StyleProp<ViewStyle>;
	exists: (item: T) => boolean;
	disableAnimation: boolean;
	onUndo: (item: T) => void;
	estimatedItemSize: number;
}

const isLetter = /[a-zA-Z]/;

const FAKE_HEADER = "FAKE_HEADER";

interface ItemType {
	identifier: string;
	name: string;
	added?: boolean;
}

export function SectionHeaderList<T extends ItemType>({
	data,
	onRemove,
	onAdd,
	exists,
	disableAnimation,
	renderItem,
	containerStyle,
	onUndo,
	estimatedItemSize,
}: Props<T>) {
	const list = useRef<FlashList<any>>(null);
	const itemsRef = useRef<ItemMethods[]>([]);

	const [lastRemovedItem, setLastRemovedItem] = useState<T | null>(null);

	useShakeDetector(() => {
		if (lastRemovedItem) {
			onUndo(lastRemovedItem);
			setLastRemovedItem(null);
		}
	});

	useEffect(() => {
		setLastRemovedItem(null);
	}, [disableAnimation]);

	const sections = useMemo(() => {
		const myList: (ItemType | string)[] = [];
		const sectionMap = data.reduce(
			(acc, item) => {
				let headerName = item.name.charAt(0).toUpperCase();

				if (item.added && !disableAnimation) {
					myList.push(item);
					return acc;
				}
				if (!isLetter.test(headerName)) {
					headerName = "#";
				}
				if (!acc[headerName]) {
					acc[headerName] = [];
					acc[headerName].push(headerName);
				}
				acc[headerName].push(item);
				return acc;
			},
			{} as Record<string, (string | T)[]>,
		);

		const items = Object.values(sectionMap).flat();

		if (myList.length) {
			return [FAKE_HEADER, "MEINE TARIFE", ...myList, ...items];
		}
		return [FAKE_HEADER, ...items];
	}, [data, disableAnimation]);

	const stickyIndices = useMemo(() => {
		return sections
			.map((item, index) => (typeof item === "string" ? index : null))
			.filter((index) => index !== null) as number[];
	}, [sections]);

	const removeItem = (item: T, index: number) => {
		setLastRemovedItem(item);
		removeItemByIndex(itemsRef.current, index);
		onRemove(item);
	};

	const renderItemCallback = ({
		item,
		index,
	}: {
		item: T;
		index: number;
	}) => {
		if (typeof item === "string" && item === FAKE_HEADER) return null;
		if (typeof item === "string") {
			return <Text style={styles.separatorHeader}>{item}</Text>;
		}

		const itemExist = exists(item);
		return (
			<SectionListItem
				disableAnimation={!itemExist || disableAnimation}
				ref={(el) => {
					if (el) {
						itemsRef.current[index] = el;
					}
				}}
				onDelete={() => {
					removeItem(item, index);
					list.current?.prepareForLayoutAnimationRender();
					LayoutAnimation.configureNext(
						LayoutAnimation.Presets.easeInEaseOut,
					);
				}}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						itemsRef.current[index]?.cancel();
						Keyboard.dismiss();
					}}
				>
					<View style={[styles.item, containerStyle]}>
						<Checkbox
							checked={itemExist}
							onValueChange={(value) => {
								if (disableAnimation) {
									return !value
										? removeItem(item, index)
										: onAdd(item);
								}
								return !value
									? itemsRef.current[index]?.fadeOut()
									: onAdd(item);
							}}
						/>

						{renderItem(item)}
					</View>
				</TouchableWithoutFeedback>
			</SectionListItem>
		);
	};
	return (
		<FlashList
			getItemType={(item) => {
				return typeof item === "string" ? "sectionHeader" : "row";
			}}
			ref={list}
			estimatedItemSize={estimatedItemSize}
			ItemSeparatorComponent={SeparatorItem}
			data={sections as T[]}
			keyboardShouldPersistTaps={"handled"}
			stickyHeaderHiddenOnScroll={false}
			automaticallyAdjustKeyboardInsets
			keyExtractor={(item, index) => {
				return typeof item === "string"
					? index.toString() + index
					: item.identifier;
			}}
			stickyHeaderIndices={stickyIndices}
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