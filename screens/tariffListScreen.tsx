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

//import { retrieveFromStorage } from "../state/storage";
import { SwipeList } from "../components/shared/swipeList";
import { useDebounceInput } from "../hooks/useDebounceInput";
import { colors } from "../theme";
import { SearchInput } from "../components/shared/searchInput";
import {
	readTariffSettings,
	saveTariffSettings,
} from "../functions/storage/tariffsStorage";
import { Tariff } from "../types/tariff";
import { useFetchAppData } from "../hooks/usefetchAppData";

//const adHocRegex = /ad[-]?hoc/i;

export function TariffListScreen(): JSX.Element {
	const [search, setSearch] = useDebounceInput();
	const [tariffAddList, setTariffAddList] = useState<Tariff[]>([]);
	const [tariffRemoveList, setTariffRemoveList] = useState<Tariff[]>(
		[],
	);
	const { allChargeConditionsQuery } = useFetchAppData();


	//const [ownTariffs, setOwnCurrentOpenItem] = useState<string[]>([]);

	useEffect(() => {
		readTariffSettings().then(({ toAdd: add, toRemove: remove }) => {
			setTariffAddList(add ?? []);
			setTariffRemoveList(remove ?? []);
		});
	}, []);

	useEffect(() => {
		const saveSettings = () => {
			// maybe refresh operatorAddList from operator data, so there are not too updated
			saveTariffSettings({
				toAdd: tariffAddList,
				toRemove: tariffRemoveList,
			}).then(() => {
				if (allChargeConditionsQuery.isFetching) {
					return;
				}
				allChargeConditionsQuery.refetch();
			});
		};

		// Save settings when the component unmounts
		return () => {
			saveSettings();
		};
	}, [tariffAddList, tariffRemoveList]); // T

	useEffect(() => {
		console.log("Tariffs", tariffAddList, tariffRemoveList);
	}, [tariffAddList, tariffRemoveList]);

	const allTariffsQuery = useQuery({
		queryKey: ["AllTariffs"],
		retry: 3,
		queryFn: async () => {
			return await fetchTariffs({ standard: false });
		},
	});

	const filteredTariffs= useMemo(() => {
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
						containerStyle={styles.listItemContainer}
						data={filteredTariffs}
						onRemove={(item) => {
							if (item.isStandard) {
								setTariffRemoveList([
									item,
									...tariffRemoveList,
								]);
							} else {
								setTariffAddList([
									...tariffAddList.filter(
										({ identifier }) =>
											identifier !== item.identifier,
									),
								]);
							}
						}}
						onAdd={(item) => {
							if (item.isStandard) {
								setTariffRemoveList([
									...tariffRemoveList.filter(
										({ identifier }) =>
											identifier !== item.identifier,
									),
								]);
							} else {
								setTariffAddList([item, ...tariffAddList]);
							}
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
						exists={(item) =>
							(tariffAddList
								.map(({ identifier }) => identifier)
								.includes(item.identifier) ||
								item.isStandard) &&
							!tariffRemoveList
								.map(({ identifier }) => identifier)
								.includes(item.identifier)
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
