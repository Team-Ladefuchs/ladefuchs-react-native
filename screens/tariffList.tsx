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
import { SectionHeaderList } from "../components/shared/sectionHeaderList";
import { useDebounceInput } from "../hooks/useDebounceInput";
import { colors } from "../theme";
import { SearchInput } from "../components/shared/searchInput";

import { Tariff } from "../types/tariff";
import { fetchAllTariffs } from "../functions/api/tariff";
import { useCustomTariffsOperators } from "../hooks/useCustomTariffsOperators";
import { getMinutes } from "../functions/util";
import { TabButtonGroup, TabItem } from "../components/shared/tabButtonGroup";
import { ListerFilterHeader } from "../components/shared/listFilterHeader";
import { userTariffImage } from "../functions/shared";
import { useAppStore } from "../state/state";
import { useShallow } from "zustand/react/shallow";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { useQueryChargeConditions } from "../hooks/useQueryChargeConditions";

const adHocRegex = /^(ad-hoc|adhoc)$/i;

const itemHeight = scale(61);

type filterType = "all" | "active" | "own";

const tabs = [
	{ key: "all", label: "Alle" },
	{ key: "active", label: "Aktiv" },
	{ key: "own", label: "Eigene" },
] satisfies TabItem<filterType>[];

export function TariffList(): JSX.Element {
	const [search, setSearch] = useDebounceInput();

	const [manuelQueryChargeConditions] = useQueryChargeConditions();

	const { operators } = useAppStore(
		useShallow((state) => ({
			operators: state.operators,
		})),
	);

	const [tariffsAddSet, setTariffsAddSet] = useState<Set<string>>(new Set());
	const [tariffsRemoveSet, setTariffsRemoveSet] = useState<Set<string>>(
		new Set(),
	);

	const [filterMode, setFilterMode] = useState<filterType>("all");

	const { customTariffs, saveCustomTariffs, resetCustomTariffs } =
		useCustomTariffsOperators();

	const navigator = useNavigation();

	useEffect(() => {
		setTariffsAddSet(new Set(customTariffs.add));
		setTariffsRemoveSet(new Set(customTariffs.remove));
	}, [customTariffs]);

	useEffect(() => {
		const unsubscribe = navigator.addListener("beforeRemove", async () => {
			await saveCustomTariffs({
				add: Array.from(tariffsAddSet),
				remove: Array.from(tariffsRemoveSet),
			});
			await manuelQueryChargeConditions.refetch();
		});

		return unsubscribe;
	}, [
		navigator,
		tariffsAddSet,
		tariffsRemoveSet,
		manuelQueryChargeConditions,
		saveCustomTariffs,
	]);

	const allTariffsQuery = useQuery({
		queryKey: ["AllTariffs"],
		retry: 3,
		retryDelay: 100,
		gcTime: getMinutes(20),
		queryFn: async () => {
			const tariffs = await fetchAllTariffs({
				writeCache: !allTariffsQuery.data,
				operators,
			});
			return tariffs.filter((tariff) => !adHocRegex.test(tariff.name));
		},
	});

	const filteredTariffs = useMemo(() => {
		let tariffs = allTariffsQuery.data ?? [];

		if (filterMode === "own") {
			tariffs = tariffs.filter(({ identifier }) => {
				return (
					!tariffsRemoveSet.has(identifier) &&
					tariffsAddSet.has(identifier)
				);
			});
		} else if (filterMode === "active") {
			tariffs = tariffs.filter(({ isStandard, identifier }) => {
				return (
					(isStandard && !tariffsRemoveSet.has(identifier)) ||
					tariffsAddSet.has(identifier)
				);
			});
		}

		return tariffs.filter((tariff) => {
			const term = search.toLowerCase();
			return (
				tariff.name.toLowerCase().includes(term) ||
				tariff.providerName.toLowerCase().includes(term)
			);
		});
	}, [
		search,
		allTariffsQuery.data,
		filterMode,
		tariffsAddSet,
		tariffsRemoveSet,
	]);

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
						setTariffsAddSet(new Set([]));
						setTariffsRemoveSet(new Set([]));
						await resetCustomTariffs();
					},
				},
			],
		);
	};

	const emptyText = useMemo(() => {
		if (filterMode === "own") {
			return "Wenn du unter „Alle“ ein weiteres Häkchen\nvor einem Tarif setzt, findest du ihn hier. ";
		}
		return null;
	}, [filterMode]);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "height" : undefined}
			style={styles.container}
			keyboardVerticalOffset={scale(110)} // Adjust this value as needed
		>
			<ListerFilterHeader onReset={handleTariffReset}>
				<TabButtonGroup
					tabs={tabs}
					onSelected={(item) => {
						setFilterMode(item.key);
					}}
				/>
			</ListerFilterHeader>
			<View style={styles.listContainer}>
				{allTariffsQuery.isLoading ? (
					<LoadingSpinner />
				) : (
					<SectionHeaderList
						disableAnimation={filterMode === "all"}
						estimatedItemSize={itemHeight}
						containerStyle={styles.listItemContainer}
						emptyText={emptyText}
						data={filteredTariffs}
						onUndo={({ identifier, isStandard }: Tariff) => {
							if (isStandard) {
								setTariffsRemoveSet((prevSet) => {
									const newSet = new Set(prevSet);
									newSet.delete(identifier);
									return newSet;
								});
							} else {
								setTariffsAddSet((prevSet) => {
									const newSet = new Set(prevSet);
									newSet.add(identifier);
									return newSet;
								});
							}
						}}
						onRemove={({ isStandard, identifier }: Tariff) => {
							if (isStandard) {
								setTariffsRemoveSet(
									(prev) => new Set([identifier, ...prev]),
								);
							}

							if (tariffsAddSet.has(identifier)) {
								setTariffsAddSet((prevSet) => {
									const newSet = new Set(prevSet);
									newSet.delete(identifier);
									return newSet;
								});
							}
						}}
						onAdd={({ identifier, isStandard }: Tariff) => {
							if (!isStandard) {
								setTariffsAddSet(
									(prev) => new Set([identifier, ...prev]),
								);
							}
							if (tariffsRemoveSet.has(identifier)) {
								setTariffsRemoveSet((prevSet) => {
									const newSet = new Set(prevSet);
									newSet.delete(identifier);
									return newSet;
								});
							}
						}}
						renderItem={(tariff: Tariff) => {
							return (
								<View style={styles.itemBody}>
									<View>
										<CardImage
											imageUrl={
												tariff.imageUrl ??
												userTariffImage
											}
											name={tariff.name}
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
							tariffsAddSet.has(item.identifier) ||
							(item.isStandard &&
								!tariffsRemoveSet.has(item.identifier))
						}
					/>
				)}
			</View>
			<SearchInput onChange={setSearch} placeHolder="Tarif suchen" />
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
		height: itemHeight,
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
