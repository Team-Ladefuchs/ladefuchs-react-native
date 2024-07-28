import React from "react";
import { SafeAreaView, TextInput } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../../theme";

interface Props {
	setSearch: (value: string) => void;
	placeHolder: string;
}

export function SearchInput({ setSearch, placeHolder }: Props): JSX.Element {
	return (
		<SafeAreaView style={styles.searchContainer}>
			<TextInput
				style={styles.searchInput}
				autoCorrect={false}
				autoComplete="off"
				clearButtonMode="while-editing"
				placeholder={placeHolder}
				onChangeText={setSearch}
			/>
		</SafeAreaView>
	);
}

const styles = ScaledSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.ladefuchsLightBackground,
	},
	searchContainer: {
		backgroundColor: colors.ladefuchsDarkBackground,
	},
	searchInput: {
		borderColor: "#ccc",
		borderWidth: 1,
		paddingHorizontal: "10@s",
		paddingVertical: "10@s",
		backgroundColor: "#fff",
		borderRadius: "8@s",
		marginVertical: "10@s",
		fontSize: "15@s",
		marginHorizontal: "16@s",
	},
});
