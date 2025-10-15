import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
	JSX,
} from "react";
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
import {
	SectionHeaderList,
	SectionHeaderListRef,
} from "../components/shared/sectionHeaderList";
import { useDebounceInput } from "../hooks/useDebounceInput";
import { colors } from "@theme";
import { SearchInput } from "../components/shared/searchInput";

import { Tariff } from "../types/tariff";
import { fetchAllTariffs } from "../functions/api/tariff";
import {
	CustomTariff,
	useCustomTariffsOperators,
} from "../hooks/useCustomTariffsOperators";
import {
	formatAndNormalizeTariffName,
	getMinutes,
	isDebug,
	keyboardoffset,
} from "../functions/util";
import { ListerFilterHeader } from "../components/shared/listFilterHeader";
import { useAppStore } from "../state/appState";
import { useShallow } from "zustand/react/shallow";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { useQueryChargeConditions } from "../hooks/useQueryChargeConditions";
import i18n from "../translations/translations";
import { Checkbox } from "../components/shared/checkBox";
import { FavoriteCheckbox } from "../components/shared/favoriteCheckbox";

import {
	FilterType,
	TariffFilter,
} from "../components/tariffList/tariffFilter";

interface TariffState {
	tariffsAddSet: Set<string>;
	tariffsRemoveSet: Set<string>;
	favoriteSet: Set<string>;
}

interface TariffItemViewProps {
	tariff: Tariff;
}

interface TextProps {
	style?: any;
	children: React.ReactNode;
	ellipsizeMode?: "head" | "middle" | "tail" | "clip";
	numberOfLines?: number;
}

interface AlertButton {
	text: string;
	style?: "default" | "cancel" | "destructive";
	onPress?: () => void;
}

const GC_TIME = isDebug ? 0 : getMinutes(12);
const RETRY_DELAY = 100;
const MAX_RETRIES = 3;
const IMAGE_WIDTH = 72;

// Memoized Components for better performance
const MemoizedCardImage = React.memo(CardImage);
const MemoizedSearchInput = React.memo(SearchInput);
const MemoizedTariffFilter = React.memo(TariffFilter);
const MemoizedLoadingSpinner = React.memo(LoadingSpinner);

const MemoizedText = React.memo(({ style, children, ...props }: TextProps) => (
	<Text style={style} {...props}>
		{children}
	</Text>
));
MemoizedText.displayName = "MemoizedText";

const TariffItemView = React.memo(({ tariff }: TariffItemViewProps) => (
	<View style={styles.itemBody}>
		<MemoizedCardImage
			imageUrl={tariff.imageUrl}
			name={tariff.name}
			width={IMAGE_WIDTH}
		/>
		<View>
			<MemoizedText
				style={styles.tariffText}
				ellipsizeMode="tail"
				numberOfLines={2}
			>
				{tariff.name}
			</MemoizedText>
			<MemoizedText
				style={styles.providerText}
				ellipsizeMode="tail"
				numberOfLines={1}
			>
				{tariff.providerName}
			</MemoizedText>
		</View>
	</View>
));
TariffItemView.displayName = "TariffItemView";

const ALERT_BUTTONS = (onReset: () => Promise<void>): AlertButton[] => [
	{
		text: i18n.t("cancel"),
		style: "cancel",
	},
	{
		text: i18n.t("yes"),
		onPress: onReset,
	},
];

interface FavoriteChangeParams {
	value: Tariff;
	action: "add" | "remove";
}

export function TariffList(): JSX.Element {
	const isMounted = useRef(true);
	const listRef = useRef<SectionHeaderListRef>(null);

	const [search, setSearch] = useDebounceInput();
	const [filterMode, setFilterMode] = useState<FilterType>("all");

	const [state, setState] = useState<TariffState>(() => ({
		tariffsAddSet: new Set<string>(),
		tariffsRemoveSet: new Set<string>(),
		favoriteSet: new Set<string>(),
	}));

	const { operators } = useAppStore(
		useShallow((state) => ({ operators: state.operators })),
	);

	const [queryChargeConditions] = useQueryChargeConditions();
	const { customTariffs, saveCustomTariffs, resetCustomTariffs } =
		useCustomTariffsOperators();
	const navigator = useNavigation();

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (!isMounted.current) return;

		setState({
			tariffsAddSet: new Set(customTariffs.add),
			tariffsRemoveSet: new Set(customTariffs.remove),
			favoriteSet: new Set(customTariffs.favorite),
		});
	}, [customTariffs]);

	const allTariffsQuery = useQuery({
		queryKey: ["AllTariffs", operators],
		retry: MAX_RETRIES,
		retryDelay: RETRY_DELAY,
		gcTime: GC_TIME,
		queryFn: async () => {
			if (!operators) return [];

			const tariffs = await fetchAllTariffs({
				writeCache: !allTariffsQuery?.data,
			});

			return tariffs
				.map(formatAndNormalizeTariffName)
				.sort((a, b) => a.name.localeCompare(b.name));
		},
	});

	useEffect(() => {
		const unsubscribe = navigator.addListener("beforeRemove", async () => {
			if (!isMounted.current) return;

			if (!allTariffsQuery.data) {
				return;
			}
			const allTarifIds = new Set(
				allTariffsQuery.data.map(({ identifier }) => identifier),
			);
			const filterValidIds = (ids: Set<string>) =>
				Array.from(ids).filter((id) => allTarifIds.has(id));

			await saveCustomTariffs({
				add: filterValidIds(state.tariffsAddSet),
				remove: filterValidIds(state.tariffsRemoveSet),
				favorite: filterValidIds(state.favoriteSet),
			} satisfies CustomTariff);
			await queryChargeConditions.refetch();
		});

		return unsubscribe;
	}, [navigator, state, queryChargeConditions, saveCustomTariffs]);

	const filterByMode = useCallback(
		(tariff: Tariff) => {
			const { identifier, isStandard } = tariff;
			const { tariffsAddSet, tariffsRemoveSet, favoriteSet } = state;

			switch (filterMode) {
				case "activeOrFavorite":
					return (
						!tariffsRemoveSet.has(identifier) &&
						favoriteSet.has(identifier) &&
						(isStandard || tariffsAddSet.has(identifier))
					);
				case "favorite":
					return (
						!tariffsRemoveSet.has(identifier) &&
						favoriteSet.has(identifier)
					);
				case "active":
					return (
						(isStandard && !tariffsRemoveSet.has(identifier)) ||
						tariffsAddSet.has(identifier)
					);
				default:
					return true;
			}
		},
		[filterMode, state],
	);

	const filterBySearch = useCallback(
		(tariff: Tariff) => {
			const searchTerm = search.toLowerCase();

			if (searchTerm.startsWith("adhoc")) {
				return tariff.isAdHoc === true;
			}

			if (search) {
				listRef.current?.scrollToTop();
			}
			return (
				tariff.name.toLowerCase().includes(searchTerm) ||
				tariff.providerName.toLowerCase().includes(searchTerm)
			);
		},
		[search],
	);

	const filteredTariffs = useMemo(() => {
		const tariffs = allTariffsQuery.data ?? [];
		return tariffs
			.filter((tariff) => !tariff.isAdHoc)
			.filter((tariff) => filterByMode(tariff) && filterBySearch(tariff));
	}, [allTariffsQuery.data, filterByMode, filterBySearch]);

	// Build a map for quick lookup and compute Ad-hoc IDs
	const tariffMap = useMemo(() => {
		const map = new Map<string, Tariff>();
		(allTariffsQuery.data ?? []).forEach((t) => map.set(t.identifier, t));
		return map;
	}, [allTariffsQuery.data]);

	const adHocIds = useMemo(() => {
		return (allTariffsQuery.data ?? [])
			.filter((t) => t.isAdHoc)
			.map((t) => t.identifier);
	}, [allTariffsQuery.data]);

	const allAdhocFavorites = useMemo(() => {
		if (adHocIds.length === 0) return false;
		return adHocIds.every((id) => state.favoriteSet.has(id));
	}, [adHocIds, state.favoriteSet]);

	const allAdhocActive = useMemo(() => {
		if (adHocIds.length === 0) return false;
		return adHocIds.every((id) => {
			const t = tariffMap.get(id);
			if (!t) return false;
			return (
				(t.isStandard && !state.tariffsRemoveSet.has(id)) ||
				state.tariffsAddSet.has(id)
			);
		});
	}, [adHocIds, state.tariffsRemoveSet, state.tariffsAddSet, tariffMap]);

	const toggleAdhocFavorites = useCallback(() => {
		setState((prev) => {
			const favoriteSet = new Set(prev.favoriteSet);
			if (allAdhocFavorites) {
				adHocIds.forEach((id) => favoriteSet.delete(id));
			} else {
				adHocIds.forEach((id) => favoriteSet.add(id));
			}
			return { ...prev, favoriteSet };
		});
	}, [allAdhocFavorites, adHocIds]);

	const toggleAdhocActive = useCallback(() => {
		setState((prev) => {
			const tariffsAddSet = new Set(prev.tariffsAddSet);
			const tariffsRemoveSet = new Set(prev.tariffsRemoveSet);
			if (allAdhocActive) {
				// Deactivate all: standard -> ensure in remove; non-standard -> ensure not in add
				adHocIds.forEach((id) => {
					const t = tariffMap.get(id);
					if (!t) return;
					if (t.isStandard) {
						tariffsRemoveSet.add(id);
					} else {
						tariffsAddSet.delete(id);
					}
				});
			} else {
				// Activate all: standard -> ensure not in remove; non-standard -> ensure in add
				adHocIds.forEach((id) => {
					const t = tariffMap.get(id);
					if (!t) return;
					if (t.isStandard) {
						tariffsRemoveSet.delete(id);
					} else {
						tariffsAddSet.add(id);
					}
				});
			}
			return { ...prev, tariffsAddSet, tariffsRemoveSet };
		});
	}, [allAdhocActive, adHocIds, tariffMap]);

	const renderTariffItem = useCallback(
		(tariff: Tariff) => <TariffItemView tariff={tariff} />,
		[],
	);

	const existsCheck = useCallback(
		(item: Tariff) =>
			state.tariffsAddSet.has(item.identifier) ||
			(item.isStandard && !state.tariffsRemoveSet.has(item.identifier)),
		[state],
	);

	const favoriteCheck = useCallback(
		(item: Tariff) => state.favoriteSet.has(item.identifier),
		[state],
	);

	const handleTariffReset = useCallback(() => {
		Alert.alert(
			i18n.t("tariffAlert"),
			i18n.t("tariffAlertText"),
			ALERT_BUTTONS(async () => {
				setState({
					tariffsAddSet: new Set<string>(),
					tariffsRemoveSet: new Set<string>(),
					favoriteSet: new Set<string>(),
				});
				await resetCustomTariffs();
			}),
		);
	}, [resetCustomTariffs]);

	const handleFavoriteChange = useCallback(
		({ value, action }: FavoriteChangeParams) => {
			setState((prevState) => {
				const newSet = new Set(prevState.favoriteSet);
				if (action === "add") {
					newSet.add(value.identifier);
				} else {
					newSet.delete(value.identifier);
				}
				return { ...prevState, favoriteSet: newSet };
			});
		},
		[],
	);

	const handleFilterChange = useCallback((value: FilterType) => {
		setFilterMode(value);
	}, []);

	const handleUndo = useCallback(({ identifier, isStandard }: Tariff) => {
		if (isStandard) {
			setState((prevState) => {
				const newSet = new Set(prevState.tariffsRemoveSet);
				newSet.delete(identifier);
				return { ...prevState, tariffsRemoveSet: newSet };
			});
		} else {
			setState((prevState) => {
				const newSet = new Set(prevState.tariffsAddSet);
				newSet.add(identifier);
				return { ...prevState, tariffsAddSet: newSet };
			});
		}
	}, []);

	const handleRemove = useCallback(
		({ isStandard, identifier }: Tariff) => {
			if (isStandard) {
				setState((prevState) => {
					const newSet = new Set([
						identifier,
						...prevState.tariffsRemoveSet,
					]);
					return { ...prevState, tariffsRemoveSet: newSet };
				});
			}

			if (state.tariffsAddSet.has(identifier)) {
				setState((prevState) => {
					const newSet = new Set(prevState.tariffsAddSet);
					newSet.delete(identifier);
					return { ...prevState, tariffsAddSet: newSet };
				});
			}
		},
		[state.tariffsAddSet],
	);

	const handleAdd = useCallback(
		({ identifier, isStandard }: Tariff) => {
			if (!isStandard) {
				setState((prevState) => {
					const newSet = new Set([
						identifier,
						...prevState.tariffsAddSet,
					]);
					return { ...prevState, tariffsAddSet: newSet };
				});
			}
			if (state.tariffsRemoveSet.has(identifier)) {
				setState((prevState) => {
					const newSet = new Set(prevState.tariffsRemoveSet);
					newSet.delete(identifier);
					return { ...prevState, tariffsRemoveSet: newSet };
				});
			}
		},
		[state.tariffsRemoveSet],
	);

	const emptyText = useMemo(() => {
		if (filterMode === "favorite") {
			return i18n.t("chargingTariffsInfo2");
		}
		return null;
	}, [filterMode]);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "height" : "padding"}
			style={styles.container}
			keyboardVerticalOffset={keyboardoffset()}
		>
			<ListerFilterHeader onReset={handleTariffReset}>
				<MemoizedTariffFilter onFilterChanged={handleFilterChange} />
			</ListerFilterHeader>
			<View style={styles.listContainer}>
				{allTariffsQuery.isLoading ? (
					<MemoizedLoadingSpinner />
				) : (
					<SectionHeaderList
						containerStyle={styles.listItemContainer}
						emptyText={emptyText}
						isFavorite={favoriteCheck}
						onFavoiteChange={handleFavoriteChange}
						data={filteredTariffs}
						renderItem={renderTariffItem}
						onUndo={handleUndo}
						onRemove={handleRemove}
						ref={listRef}
						onAdd={handleAdd}
						exists={existsCheck}
						ListHeaderComponent={
							search ? undefined : (
								<View
									style={[
										styles.headerRow,
										styles.listItemContainer,
									]}
								>
									<Checkbox
										checked={allAdhocActive}
										onValueChange={toggleAdhocActive}
									/>
									<View style={styles.headerFavoriteCheckbox}>
										<FavoriteCheckbox
											size={34}
											checked={allAdhocFavorites}
											onValueChange={toggleAdhocFavorites}
										/>
									</View>
									<View style={styles.itemBody}>
										<MemoizedCardImage
											imageUrl={require("@assets/generic/allAdhoc.jpg")}
											name={i18n.t("adHocPay", {
												defaultValue:
													"Kreditkarte, Girokarte, etc.",
											})}
											width={IMAGE_WIDTH}
											hideFallBackText={false}
										/>

										<View>
											<MemoizedText
												style={styles.tariffText}
												ellipsizeMode="tail"
												numberOfLines={2}
											>
												{i18n.t("allAdHocTariffs", {
													defaultValue:
														"ALLE AD-HOC Tarife",
												})}
											</MemoizedText>
											<MemoizedText
												style={styles.providerText}
												ellipsizeMode="tail"
												numberOfLines={1}
											>
												{i18n.t("adHocPay", {
													defaultValue:
														"Kreditkarte, Girokarte, etc.",
												})}
											</MemoizedText>
										</View>
									</View>
								</View>
							)
						}
					/>
				)}
			</View>
			<MemoizedSearchInput
				onChange={setSearch}
				placeHolder={i18n.t("tariffSearch")}
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
		height: "61@s",
		gap: "5@s",
	},
	headerItem: {
		paddingHorizontal: "16@s",
		paddingVertical: "8@s",
		backgroundColor: colors.ladefuchsLightBackground,
	},
	headerRow: {
		backgroundColor: colors.ladefuchsLightBackground,
		flexDirection: "row",
		display: "flex",
		marginRight: "13@s",
		alignItems: "center",
	},
	headerFavoriteCheckbox: {
		marginRight: "3@s",
		marginLeft: "3@s",
		marginBottom: "2@s",
	},
	bulkLeftControls: {
		flexDirection: "row",
		alignItems: "center",
		gap: "10@s",
		marginLeft: "2@s",
		marginRight: "6@s",
	},
	bulkRowContainer: {
		paddingHorizontal: "16@s",
		paddingVertical: "8@s",
		backgroundColor: colors.ladefuchsLightBackground,
	},
	bulkTitle: {
		fontFamily: "RobotoCondensed",
		fontSize: "13@s",
		textTransform: "uppercase",
		color: colors.ladefuchsGrayTextColor,
		marginBottom: "6@s",
	},
	bulkControls: {
		flexDirection: "row",
		gap: "20@s",
		alignItems: "center",
	},
	bulkControl: {
		flexDirection: "row",
		alignItems: "center",
		gap: "8@s",
	},
	bulkLabel: {
		fontFamily: "RobotoCondensed",
		fontSize: "13@s",
		color: colors.ladefuchsGrayTextColor,
	},
	bulkLinkText: {
		color: "#0057FF",
		fontWeight: "600",
		fontSize: "14@s",
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
		fontSize: "13@s",
		fontWeight: "bold",
	},
	providerText: {
		color: "#605C54",
		fontSize: "13@s",
	},
});
