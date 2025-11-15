import React, { type JSX, useState } from "react";
import { Keyboard, TextInput, View, useColorScheme, TouchableOpacity, Platform } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { colors } from "@theme";
import Svg, { Path, Circle } from "react-native-svg";

import MagnifyingGlass from "@assets/generic/magnifyingglass.svg";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
	onChange: (value: string) => void;
	placeHolder: string;
}

export function SearchInput({ onChange, placeHolder }: Props): JSX.Element {
	const colorScheme = useColorScheme();
	const [text, setText] = useState("");
	
	const iconColor = colorScheme === "dark" ? "#FFFFFF" : colors.ladefuchsGrayTextColor;
	// Immer grauer Kreis mit weißem Kreuz für guten Kontrast
	const circleColor = "rgba(142, 142, 147, 0.3)"; // iOS-ähnlicher grauer Kreis
	const crossColor = "#FFFFFF"; // Immer weißes Kreuz

	const handleChangeText = (value: string) => {
		setText(value);
		onChange(value.trim());
	};

	const handleClear = () => {
		setText("");
		onChange("");
	};

	return (
		<SafeAreaView
			style={[styles.searchContainer]}
			edges={["right", "bottom", "left"]}
		>
			<View style={styles.iconContainer}>
				{Keyboard.isVisible()}
				<MagnifyingGlass width={scale(21)} height={scale(21)} color={iconColor} />
			</View>
			<TextInput
				style={[styles.searchInput]}
				autoCorrect={false}
				keyboardType="ascii-capable"
				returnKeyType="search"
				autoComplete="off"
				textContentType="none"
				placeholderTextColor={"rgba(113, 107, 97, 0.15)"}
				placeholder={placeHolder}
				value={text}
				onChangeText={handleChangeText}
			/>
			{text.length > 0 && (
				<TouchableOpacity
					style={styles.clearButton}
					onPress={handleClear}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
					activeOpacity={0.6}
				>
					<Svg width={scale(25)} height={scale(25)} viewBox="0 0 22 22">
						<Circle cx="12" cy="11" r="10" fill={circleColor} />
						<Path
							fill={crossColor}
							d="M8 8L11 11L8 14L9 15L12 12L15 15L16 14L13 11L16 8L15 7L12 10L9 7L8 8Z"
						/>
					</Svg>
				</TouchableOpacity>
			)}
		</SafeAreaView>
	);
}

const styles = ScaledSheet.create({
	iconContainer: {
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		left: "28@s",
		top: "1.5@s",
		height: "100%",
		zIndex: 2,
	},
	searchContainer: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 5,
		position: "relative",
		flex: 0,
		zIndex: 1,
		backgroundColor: colors.ladefuchsDarkBackground,
	},
	searchInput: {
		borderColor: "#ccc",
		borderWidth: 1,
		color: "#000",
		paddingHorizontal: "10@s",
		paddingVertical: "10@s",
		backgroundColor: colors.ladefuchsLightBackground,
		borderRadius: "8@s",
		marginVertical: "10@s",
		paddingLeft: "38@s",
		paddingRight: Platform.OS === "ios" ? "38@s" : "10@s",
		fontSize: "16@s",
		fontWeight: "500",
		marginHorizontal: "16@s",
	},
	clearButton: {
		position: "absolute",
		right: "28@s",
		top: "1.5@s",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 3,
	},
});