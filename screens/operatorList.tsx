import React, { useState, useEffect, useMemo, useRef, JSX } from "react";
import {
	View,
	Text,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from "react-native";

import { useQuery } from "@tanstack/react-query";
import { ScaledSheet, scale } from "react-native-size-matters";
import { OperatorImage } from "../components/shared/operatorImage";

import {
	SectionHeaderList,
	SectionHeaderListRef,
} from "../components/shared/sectionHeaderList";
import { useDebounceInput } from "../hooks/useDebounceInput";
import { colors } from "@theme";
import { SearchInput } from "../components/shared/searchInput";
import { Operator } from "../types/operator";
import { fetchAllOperators } from "../functions/api/operator";
import { useCustomTariffsOperators } from "../hooks/useCustomTariffsOperators";
import { getMinutes, isDebug, keyboardoffset } from "../functions/util";
import { useNavigation } from "@react-navigation/native";
import { TabButtonGroup, TabItem } from "../components/shared/tabButtonGroup";
import { ListerFilterHeader } from "../components/shared/listFilterHeader";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { useQueryChargeConditions } from "../hooks/useQueryChargeConditions";
import i18n from "../translations/translations";

type filerType = "all" | "ownOperators";

const tabs = [
	{ key: "all", label: i18n.t("all") },
	{ key: "ownOperators", label: i18n.t("active") },
] satisfies TabItem<filerType>[];

export function OperatorList(): JSX.Element {
	const [search, setSearch] = useDebounceInput();
	const isMounted = useRef(true);

	const listRef = useRef<SectionHeaderListRef>(null);

	const [operatorAddSet, setOperatorAddSet] = useState<Set<string>>(
		new Set(),
	);
	const [operatorRemoveSet, setOperatorRemoveSet] = useState<Set<string>>(
		new Set(),
	);
	const [filterMode, setFilterMode] = useState<filerType>("all");

	const [manuelQueryChargeConditions] = useQueryChargeConditions();
	const { customOperators, saveCustomOperators, resetCustomOperators } =
		useCustomTariffsOperators();
	const navigator = useNavigation();

	useEffect(() => {
		setOperatorAddSet(new Set(customOperators.add));
		setOperatorRemoveSet(new Set(customOperators.remove));
	}, [customOperators]);

	const allOperatorsQuery = useQuery({
		queryKey: ["AllOperators"],
		gcTime: getMinutes(12),
		retry: 3,
		queryFn: async () => {
			return await fetchAllOperators({
				writeCache: !manuelQueryChargeConditions.data,
			});
		},
	});

	const filteredOperators = useMemo(() => {
		let operators = allOperatorsQuery.data ?? [];
		if (search) {
			listRef.current?.scrollToTop();
		}
		if (filterMode === "ownOperators") {
			operators = operators.filter(({ isStandard, identifier }) => {
				return (
					(isStandard && !operatorRemoveSet.has(identifier)) ||
					operatorAddSet.has(identifier)
				);
			});
		}
		return (
			operators.filter((operator) =>
				operator.name.toLowerCase().includes(search.toLowerCase()),
			) ?? []
		);
	}, [
		search,
		allOperatorsQuery.data,
		filterMode,
		operatorAddSet,
		operatorRemoveSet,
	]);

	useEffect(() => {
		const unsubscribe = navigator.addListener("beforeRemove", async () => {
			if (!isMounted.current || !allOperatorsQuery.data) {
				return;
			}

			try {
				const allOperatorIds = new Set(
					allOperatorsQuery.data.map((item) => item.identifier),
				);
				const filterValidIds = (ids: Set<string>) =>
					Array.from(ids).filter((id) => allOperatorIds.has(id));
				await saveCustomOperators({
					add: filterValidIds(operatorAddSet),
					remove: filterValidIds(operatorRemoveSet),
				});
				await manuelQueryChargeConditions.refetch();
			} catch (error) {
				console.error("Error saving custom operators:", error);
			}
		});

		return () => {
			unsubscribe();
		};
	}, [
		navigator,
		operatorAddSet,
		operatorRemoveSet,
		manuelQueryChargeConditions,
		saveCustomOperators,
		allOperatorsQuery.data,
	]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleOperatorReset = () => {
		Alert.alert(i18n.t("operatorAlert"), i18n.t("operatorAlertText"), [
			{ text: i18n.t("cancel"), style: "cancel" },
			{
				text: i18n.t("yes"),
				onPress: async () => {
					setOperatorAddSet(new Set([]));
					setOperatorRemoveSet(new Set([]));
					await resetCustomOperators();
				},
			},
		]);
	};

	useEffect(() => {
		if (isDebug) {
			console.log("[debug] operatorAddSet", operatorAddSet);
			console.log("[debug] operatorRemoveSet", operatorRemoveSet);
		}
	}, [operatorAddSet, operatorRemoveSet]);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "height" : "padding"}
			style={styles.container}
			keyboardVerticalOffset={keyboardoffset()} // Adjust this value as needed
		>
			<ListerFilterHeader onReset={handleOperatorReset}>
				<TabButtonGroup
					tabs={tabs}
					onSelected={(item) => {
						setFilterMode(item.key);
					}}
				/>
			</ListerFilterHeader>

			<View style={styles.listContainer}>
				{allOperatorsQuery.isLoading ? (
					<LoadingSpinner />
				) : (
					<SectionHeaderList
						ref={listRef}
						containerStyle={styles.listItemContainer}
						data={filteredOperators}
						onUndo={({ identifier, isStandard }: Operator) => {
							if (isStandard) {
								setOperatorRemoveSet((prevSet) => {
									const newSet = new Set(prevSet);
									newSet.delete(identifier);
									return newSet;
								});
							} else {
								setOperatorAddSet((prevSet) => {
									const newSet = new Set(prevSet);
									newSet.add(identifier);
									return newSet;
								});
							}
						}}
						onRemove={({ isStandard, identifier }: Operator) => {
							if (isStandard) {
								setOperatorRemoveSet(
									(prev) => new Set([identifier, ...prev]),
								);
							}

							if (operatorAddSet.has(identifier)) {
								setOperatorAddSet((prev) => {
									const newSet = new Set(prev);
									newSet.delete(identifier);
									return newSet;
								});
							}
						}}
						onAdd={({ identifier, isStandard }: Operator) => {
							if (!isStandard) {
								setOperatorAddSet(
									(prev) => new Set([identifier, ...prev]),
								);
							}
							if (operatorRemoveSet.has(identifier)) {
								setOperatorRemoveSet((prev) => {
									const newSet = new Set(prev);
									newSet.delete(identifier);
									return newSet;
								});
							}
						}}
						renderItem={(operator: Operator) => {
							return (
								<View style={styles.itemBody}>
									<OperatorImage
										imageUrl={operator.imageUrl}
										name={operator.name}
										height={50}
										width={72}
										hideFallBackText={true}
									/>
									<Text
										style={styles.itemText}
										numberOfLines={2}
									>
										{operator.name}
									</Text>
								</View>
							);
						}}
						exists={(item: Operator) =>
							(operatorAddSet.has(item.identifier) ||
								item.isStandard) &&
							!operatorRemoveSet.has(item.identifier)
						}
					/>
				)}
			</View>
			<SearchInput
				onChange={setSearch}
				placeHolder={i18n.t("operatorSearch")}
			/>
		</KeyboardAvoidingView>
	);
}

const styles = ScaledSheet.create({
	container: { flex: 1, backgroundColor: colors.ladefuchsLightBackground },
	listItemContainer: {
		paddingVertical: "10@s",
		paddingLeft: "14@s",
		paddingRight: "36@s",
		height: "66@s",
		display: "flex",
		gap: "6@s",
	},

	listContainer: { flex: 2 },
	itemBody: {
		flexDirection: "row",
		alignItems: "center",
		gap: 2,
		width: "94%",
		marginLeft: scale(-6),
	},
	itemText: { flex: 2, fontSize: "13@s", fontWeight: "bold" },
});
