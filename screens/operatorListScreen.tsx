import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
	View,
	Text,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
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
import { useFocus } from "../hooks/useFocus";
import { useFocusEffect } from "@react-navigation/native";
import { getMinutes, isDebug } from "../functions/util";

export function OperatorListScreen(): JSX.Element {
	const [search, setSearch] = useDebounceInput();
	const { focus } = useFocus();

	const [operatorAddList, setOperatorAddList] = useState<string[]>([]);
	const [operatorRemoveList, setOperatorRemoveList] = useState<string[]>([]);

	const { allChargeConditionsQuery } = useFetchAppData();

	const { customOperators, saveCustomOperators } =
		useCustomTariffsOperators();

	useFocusEffect(
		useCallback(() => {
			const saveSettings = () => {
				saveCustomOperators({
					add: operatorAddList,
					remove: operatorRemoveList,
				}).then(() => {
					if (allChargeConditionsQuery.isFetching) {
						return;
					}
					allChargeConditionsQuery.refetch();
				});
			};
			return () => {
				if (focus && !allChargeConditionsQuery.isFetching) {
					saveSettings();
				}
			};
		}, [operatorAddList, operatorRemoveList]),
	);

	useEffect(() => {
		setOperatorAddList(customOperators.add);
		setOperatorRemoveList(customOperators.remove);
	}, [customOperators, setOperatorAddList, setOperatorRemoveList]);

	useEffect(() => {
		if (isDebug) {
			console.log("Operators", operatorAddList, operatorRemoveList);
		}
	}, [operatorAddList, operatorRemoveList]);

	const allOperatorsQuery = useQuery({
		queryKey: ["AllOperators"],
		gcTime: getMinutes(30),
		retry: 3,
		queryFn: async () => {
			return await fetchOperators({ standard: false });
		},
	});

	const filteredOperators = useMemo(() => {
		return (
			allOperatorsQuery.data?.filter((operator) =>
				operator.name.toLowerCase().includes(search.toLowerCase()),
			) ?? []
		);
	}, [search, allOperatorsQuery.data]);

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
						data={filteredOperators}
						onRemove={(item: Operator) => {
							if (item.isStandard) {
								setOperatorRemoveList([
									item.identifier,
									...operatorRemoveList,
								]);
							} else {
								setOperatorAddList([
									...operatorAddList.filter(
										(id) => id !== item.identifier,
									),
								]);
							}
						}}
						onAdd={(item: Operator) => {
							if (item.isStandard) {
								setOperatorRemoveList([
									...operatorRemoveList.filter(
										(id) => id !== item.identifier,
									),
								]);
							} else {
								setOperatorAddList([
									item.identifier,
									...operatorAddList,
								]);
							}
						}}
						renderItem={(item: Operator) => {
							return (
								<View style={styles.itemBody}>
									<OperatorImage
										operator={item}
										height={55}
										width={80}
										hideFallBackText={true}
									/>
									<Text style={styles.itemText}>
										{item.name}
									</Text>
								</View>
							);
						}}
						exists={(item: Operator) =>
							(operatorAddList.includes(item.identifier) ||
								item.isStandard) &&
							!operatorRemoveList.includes(item.identifier)
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
	listItemContainer: {
		paddingVertical: "10@s",
		paddingLeft: "14@s",
		// paddingRight: "24@s",
		marginRight: "30@s",
		height: "82@s",
		display: "flex",
		gap: "6@s",
	},

	listContainer: {
		flex: 2,
	},
	itemBody: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 2,
	},
	itemText: {
		flex: 2,
		fontSize: "16@s",
		fontWeight: "bold",
	},
});
