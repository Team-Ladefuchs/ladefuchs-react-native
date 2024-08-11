import React, { useState, useEffect, useMemo } from "react";
import {
	View,
	Text,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
	Alert,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ScaledSheet, scale } from "react-native-size-matters";
import { OperatorImage } from "../components/shared/operatorImage";

import { SwipeList } from "../components/shared/swipeList";
import { useDebounceInput } from "../hooks/useDebounceInput";
import { colors } from "../theme";
import { SearchInput } from "../components/shared/searchInput";
import { Operator } from "../types/operator";
import { useFetchAppData } from "../hooks/usefetchAppData";
import { fetchOperators } from "../functions/api/operator";
import { useCustomTariffsOperators } from "../hooks/useCustomTariffsOperators";
import { getMinutes, isDebug } from "../functions/util";
import { useNavigation } from "@react-navigation/native";
import { TabButtonGroup, TabItem } from "../components/shared/tabButtonGroup";
import { ListerFilerHeader } from "./listFilerHeader";

type filerType = "all" | "ownOperators";

const tabs = [
	{ key: "all", label: "Alle" },
	{ key: "ownOperators", label: "Meine Anbieter" },
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

	const { allChargeConditionsQuery } = useFetchAppData();
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
	}, [navigator, operatorAddSet, operatorRemoveSet]);

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
			operators = operators.filter(
				(operator) =>
					(operator.isStandard &&
						!operatorRemoveSet.has(operator.identifier)) ||
					operatorAddSet.has(operator.identifier),
			);
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

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "height" : undefined}
			style={styles.container}
			keyboardVerticalOffset={scale(110)} // Adjust this value as needed
		>
			<ListerFilerHeader onReset={handleOperatorReset}>
				<TabButtonGroup
					tabs={tabs}
					onSelected={(item) => {
						setFilterMode(item.key);
					}}
				/>
			</ListerFilerHeader>

			<View style={styles.listContainer}>
				<SwipeList
					estimatedItemSize={250}
					containerStyle={styles.listItemContainer}
					data={filteredOperators}
					onRemove={(operator: Operator) => {
						if (operator.isStandard) {
							setOperatorRemoveSet(
								(prev) =>
									new Set([operator.identifier, ...prev]),
							);
						} else {
							setOperatorAddSet((prev) => {
								const newSet = new Set(prev);
								newSet.delete(operator.identifier);
								return newSet;
							});
						}
					}}
					onAdd={(item: Operator) => {
						if (item.isStandard) {
							setOperatorRemoveSet((prev) => {
								const newSet = new Set(prev);
								newSet.delete(item.identifier);
								return newSet;
							});
						} else {
							setOperatorAddSet(
								(prev) => new Set([item.identifier, ...prev]),
							);
						}
					}}
					renderItem={(item: Operator) => {
						return (
							<View style={styles.itemBody}>
								<OperatorImage
									operator={item}
									height={50}
									width={72}
									hideFallBackText={true}
								/>
								<Text style={styles.itemText} numberOfLines={2}>
									{item.name}
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
			<SearchInput setSearch={setSearch} placeHolder="Suche" />
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
		height: `66@s`,
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
