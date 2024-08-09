import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
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
	const [activeTab, setActiveTab] = useState(0);
	const translateX = useRef(new Animated.Value(0)).current;
	const tabWidths = useRef([]);

	const handleTabPress = (item: TabItem<T>, tabIndex: number) => {
		setActiveTab(tabIndex);
		onSelected(item, tabIndex);
		Animated.timing(translateX, {
			toValue: tabWidths.current[tabIndex] * tabIndex,
			useNativeDriver: true,
			delay: 0,
			duration: 210,
		}).start();
	};

	const setTabWidth = (event, tabIndex) => {
		const { width } = event.nativeEvent.layout;
		tabWidths.current[tabIndex] = width;
	};

	return (
		<View style={styles.container}>
			<View style={styles.tabContainer}>
				<Animated.View
					style={[
						styles.animatedBackground,
						{
							width: tabWidths.current[activeTab] || 0,
							transform: [{ translateX }],
						},
					]}
				/>
				{tabs.map((tabItem, index) => (
					<TouchableOpacity
						activeOpacity={0.9}
						style={[
							styles.tab,
							activeTab === index && styles.activeTab,
						]}
						onPress={() => handleTabPress(tabItem, index)}
						onLayout={(event) => setTabWidth(event, index)}
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
		marginHorizontal: "14@s",
	},
	tabContainer: {
		backgroundColor: colors.ladefuchsDarkGrayBackground,
		flexDirection: "row",
		paddingVertical: "3@s",
		paddingHorizontal: "4@s",
		borderRadius: "12@s",
		// opacity: 0.9,
		position: "relative",
	},
	animatedBackground: {
		position: "absolute",
		height: "100%",
		backgroundColor: colors.ladefuchsLightBackground,
		flex: 1,
		borderRadius: "10@s",
		top: "3@s",
		left: "4@s",
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
	activeTab: {
		// backgroundColor: "blue",
	},
	tabText: {
		fontSize: 16,
		opacity: 1,
	},
	activeTabText: {
		fontWeight: "bold",
		// color: colors.ladefuchsOrange,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		fontSize: 24,
	},
});
