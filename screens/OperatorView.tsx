import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	StatusBar,
	TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchOperators } from "../functions/api";
import { ScaledSheet } from "react-native-size-matters";
import { OperatorImage } from "../components/shared/operatorImage";

import { retrieveFromStorage } from "../state/storage";
import { SwipeList } from "../components/shared/swipeList";

const ALPHABET = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(65 + i),
);

export function CPOView(): JSX.Element {
	const [search, setSearch] = useState("");

	const [ownOperators, setOwnCurrentOpenItem] = useState<string[]>([]);

	const handleSearch = (text) => {
		setSearch(text);
	};

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

	// Filter operators based on search term
	const filteredOperators = allOperatorsQuery.data.filter((operator) =>
		operator.name.toLowerCase().includes(search.toLowerCase()),
	);

	// TODO
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
	return (
		<View style={styles.container}>
			<View style={styles.mainContainer}>
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
								<Text style={styles.itemText}>{item.name}</Text>
							</View>
						);
					}}
					exists={(item) => ownOperators.includes(item.identifier)}
				/>

				{!search && (
					<View style={styles.alphabetContainer}>
						{ALPHABET.map((letter) => (
							<TouchableOpacity
								key={letter}
								// onPress={() => handleAlphabetSearch(letter)}
							>
								{/* <View style={styles.item}>
									<Text style={styles.letter}>{letter}</Text>
								</View> */}
							</TouchableOpacity>
						))}
					</View>
				)}

			<TextInput
				style={styles.searchBar}
				placeholder="Search by title..."
				value={search}
				onChangeText={handleSearch}
			/>
		</View></View>
	);
}

const styles = ScaledSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0,
		backgroundColor: "#F3EEE2",
	},
	searchBar: {
		height: '40@s',
		borderColor: '#ccc',
		borderWidth: 1,
		paddingHorizontal: '10@s',
		borderRadius: '5@s',
		marginVertical: '1@s',
		marginBottom: 40,
	},
	mainContainer: {
		//flexDirection: "row",
		marginHorizontal: 16,
		flex: 1,
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
