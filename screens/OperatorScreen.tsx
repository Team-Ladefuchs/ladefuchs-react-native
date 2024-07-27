import React, { useState, useEffect, useMemo } from "react";
import {
	View,
	Text,
	TextInput,
	StatusBar,
	TouchableOpacity,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchOperators } from "../functions/api";
import { ScaledSheet, scale } from "react-native-size-matters";
import { OperatorImage } from "../components/shared/operatorImage";

import { retrieveFromStorage } from "../state/storage";
import { SwipeList } from "../components/shared/swipeList";
import { useDebounceInput } from "../hooks/useDebounceInput";
import { colors } from "../theme";

const ALPHABET = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(65 + i),
);

export function OperatorScreen(): JSX.Element {
	const [search, setSearch] = useDebounceInput();

	const [ownOperators, setOwnCurrentOpenItem] = useState<string[]>([]);

	useEffect(() => {
		retrieveFromStorage<string[]>("ownOperators").then((operators) => {
			setOwnCurrentOpenItem(operators ?? []);
		});
	}, []);

	useEffect(() => {
		return () => {
			console.log("cia");
		};
	}, []);

	useEffect(() => {
		console.log("ownOperators", ownOperators);
	}, [ownOperators]);

	const allOperatorsQuery = useQuery({
		queryKey: ["AllOperators"],
		retry: 3,
		queryFn: async () => {
			return await fetchOperators({ standard: false });
		},
	});

	if (!allOperatorsQuery.data) {
		return <View></View>;
	}

	const filteredOperators = useMemo(() => {
		return allOperatorsQuery.data.filter((operator) =>
			operator.name.toLowerCase().includes(search.toLowerCase()),
		);
	}, [search, allOperatorsQuery.data]);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
			keyboardVerticalOffset={scale(110)} // Adjust this value as needed
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.listContainer}>
					<SwipeList
						data={filteredOperators}
						onRemove={(item) => {
							setOwnCurrentOpenItem([
								...ownOperators.filter(
									(id) => id !== item.identifier,
								),
							]);
						}}
						onAdd={(item) => {
							setOwnCurrentOpenItem([
								item.identifier,
								...ownOperators,
							]);
						}}
						renderItem={(item) => {
							return (
								<View style={styles.itemBody}>
									<OperatorImage
										operator={item}
										height={55}
										width={80}
										hideFallBackText={true}
									/>
									<Text style={styles.itemText}>
										{item.name}
									</Text>
								</View>
							);
						}}
						exists={(item) =>
							ownOperators.includes(item.identifier)
						}
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

// TODO

// {
// 	!search && (
// 		<View style={styles.alphabetContainer}>
// 			{ALPHABET.map((letter) => (
// 				<TouchableOpacity
// 					key={letter}
// 					// onPress={() => handleAlphabetSearch(letter)}
// 				>
// 					{/* <View style={styles.item}>
// 									<Text style={styles.letter}>{letter}</Text>
// 								</View> */}
// 				</TouchableOpacity>
// 			))}
// 		</View>
// 	);
// }

// const handleAlphabetSearch = (letter) => {
// 	const index = sortedData.findIndex(
// 		(item) => item.title.charAt(0).toUpperCase() === letter,
// 	);
// 	if (index >= 0 && flatListRef.current) {
// 		InteractionManager.runAfterInteractions(() => {
// 			const itemCount = sortedData.length;
// 			if (index >= 0 && index < itemCount) {
// 				flatListRef.current.scrollToIndex({
// 					animated: true,
// 					index,
// 				});
// 			}
// 		});
// 	}
// };

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
		// height: "40@s",
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
		gap: 2,
		borderRadius: 2,
	},
	itemText: {
		flex: 2,
		fontSize: "16@s",
		fontWeight: "bold",
	},
	// title: {
	// 	fontSize: 22,
	// },
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
