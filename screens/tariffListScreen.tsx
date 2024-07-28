import React, { useState, useEffect, useMemo } from "react";
import {
	View,
	Text,
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
import { SearchInput } from "../components/shared/searchInput";

const adHocRegex = /ad[-]?hoc/i;

export function TariffListScreen(): JSX.Element {
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
			const data = await fetchTariffs({ standard: false });
			return data
				.filter((tariff) => !tariff.isStandard)
				.filter((tariff) => !adHocRegex.test(tariff.name));
		},
	});

	const filteredTariffs = useMemo(() => {
		const tariffs = allTariffsQuery?.data ?? [];

		return tariffs.filter((tariff) =>
			tariff.name.toLowerCase().includes(search.toLowerCase()),
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
						containerStyle={styles.listItemContainer}
						data={filteredTariffs}
						onRemove={(item) => {
							setOwnCurrentOpenItem([
								...ownTariffs.filter(
									(id) => id !== item.identifier,
								),
							]);
						}}
						onAdd={(item) => {
							setOwnCurrentOpenItem([
								item.identifier,
								...ownTariffs,
							]);
						}}
						renderItem={(item) => {
							return (
								<View style={styles.itemBody}>
									<CardImage
										tariff={item}
										width={60}
										hideFallBackText={true}
									/>
									<View
										style={{
											flex: 2,
											marginRight: scale(16),
										}}
									>
										<Text style={styles.tariffText}>
											{item.name}
										</Text>
										<Text style={styles.providerText}>
											{item.providerName}
										</Text>
									</View>
								</View>
							);
						}}
						exists={(item) => ownTariffs.includes(item.identifier)}
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

const styles = ScaledSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.ladefuchsLightBackground,
	},
	listContainer: {
		marginHorizontal: "16@s",
		flex: 2,
	},
	listItemContainer: {
		paddingVertical: "5@s",
		paddingLeft: "12@s",
		paddingRight: "20@s",
		display: "flex",
		height: "86@s",
		gap: "10@s",
	},
	itemBody: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: "10@s",
	},
	tariffText: {
		fontSize: "14@s",
		fontWeight: "bold",
	},
	providerText: {
		color: "#605C54",
		fontSize: "14@s",
	},
	alphabetContainer: {
		justifyContent: "center",
		paddingRight: 10,
	},
});
