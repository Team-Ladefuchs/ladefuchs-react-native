import React, { useState, useEffect, useMemo } from "react";
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

import { SectionHeaderList } from "../components/shared/sectionHeaderList";
import { useDebounceInput } from "../hooks/useDebounceInput";
import { colors } from "../theme";
import { SearchInput } from "../components/shared/searchInput";
import { Operator } from "../types/operator";
import { fetchOperators } from "../functions/api/operator";
import { useCustomTariffsOperators } from "../hooks/useCustomTariffsOperators";
import { getMinutes, isDebug } from "../functions/util";
import { useNavigation } from "@react-navigation/native";
import { TabButtonGroup, TabItem } from "../components/shared/tabButtonGroup";
import { ListerFilterHeader } from "../components/shared/listFilterHeader";
import { useQueryAppData } from "../hooks/useQueryAppData";
import { genericOperatorImage } from "../functions/shared";

type filerType = "all" | "ownOperators";

const itemHeight = scale(66);

const tabs = [
	{ key: "all", label: "Alle" },
	{ key: "ownOperators", label: "Aktiv" },
] satisfies TabItem<filerType>[];

export function OperatorListScreen(): JSX.Element {
	const [search, setSearch] = useDebounceInput();

	const [operatorAddSet, setOperatorAddSet] = useState<Set<string>>(
		new Set(),
	);
	const [operatorRemoveSet, setOperatorRemoveSet] = useState<Set<string>>(
		new Set(),
	);
	const [filterMode, setFilterMode] = useState<filerType>("all");

	const { allChargeConditionsQuery } = useQueryAppData();
	const { customOperators, saveCustomOperators, resetCustomOperators } =
		useCustomTariffsOperators();
	const navigator = useNavigation();

	useEffect(() => {
		const unsubscribe = navigator.addListener("beforeRemove", async () => {
			await saveCustomOperators({
				add: Array.from(operatorAddSet),
				remove: Array.from(operatorRemoveSet),
			});
			await allChargeConditionsQuery.refetch();
		});

		return unsubscribe;
	}, [
		navigator,
		operatorAddSet,
		operatorRemoveSet,
		allChargeConditionsQuery,
		saveCustomOperators,
	]);

	useEffect(() => {
		setOperatorAddSet(new Set(customOperators.add));
		setOperatorRemoveSet(new Set(customOperators.remove));
	}, [customOperators]);

	const allOperatorsQuery = useQuery({
		queryKey: ["AllOperators"],
		gcTime: getMinutes(30),
		retry: 3,
		queryFn: async () => {
			return await fetchOperators({ standard: false });
		},
	});

	const filteredOperators = useMemo(() => {
		let operators = allOperatorsQuery.data ?? [];

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

	const handleOperatorReset = () => {
		Alert.alert(
			"Anbieter zurücksetzen",
			"Deine Anbieter werden zurückgesetzt. Bist du dir ganz sicher?",
			[
				{
					text: "Abbrechen",
					style: "cancel",
				},
				{
					text: "Ja bin ich",
					onPress: async () => {
						setOperatorAddSet(new Set([]));
						setOperatorRemoveSet(new Set([]));
						await resetCustomOperators();
					},
				},
			],
		);
	};

	useEffect(() => {
		if (isDebug) {
			console.log("[debug] operatorAddSet", operatorAddSet);
			console.log("[debug] operatorRemoveSet", operatorRemoveSet);
		}
	}, [operatorAddSet, operatorRemoveSet]);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "height" : undefined}
			style={styles.container}
			keyboardVerticalOffset={scale(110)} // Adjust this value as needed
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
				<SectionHeaderList
					disableAnimation={true}
					estimatedItemSize={itemHeight}
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
									imageUrl={
										operator.imageUrl ??
										genericOperatorImage
									}
									name={operator.name}
									height={50}
									width={72}
									hideFallBackText={true}
								/>
								<Text style={styles.itemText} numberOfLines={2}>
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
			</View>
			<SearchInput onChange={setSearch} placeHolder="Betreiber suchen" />
		</KeyboardAvoidingView>
	);
}

const styles = ScaledSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.ladefuchsLightBackground,
	},
	listItemContainer: {
		paddingVertical: "10@s",
		paddingLeft: "14@s",
		paddingRight: "36@s",
		height: itemHeight,
		display: "flex",
		gap: "6@s",
	},

	listContainer: {
		flex: 2,
	},
	itemBody: {
		flexDirection: "row",
		alignItems: "center",
		gap: 2,
		width: "94%",
		marginLeft: scale(-6),
	},
	itemText: {
		flex: 2,
		fontSize: "16@s",
		fontWeight: "bold",
	},
});
