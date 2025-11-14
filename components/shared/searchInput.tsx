import React, { type JSX, useState } from "react";
import { Keyboard, TextInput, View, useColorScheme, TouchableOpacity, Platform } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { colors } from "@theme";
import Svg, { Path } from "react-native-svg";

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
	const clearButtonColor = colorScheme === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.5)";

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
					<Svg width={scale(16)} height={scale(16)} viewBox="0 0 320 512">
						<Path
							fill={clearButtonColor}
							d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"
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
