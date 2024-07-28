import React, { useState, useEffect, useMemo } from "react";
import {
	View,
	Text,
	TextInput,
	StatusBar,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchTariffs } from "../functions/api";
import { ScaledSheet, scale } from "react-native-size-matters";
import { CardImage } from "../components/shared/cardImage";

import { retrieveFromStorage } from "../state/storage";
import { SwipeList } from "../components/shared/swipeList";
import { useDebounceInput } from "../hooks/useDebounceInput";
import { colors } from "../theme";

const ALPHABET = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(65 + i),
);

export function MSPView(): JSX.Element {
	const [search, setSearch] = useDebounceInput();

	const [ownTariffs, setOwnCurrentOpenItem] = useState<string[]>([]);

	const handleSearch = (text) => {
		setSearch(text);
	};

	useEffect(() => {
		retrieveFromStorage<string[]>("ownTariffs").then((tariffs) => {
			setOwnCurrentOpenItem(tariffs ?? []);
		});
	}, []);

	useEffect(() => {
		return () => {
			console.log("cia");
		};
	}, []);

	useEffect(() => {
		console.log("ownTariffs", ownTariffs);
	}, [ownTariffs]);

	const allTariffsQuery = useQuery({
		queryKey: ["AllTariffs"],
		retry: 3,
		queryFn: async () => {
			return await fetchTariffs({ standard: false });
		},
	});

	const filteredTariffs = useMemo(() => {
		return (
			allTariffsQuery.data?.filter((tariff) =>
				tariff.name.toLowerCase().includes(search.toLowerCase()),
			) ?? []
		);
	}, [search, allTariffsQuery.data]);

















	if (!allTariffsQuery.data) {
		return <View></View>;
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
			keyboardVerticalOffset={scale(110)} // Adjust this value as needed
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.listContainer}>


				<SwipeList

					data={filteredTariffs}
					onRemove={(item) => {
						setOwnCurrentOpenItem([
							...ownTariffs.filter(
								(id) => id !== item.identifier,
							),
						]);
					}}
					onAdd={(item) => {
						setOwnCurrentOpenItem([item.identifier, ...ownTariffs]);
					}}



					renderItem={(item) => {
						return (
							<View style={styles.itemBody}>
								<CardImage
									tariff={item}
									height={55}
									width={80}
									hideFallBackText={true}
								/>
								<Text style={styles.itemText}>{item.name}</Text>
							</View>
						);
					}}




					exists={(item) => ownTariffs.includes(item.identifier)}
				/>
				</View>
















			</TouchableWithoutFeedback>
			<SafeAreaView style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					autoCorrect={false}
					placeholder="Search by title..."
					onChangeText={setSearch}
				/>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}

const styles = ScaledSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0,
		marginBottom: -10,
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
		marginVertical: "7@s",
		fontSize: "15@s",
		marginHorizontal: "16@s",
	},
	listContainer: {
		marginTop: "16@s",
		marginHorizontal: "16@s",
		flex: 2,
		rowGap: 6,
	},
	itemBody: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingLeft: 15,
		borderRadius: 2,
	},
	itemText: {
		flex: 2,
		fontSize: "16@s",
		fontWeight: "bold",
	},
	title: {
		fontSize: 22,
	},
	alphabetContainer: {
		justifyContent: "center",
		paddingRight: 10,
	},
	letter: {
		fontSize: 15,
		paddingVertical: 2,
		paddingHorizontal: 5,
	},
});
