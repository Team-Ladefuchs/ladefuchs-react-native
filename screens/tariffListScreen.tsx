import React, { useState, useEffect, useMemo } from "react";
import {
	View,
	Text,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useQuery } from "@tanstack/react-query";
import { ScaledSheet, scale } from "react-native-size-matters";
import { CardImage } from "../components/shared/cardImage";
import { SwipeList } from "../components/shared/swipeList";
import { useDebounceInput } from "../hooks/useDebounceInput";
import { colors } from "../theme";
import { SearchInput } from "../components/shared/searchInput";

import { Tariff } from "../types/tariff";
import { useFetchAppData } from "../hooks/usefetchAppData";
import { fetchTariffs } from "../functions/api/tariff";
import { useCustomTariffsOperators } from "../hooks/useCustomTariffsOperators";
import { getMinutes } from "../functions/util";
import { TabButtonGroup, TabItem } from "../components/shared/tabButtonGroup";
import { ListerFilerHeader } from "./listFilerHeader";

const adHocRegex = /^(ad-hoc|adhoc)$/i;
// 61

type filerType = "all" | "ownTariffs";

const tabs = [
	{ key: "all", label: "Alle" },
	{ key: "ownTariffs", label: "Meine Tarife" },
] satisfies TabItem<filerType>[];

export function TariffListScreen(): JSX.Element {
	const [search, setSearch] = useDebounceInput();

	const { allChargeConditionsQuery } = useFetchAppData();

	const [tariffsAdd, setTariffsAdd] = useState<Set<string>>(new Set());
	const [tariffsRemove, setTariffsRemove] = useState<Set<string>>(new Set());

	const [filterMode, setFilterMode] = useState<filerType>("all");

	const { customTariffs, saveCustomTariffs, resetCustomTariffs } =
		useCustomTariffsOperators();

	const navigator = useNavigation();

	useEffect(() => {
		setTariffsAdd(new Set(customTariffs.add));
		setTariffsRemove(new Set(customTariffs.remove));
	}, [customTariffs]);

	useEffect(() => {
		const unsubscribe = navigator.addListener("beforeRemove", async () => {
			await saveCustomTariffs({
				add: Array.from(tariffsAdd),
				remove: Array.from(tariffsRemove),
			});
			await allChargeConditionsQuery.refetch();
		});

		return unsubscribe;
	}, [navigator, tariffsAdd, tariffsRemove]);

	const allTariffsQuery = useQuery({
		queryKey: ["AllTariffs"],
		retry: 3,
		retryDelay: 100,
		gcTime: getMinutes(30),
		queryFn: async () => {
			const tariffs = await fetchTariffs({ standard: false });
			return tariffs.filter((tariff) => !adHocRegex.test(tariff.name));
		},
	});

	const filteredTariffs = useMemo(() => {
		let tariffs = allTariffsQuery.data ?? [];

		if (filterMode === "ownTariffs") {
			tariffs = tariffs.filter((tariff) =>
				tariffsAdd.has(tariff.identifier),
			);
		}

		return tariffs.filter((tariff) => {
			const term = search.toLowerCase();
			return (
				tariff.name.toLowerCase().includes(term) ||
				tariff.providerName.toLowerCase().includes(term)
			);
		});
	}, [search, allTariffsQuery.data, filterMode, tariffsAdd, tariffsRemove]);

	const handleTariffReset = () => {
		Alert.alert(
			"Tarife zurücksetzen",
			"Deine Tarife werden zurückgesetzt. Bist du dir ganz sicher?",
			[
				{
					text: "Abbrechen",
					style: "cancel",
				},
				{
					text: "Ja bin ich",
					onPress: async () => {
						setTariffsAdd(new Set([]));
						setTariffsRemove(new Set([]));
						await resetCustomTariffs();
					},
				},
			],
		);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "height" : undefined}
			style={styles.container}
			keyboardVerticalOffset={scale(110)} // Adjust this value as needed
		>
			<ListerFilerHeader onReset={handleTariffReset}>
				<TabButtonGroup
					tabs={tabs}
					onSelected={(item) => {
						setFilterMode(item.key);
					}}
				/>
			</ListerFilerHeader>
			<View style={styles.listContainer}>
				<SwipeList
					estimatedItemSize={300}
					containerStyle={styles.listItemContainer}
					data={filteredTariffs}
					onRemove={(tariff: Tariff) => {
						if (tariff.isStandard) {
							setTariffsRemove(
								(prev) => new Set([tariff.identifier, ...prev]),
							);
						} else {
							setTariffsAdd((prevSet) => {
								const newSet = new Set(prevSet);
								newSet.delete(tariff.identifier);
								return newSet;
							});
						}
					}}
					onAdd={(tariff: Tariff) => {
						if (tariff.isStandard) {
							setTariffsRemove((prevSet) => {
								const newSet = new Set(prevSet);
								newSet.delete(tariff.identifier);
								return newSet;
							});
						} else {
							setTariffsAdd(
								(prev) => new Set([tariff.identifier, ...prev]),
							);
						}
					}}
					renderItem={(tariff: Tariff) => {
						return (
							<View style={styles.itemBody}>
								<View>
									<CardImage
										tariff={tariff}
										width={60}
										hideFallBackText={true}
									/>
								</View>
								<View>
									<Text
										style={styles.tariffText}
										ellipsizeMode="tail"
										numberOfLines={2}
									>
										{tariff.name}
									</Text>
									<Text
										style={styles.providerText}
										ellipsizeMode="tail"
										numberOfLines={1}
									>
										{tariff.providerName}
									</Text>
								</View>
							</View>
						);
					}}
					exists={(item: Tariff) =>
						tariffsAdd.has(item.identifier) ||
						(item.isStandard && !tariffsRemove.has(item.identifier))
					}
				/>
			</View>
			<SearchInput setSearch={setSearch} placeHolder="Suche" />
		</KeyboardAvoidingView>
	);
}

const styles = ScaledSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.ladefuchsLightBackground,
	},
	mainContainer: {
		flexDirection: "row",
	},
	listContainer: {
		flex: 2,
	},
	listItemContainer: {
		paddingLeft: "10@s",
		paddingRight: "16@s",
		height: `80@s`,
		gap: "7@s",
	},
	itemBody: {
		flexDirection: "row",
		alignItems: "center",
		gap: "10@s",
		height: "100%",
		width: "90%",
		paddingRight: "90@s",
	},
	tariffText: {
		fontSize: "14@s",
		fontWeight: "bold",
	},
	providerText: {
		color: "#605C54",
		fontSize: "14@s",
	},
});
