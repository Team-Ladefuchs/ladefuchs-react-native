import React, { useState, useRef } from "react";
import {
	FlatList,
	View,
	Text,
	TextInput,
	StyleSheet,
	StatusBar,
	TouchableOpacity,
	InteractionManager,
} from "react-native";

const DATA = Array.from({ length: 100 }, (_, i) => ({
	id: (i + 1).toString(),
	title: `${["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-ray", "Yankee", "Zulu"][i % 26]}`,
}));

const sortedData = DATA.sort((a, b) => a.title.localeCompare(b.title));

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Item = ({ title }) => (
	<View style={styles.item}>
		<Text style={styles.title}>{title}</Text>
	</View>
);

export function CPOView(): JSX.Element {
	const [search, setSearch] = useState("");
	const flatListRef = useRef(null);

	const handleSearch = (text) => {
		setSearch(text);
	};

	const handleAlphabetSearch = (letter) => {
		const index = sortedData.findIndex(
			(item) => item.title.charAt(0).toUpperCase() === letter,
		);
		if (index >= 0 && flatListRef.current) {
			InteractionManager.runAfterInteractions(() => {
				const itemCount = sortedData.length;
				if (index >= 0 && index < itemCount) {
					flatListRef.current.scrollToIndex({
						animated: true,
						index,
					});
				}
			});
		}
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" />
			<TextInput
				style={styles.searchBar}
				placeholder="Search by title..."
				value={search}
				onChangeText={handleSearch}
			/>
			<View style={styles.mainContainer}>
				<FlatList
					ref={flatListRef}
					data={sortedData.filter((item) =>
						item.title.toLowerCase().includes(search.toLowerCase()),
					)}
					renderItem={({ item }) => <Item title={item.title} />}
					keyExtractor={(item) => item.id}
				/>
				{!search && (
					<View style={styles.alphabetContainer}>
						{ALPHABET.map((letter) => (
							<TouchableOpacity
								key={letter}
								onPress={() => handleAlphabetSearch(letter)}
							>
								<Text style={styles.letter}>{letter}</Text>
							</TouchableOpacity>
						))}
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0,
		backgroundColor: "#F3EEE2",
	},
	searchBar: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		margin: 10,
	},
	mainContainer: {
		flexDirection: "row",
		flex: 1,
	},
	item: {
		backgroundColor: "#C2B49C",
		padding: 20,
		marginVertical: 2,
		marginHorizontal: 16,
		borderRadius: 12,
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
