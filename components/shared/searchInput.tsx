import React, { type JSX } from "react";
import { Keyboard, TextInput, View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { colors } from "@theme";

import MagnifyingGlass from "@assets/generic/magnifyingglass.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { useKeyBoard } from "../../hooks/useKeyboard";

interface Props {
	onChange: (value: string) => void;
	placeHolder: string;
}

export function SearchInput({ onChange, placeHolder }: Props): JSX.Element {
	const keyboardIsVisble = useKeyBoard();

	const safeAreaStyle = keyboardIsVisble ? { paddingBottom: -scale(20) } : {};

	return (
		<SafeAreaView
			style={[styles.searchContainer, safeAreaStyle]}
			edges={["right", "bottom", "left"]}
		>
			<View style={styles.iconContainer}>
				{Keyboard.isVisible()}
				<MagnifyingGlass width={scale(21)} height={scale(21)} />
			</View>
			<TextInput
				style={[styles.searchInput]}
				autoCorrect={false}
				keyboardType="ascii-capable"
				returnKeyType="search"
				autoComplete="off"
				clearButtonMode="always"
				textContentType="none"
				placeholderTextColor={"rgba(113, 107, 97, 0.15)"}
				placeholder={placeHolder}
				onChangeText={(text) => onChange(text.trim())}
			/>
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
		fontSize: "16@s",
		fontWeight: "500",
		marginHorizontal: "16@s",
	},
});
