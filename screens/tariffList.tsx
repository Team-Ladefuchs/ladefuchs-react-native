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
import {
	CustomTariff,
	useCustomTariffsOperators,
} from "../hooks/useCustomTariffsOperators";
import {
	adHocTariffRegex,
	formatTariffName,
	getMinutes,
} from "../functions/util";
import { ListerFilterHeader } from "../components/shared/listFilterHeader";
import { useAppStore } from "../state/state";
import { useShallow } from "zustand/react/shallow";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { useQueryChargeConditions } from "../hooks/useQueryChargeConditions";
import i18n from "../localization";

import {
	FilterType,
	TariffFilter,
} from "../components/tariffList/tariffFilter";

const itemHeight = scale(61);

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

	const [favoriteSet, setFavoiteSet] = useState<Set<string>>(new Set());

	const [filterMode, setFilterMode] = useState<FilterType>("all");

	const { customTariffs, saveCustomTariffs, resetCustomTariffs } =
		useCustomTariffsOperators();

	const navigator = useNavigation();

	useEffect(() => {
		setTariffsAddSet(new Set(customTariffs.add));
		setTariffsRemoveSet(new Set(customTariffs.remove));
		setFavoiteSet(new Set(customTariffs.favorite));
	}, [customTariffs]);

	useEffect(() => {
		const unsubscribe = navigator.addListener("beforeRemove", async () => {
			await saveCustomTariffs({
				add: Array.from(tariffsAddSet),
				remove: Array.from(tariffsRemoveSet),
				favorite: Array.from(favoriteSet),
			} satisfies CustomTariff);
			await manuelQueryChargeConditions.refetch();
		});

		return unsubscribe;
	}, [
		navigator,
		tariffsAddSet,
		tariffsRemoveSet,
		favoriteSet,
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
			return tariffs
				.map((item) => {
					return {
						...item,
						name: formatTariffName(item),
					};
				})
				.sort((a, b) => a.name.localeCompare(b.name));
		},
	});

	const filteredTariffs = useMemo(() => {
		let tariffs = allTariffsQuery.data ?? [];

		if (filterMode === "activeOrFavorite") {
			tariffs = tariffs.filter(({ identifier, isStandard }) => {
				return (
					!tariffsRemoveSet.has(identifier) &&
					favoriteSet.has(identifier) &&
					(isStandard || tariffsAddSet.has(identifier))
				);
			});
		} else if (filterMode === "favorite") {
			tariffs = tariffs.filter(({ identifier }) => {
				return (
					!tariffsRemoveSet.has(identifier) &&
					favoriteSet.has(identifier)
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
			if (term.startsWith("adhoc")) {
				return adHocTariffRegex.test(tariff.name);
			}
			return (
				tariff.name.toLowerCase().includes(term) ||
				tariff.providerName.toLowerCase().includes(term)
			);
		});
	}, [
		search,
		allTariffsQuery.data,
		filterMode,
		favoriteSet,
		tariffsAddSet,
		tariffsRemoveSet,
	]);

	const handleTariffReset = () => {
		Alert.alert(i18n.t("tarifAlert"), i18n.t("tarifAlertText"), [
			{
				text: i18n.t("cancel"),
				style: "cancel",
			},
			{
				text: i18n.t("yes"),
				onPress: async () => {
					setTariffsAddSet(new Set([]));
					setTariffsRemoveSet(new Set([]));
					await resetCustomTariffs();
				},
			},
		]);
	};

	const emptyText = useMemo(() => {
		if (filterMode === "favorite") {
			return i18n.t("ladetarifeInfo2");
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
				<TariffFilter
					onFilterChanged={(value) => {
						setFilterMode(value);
					}}
				/>
			</ListerFilterHeader>
			<View style={styles.listContainer}>
				{allTariffsQuery.isLoading ? (
					<LoadingSpinner />
				) : (
					<SectionHeaderList
						estimatedItemSize={itemHeight}
						containerStyle={styles.listItemContainer}
						emptyText={emptyText}
						isFavorite={(item: Tariff) =>
							favoriteSet.has(item.identifier)
						}
						onFavoiteChange={({ value, action }) => {
							if (action === "add") {
								setFavoiteSet((prevSet) => {
									const newSet = new Set(prevSet);
									newSet.add(value.identifier);
									return newSet;
								});
							} else {
								setFavoiteSet((prevSet) => {
									const newSet = new Set(prevSet);
									newSet.delete(value.identifier);
									return newSet;
								});
							}
						}}
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
									<CardImage
										imageUrl={tariff.imageUrl}
										name={tariff.name}
										width={72}
									/>
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
			<SearchInput
				onChange={setSearch}
				placeHolder={i18n.t("tarifsuche")}
			/>
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
		paddingLeft: "9@s",
		paddingRight: "28@s",
		height: itemHeight,
		gap: "5@s",
	},
	itemBody: {
		flexDirection: "row",
		alignItems: "center",
		gap: "8@s",
		height: "100%",
		width: "88%",
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
