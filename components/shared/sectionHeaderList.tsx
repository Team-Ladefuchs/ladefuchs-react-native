import React, { useMemo, useRef, useState } from "react";
import {
	StyleProp,
	TouchableWithoutFeedback,
	View,
	Text,
	ViewStyle,
	Keyboard,
	LayoutAnimation,
	TouchableOpacity,
	Platform,
} from "react-native";

import * as Haptics from "expo-haptics";
import { FlashList } from "@shopify/flash-list";

import { ScaledSheet, scale } from "react-native-size-matters";
import { colors } from "@theme";

import { Checkbox } from "./checkBox";
import { useShakeDetector } from "../../hooks/useShakeDetector";
import i18n from "@translations/translations";
import {
	GestureEvent,
	PanGestureHandler,
	State,
} from "react-native-gesture-handler";
import { FavoriteCheckbox } from "./favoriteCheckbox";
import { useKeyBoard } from "../../hooks/useKeyboard";
import { EmptyListText } from "./emptyListText";
import { triggerHaptic } from "../../functions/util/haptics";

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
	isFavorite?: (item: T) => boolean;
	onFavoiteChange?: ({
		value,
		action,
	}: {
		value: T;
		action: "add" | "remove";
	}) => void;
	onUndo: (item: T) => void;
	emptyText?: string | null;
	estimatedItemSize: number;
}

const isLetter = /[a-zA-Z]/;

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
	renderItem,
	containerStyle,
	onUndo,
	emptyText,
	estimatedItemSize,
	onFavoiteChange,
	isFavorite,
}: Props<T>) {
	const list = useRef<FlashList<any>>(null);

	const [lastRemovedItem, setLastRemovedItem] = useState<T | null>(null);

	const keyboardIsVisble = useKeyBoard();

	useShakeDetector(() => {
		if (lastRemovedItem) {
			onUndo(lastRemovedItem);
			setLastRemovedItem(null);
		}
	});

	const sections = useMemo(() => {
		const specialList: (string | T)[] = ["#"];
		const sectionMap = data.reduce(
			(acc, item) => {
				let headerName = item.name.charAt(0).toUpperCase();

				if (!isLetter.test(headerName)) {
					specialList.push(item);
					return acc;
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
			return [...items, ...specialList];
		}
		return items;
	}, [data]);

	const stickyIndices = useMemo(() => {
		return sections
			.map((item, index) => (typeof item === "string" ? index : null))
			.filter((index) => index !== null) as number[];
	}, [sections]);

	const removeItem = (item: T) => {
		setLastRemovedItem(item);
		onRemove(item);
	};

	const scrollToLetter = (letter: string) => {
		const index = sections
			.map((item) => item as unknown as string)
			.findIndex((itemLetter) => itemLetter === letter);
		if (index >= 0 && list.current) {
			list.current.scrollToIndex({ animated: false, index: index });
			triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
		}
	};

	const onSwipeGesture = ({ nativeEvent }: GestureEvent<any>) => {
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
					triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
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

	const renderItemCallback = ({ item }: { item: T }) => {
		if (typeof item === "string") {
			return <Text style={styles.separatorHeader}>{item}</Text>;
		}

		const itemExist = exists(item);
		return (
			<View>
				<TouchableWithoutFeedback
					onPress={() => {
						Keyboard.dismiss();
					}}
				>
					<View style={[styles.item, containerStyle]}>
						<Checkbox
							checked={itemExist}
							onValueChange={(value) => {
								if (!value) {
									removeItem(item);
									if (Platform.OS === "android") {
										list.current?.prepareForLayoutAnimationRender();
									}
									LayoutAnimation.configureNext(
										LayoutAnimation.Presets.easeInEaseOut,
									);
								} else {
									onAdd(item);
								}
							}}
						/>
						{onFavoiteChange && isFavorite && (
							<View style={styles.favoiteCheckbox}>
								<FavoriteCheckbox
									size={34}
									checked={isFavorite(item)}
									onValueChange={(value) => {
										onFavoiteChange({
											value: item,
											action: value ? "add" : "remove",
										});
									}}
								/>
							</View>
						)}
						{renderItem(item)}
					</View>
				</TouchableWithoutFeedback>
			</View>
		);
	};
	return (
		<View style={styles.listContainer}>
			{sections.length > 0 && !keyboardIsVisble && (
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
			)}

			<FlashList
				getItemType={(item: T) => {
					return typeof item === "string" ? "sectionHeader" : "row";
				}}
				ref={list}
				estimatedItemSize={estimatedItemSize}
				ItemSeparatorComponent={SeparatorItem}
				data={sections as T[]}
				keyboardShouldPersistTaps={"handled"}
				stickyHeaderHiddenOnScroll={false}
				showsVerticalScrollIndicator={false}
				automaticallyAdjustKeyboardInsets
				keyExtractor={(item: T, index: number) => {
					return typeof item === "string"
						? index.toString() + index
						: item.identifier;
				}}
				stickyHeaderIndices={stickyIndices}
				ListEmptyComponent={() => (
					<View style={styles.emptyListStyle}>
						<EmptyListText
							text={
								emptyText
									? emptyText
									: i18n.t("chargingTariffsInfo1")
							}
						/>
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
		height: "240@s",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	item: {
		backgroundColor: colors.ladefuchsLightBackground,
		flexDirection: "row",
		display: "flex",
		marginRight: "13@s",
		alignItems: "center",
	},
	listContainer: {
		display: "flex",
		flex: 1,
		position: "relative",
		marginRight: "2@s",
	},
	alphabetScroll: {
		position: "absolute",
		zIndex: 2,
		right: "-2@s",
		top: "25%",
		opacity: 0.8,
		width: "20@s",
		flex: 2,
	},
	favoiteCheckbox: {
		marginRight: "3@s",
		marginLeft: "3@s",
		marginBottom: "2@s",
	},
	letter: {
		fontSize: "10@s",
		textAlign: "center",
		lineHeight: "11@s",
		fontFamily: "Roboto",
		color: "black",
	},
});
