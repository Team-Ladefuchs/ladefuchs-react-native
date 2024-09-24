import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	StyleProp,
	TouchableWithoutFeedback,
	View,
	Text,
	ViewStyle,
	Keyboard,
	LayoutAnimation,
	TouchableOpacity,
} from "react-native";

import * as Haptics from "expo-haptics";
import { FlashList } from "@shopify/flash-list";

import { ScaledSheet, scale } from "react-native-size-matters";
import { ItemMethods, SectionListItem } from "./sectionListItem";
import { colors } from "../../theme";

import { removeItemByIndex } from "../../functions/util";
import { Checkbox } from "./checkBox";
import { useShakeDetector } from "../../hooks/useShakeDetector";
import i18n from "../../localization";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const alphabet = [
	...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
	"#",
];

interface Props<T extends { identifier: string }> {
	data: T[];
	onRemove(item: T): void;
	onAdd(item: T): void;
	renderItem: (item: T) => JSX.Element;
	containerStyle: StyleProp<ViewStyle>;
	exists: (item: T) => boolean;
	disableAnimation: boolean;
	onUndo: (item: T) => void;
	emptyText?: string | null;
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
	emptyText,
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
		const specialList: (string | T)[] = ["#"];
		const sectionMap = data.reduce(
			(acc, item) => {
				let headerName = item.name.charAt(0).toUpperCase();

				if (!isLetter.test(headerName)) {
					specialList.push(item);
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

		if (!items.length) {
			return [];
		}

		if (specialList.length > 1) {
			return [FAKE_HEADER, ...items, ...specialList];
		}
		return [FAKE_HEADER, ...items];
	}, [data]);

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

	const scrollToLetter = (letter: string) => {
		const index = sections
			.map((item) => item as unknown as string)
			.findIndex((itemLetter) => itemLetter === letter);
		if (index >= 0 && list.current) {
			list.current.scrollToIndex({ animated: true, index: index });
		}
	};

	const onSwipeGesture = ({ nativeEvent }) => {
		if (
			nativeEvent.state === State.ACTIVE ||
			nativeEvent.state === State.END
		) {
			const alphabetHeight = alphabet.length * scale(16);
			const letterHeight = alphabetHeight / alphabet.length;
			const swipePosition = nativeEvent.y;
			const letterIndex = Math.floor(swipePosition / letterHeight);

			if (letterIndex >= 0 && letterIndex < alphabet.length) {
				const letter = alphabet[letterIndex];

				if (letter !== lastScrolledLetter) {
					setLastScrolledLetter(letter);
					scrollToLetter(letter);

					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				}
			}
		}

		if (nativeEvent.state === State.END) {
			setLastScrolledLetter(null);
		}
	};

	const [lastScrolledLetter, setLastScrolledLetter] = useState<string | null>(
		null,
	);

	const renderItemCallback = ({
		item,
		index,
	}: {
		item: T;
		index: number;
	}) => {
		if (typeof item === "string" && item === FAKE_HEADER) {
			return null;
		}

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
									Haptics.notificationAsync(
										Haptics.NotificationFeedbackType
											.Success,
									);
									return !value
										? removeItem(item, index)
										: onAdd(item);
								}
								const currenRef = itemsRef.current[index];
								if (currenRef.opacity() < 1) {
									return currenRef.cancel();
								}
								Haptics.notificationAsync(
									Haptics.NotificationFeedbackType.Success,
								);
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
		<View style={styles.listContainer}>
			<PanGestureHandler onGestureEvent={onSwipeGesture}>
				<View style={styles.alphabetScroll}>
					{alphabet.map((letter) => (
						<TouchableOpacity
							key={letter}
							activeOpacity={0.75}
							onPress={() => scrollToLetter(letter)}
						>
							<Text style={styles.letter}>{letter}</Text>
						</TouchableOpacity>
					))}
				</View>
			</PanGestureHandler>

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
							{emptyText ? emptyText : i18n.t("ladetarifeInfo1")}
						</Text>
					</View>
				)}
				renderItem={renderItemCallback}
			/>
		</View>
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
		marginVertical: "auto",
		height: "250@s",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyListTextStyle: {
		fontStyle: "italic",
		lineHeight: "22@s",
		textAlign: "center",
		fontSize: "15@s",
		fontFamily: "Bitter",
	},
	item: {
		backgroundColor: colors.ladefuchsLightBackground,
		flexDirection: "row",
		flex: 2,
		alignItems: "center",
	},
	listContainer: { display: "flex", flex: 1, position: "relative" },
	alphabetScroll: {
		position: "absolute",
		zIndex: 2,
		right: 0,
		top: "50@s",
		bottom: 0,
		width: "20@s",
	},
	letter: {
		fontSize: "10@s",
		textAlign: "center",
		paddingVertical: "2@s",
		fontFamily: "Bitter",
		fontStyle: "italic",
		color: "black", // todo mk,
	},
});
