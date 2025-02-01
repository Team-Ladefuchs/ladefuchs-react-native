import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
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
import { SectionHeaderList } from "../components/shared/sectionHeaderList";
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
	adHocTariffRegex,
	formatTariffName,
	getMinutes,
} from "../functions/util";
import { ListerFilterHeader } from "../components/shared/listFilterHeader";
import { useAppStore } from "../state/appState";
import { useShallow } from "zustand/react/shallow";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { useQueryChargeConditions } from "../hooks/useQueryChargeConditions";
import i18n from "../translations/translations";

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

const ITEM_HEIGHT = scale(61);
const GC_TIME = getMinutes(12);
const RETRY_DELAY = 100;
const MAX_RETRIES = 3;
const KEYBOARD_OFFSET = scale(110);
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

	useEffect(() => {
		const unsubscribe = navigator.addListener("beforeRemove", async () => {
			if (!isMounted.current) return;

			await saveCustomTariffs({
				add: Array.from(state.tariffsAddSet),
				remove: Array.from(state.tariffsRemoveSet),
				favorite: Array.from(state.favoriteSet),
			} satisfies CustomTariff);
			await queryChargeConditions.refetch();
		});

		return unsubscribe;
	}, [navigator, state, queryChargeConditions, saveCustomTariffs]);

	const allTariffsQuery = useQuery({
		queryKey: ["AllTariffs", operators],
		retry: MAX_RETRIES,
		retryDelay: RETRY_DELAY,
		gcTime: GC_TIME,
		queryFn: async () => {
			if (!operators) return [];

			const tariffs = await fetchAllTariffs({
				writeCache: !allTariffsQuery?.data,
				operators,
			});

			return tariffs
				.map((item) => ({
					...item,
					name: formatTariffName(item),
				}))
				.sort((a, b) => a.name.localeCompare(b.name));
		},
	});

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
				return adHocTariffRegex.test(tariff.name);
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
		return tariffs.filter(
			(tariff) => filterByMode(tariff) && filterBySearch(tariff),
		);
	}, [allTariffsQuery.data, filterByMode, filterBySearch]);

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
			i18n.t("tarifAlert"),
			i18n.t("tarifAlertText"),
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
			return i18n.t("ladetarifeInfo2");
		}
		return null;
	}, [filterMode]);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "height" : undefined}
			style={styles.container}
			keyboardVerticalOffset={KEYBOARD_OFFSET}
		>
			<ListerFilterHeader onReset={handleTariffReset}>
				<MemoizedTariffFilter onFilterChanged={handleFilterChange} />
			</ListerFilterHeader>
			<View style={styles.listContainer}>
				{allTariffsQuery.isLoading ? (
					<MemoizedLoadingSpinner />
				) : (
					<SectionHeaderList
						estimatedItemSize={ITEM_HEIGHT}
						containerStyle={styles.listItemContainer}
						emptyText={emptyText}
						isFavorite={favoriteCheck}
						onFavoiteChange={handleFavoriteChange}
						data={filteredTariffs}
						renderItem={renderTariffItem}
						onUndo={handleUndo}
						onRemove={handleRemove}
						onAdd={handleAdd}
						exists={existsCheck}
					/>
				)}
			</View>
			<MemoizedSearchInput
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
		height: ITEM_HEIGHT,
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
