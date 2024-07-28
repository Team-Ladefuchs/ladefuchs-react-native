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
import { SearchInput } from "../components/shared/searchInput";

const ALPHABET = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(65 + i),
);

export function OperatorListScreen(): JSX.Element {
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

	const filteredOperators = useMemo(() => {
		return (
			allOperatorsQuery.data?.filter((operator) =>
				operator.name.toLowerCase().includes(search.toLowerCase()),
			) ?? []
		);
	}, [search, allOperatorsQuery.data]);

	if (!allOperatorsQuery.data) {
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
						containerStyle={styles.listItemContainer}
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
			<SearchInput
				setSearch={setSearch}
				placeHolder="Search by title..."
			/>
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
		backgroundColor: colors.ladefuchsLightBackground,
	},
	listItemContainer: {
		paddingVertical: "10@s",
		paddingLeft: "14@s",
		paddingRight: "12@s",
		display: "flex",
		gap: "6@s",
	},

	listContainer: {
		marginHorizontal: "16@s",
		flex: 2,
	},
	itemBody: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 2,
	},
	itemText: {
		flex: 2,
		fontSize: "16@s",
		fontWeight: "bold",
	},
});
