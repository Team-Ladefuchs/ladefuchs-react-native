import React, {
	useState,
	useRef,
	useEffect,
	useMemo,
	useCallback,
} from "react";
import {
	View,
	Text,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
	SectionList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
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
import { useFocus } from "../hooks/useFocus";
import { getMinutes } from "../functions/util";

const adHocRegex = /^(ad-hoc|adhoc)$/i;

export function TariffListScreen(): JSX.Element {
	const [search, setSearch] = useDebounceInput();
	const { focus } = useFocus();

	const { allChargeConditionsQuery } = useFetchAppData();

	const [tariffAddList, setTariffAddList] = useState<string[]>([]);

	const { customTariffs, saveCustomTariffs } = useCustomTariffsOperators();

	useEffect(() => {
		setTariffAddList(customTariffs.add);
	}, [customTariffs]);

	useFocusEffect(
		useCallback(() => {
			const saveSettings = async () => {
				await saveCustomTariffs({
					add: tariffAddList,
					remove: [],
				});
				allChargeConditionsQuery.refetch();
			};
			return () => {
				if (focus && !allChargeConditionsQuery.isFetching) {
					saveSettings();
				}
			};
		}, [tariffAddList]),
	);

	useEffect(() => {
		console.log("Tariffs", tariffAddList);
	}, [tariffAddList]);

	const allTariffsQuery = useQuery({
		queryKey: ["AllTariffs"],
		retry: 3,
		gcTime: getMinutes(30),
		queryFn: async () => {
			const tariffs = await fetchTariffs({ standard: false });
			return tariffs
				.filter((tariff) => !tariff.isStandard)
				.filter((tariff) => !adHocRegex.test(tariff.name));
		},
	});

	const filteredTariffs = useMemo(() => {
		const tariffs = allTariffsQuery.data ?? [];
		return tariffs.filter((tariff) => {
			const term = search.toLowerCase();
			return (
				tariff.name.toLowerCase().includes(term) ||
				tariff.providerName.toLowerCase().includes(term)
			);
		});
	}, [search, allTariffsQuery.data]);

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
						onRemove={(item: Tariff) => {
							setTariffAddList([
								...tariffAddList.filter(
									(id) => id !== item.identifier,
								),
							]);
						}}
						onAdd={(item: Tariff) => {
							setTariffAddList([
								item.identifier,
								...tariffAddList,
							]);
						}}
						renderItem={(item: Tariff) => {
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
						exists={(item: Tariff) =>
							tariffAddList.includes(item.identifier) ||
							item.isStandard
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
	mainContainer: {
		flexDirection: "row",
	},
	listContainer: {
		flex: 2,
		flexDirection: "row",
	},
	listItemContainer: {
		paddingVertical: "5@s",
		paddingLeft: "16@s",
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
});
