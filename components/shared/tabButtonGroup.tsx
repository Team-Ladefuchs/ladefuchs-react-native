import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Animated,
	Platform,
	Dimensions,
} from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { colors } from "../../theme";

export interface TabItem<T> {
	key: T;
	label: string;
}

interface Props<T> {
	tabs: TabItem<T>[];
	onSelected: (value: TabItem<T>, index: number) => void;
}

export function TabButtonGroup<T>({ tabs, onSelected }: Props<T>) {
	const [ready, setReady] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
	const translateX = useRef(new Animated.Value(0)).current;
	const containerWidth = useRef<number>(
		Dimensions.get("window").width - scale(4),
	);
	const tabWidth = containerWidth.current / tabs.length;

	const handleTabPress = (item: TabItem<T>, tabIndex: number) => {
		setActiveTab(tabIndex);
		onSelected(item, tabIndex);
		Animated.timing(translateX, {
			toValue: tabWidth * tabIndex,
			useNativeDriver: true,
			delay: 0,
			duration: 210,
		}).start();
	};

	return (
		<View style={styles.container}>
			<View
				style={styles.tabContainer}
				onLayout={(event) => {
					containerWidth.current =
						event.nativeEvent.layout.width - scale(6);
				}}
			>
				<Animated.View
					style={[
						styles.animatedBackground,
						{
							width: tabWidth,
							transform: [{ translateX }],
						},
					]}
				/>
				{tabs.map((tabItem, index) => (
					<TouchableOpacity
						activeOpacity={0.9}
						hitSlop={scale(10)}
						style={[styles.tab, { width: tabWidth }]} // Apply equal width
						onPress={() => handleTabPress(tabItem, index)}
						key={index}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === index && styles.activeTabText,
							]}
						>
							{tabItem.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}

const styles = ScaledSheet.create({
	container: {
		justifyContent: "center",
	},
	tabContainer: {
		backgroundColor: colors.ladefuchsDarkGrayBackground,
		flexDirection: "row",
		paddingVertical: "3@s",
		paddingLeft: "2@s",
		borderRadius: "12@s",
		paddingRight: "2@s",
		justifyContent: "center",
		position: "relative",
	},
	animatedBackground: {
		position: "absolute",
		height: "100%",
		backgroundColor: colors.ladefuchsLightBackground,
		borderRadius: "10@s",
		top: "3@s",
		left: "3@s",
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.2,
				shadowRadius: 2,
			},
			android: {
				elevation: 2,
			},
		}),
	},
	tab: {
		alignItems: "center",
		flex: 1,
		paddingVertical: "6@s",
	},
	tabText: {
		fontSize: 16,
		opacity: 1,
	},
	activeTabText: {
		fontWeight: "bold",
	},
});
