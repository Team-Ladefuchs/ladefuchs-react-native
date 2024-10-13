import { useCallback, useState } from "react";
import {
	retrieveFromStorage,
	saveToStorage,
} from "../functions/storage/storage";
import { useFocusEffect } from "@react-navigation/native";
import { useAppStore } from "../state/appState";
import { useShallow } from "zustand/react/shallow";

export interface CustomTariff {
	add: string[];
	remove: string[];
	favorite?: string[]; // this was addded later
}
export interface CustomOperators {
	add: string[];
	remove: string[];
}

// ket userSettings
interface CustomTariffsOperators {
	tariffs: CustomTariff;
	operators: CustomOperators;
}

const emptyCustomSettings = {
	tariffs: {
		add: [],
		remove: [],
		favorite: [],
	},
	operators: {
		add: [],
		remove: [],
	},
} satisfies CustomTariffsOperators;

const key = "customTariffsOperators";

export async function getCustomTariffsOperators(): Promise<CustomTariffsOperators> {
	const values =
		(await retrieveFromStorage<CustomTariffsOperators>(key)) ??
		emptyCustomSettings;

	if (
		values.tariffs.favorite === undefined ||
		values.tariffs.favorite === null
	) {
		values.tariffs.favorite = [];
	}
	return values;
}

export function useCustomTariffsOperators() {
	const [current, setCurrent] =
		useState<CustomTariffsOperators>(emptyCustomSettings);

	const [setFavoriteTariffIds] = useAppStore(
		useShallow((state) => [state.setFavoriteTariffIds]),
	);

	useFocusEffect(
		useCallback(() => {
			const readSettings = async () => {
				setCurrent(await getCustomTariffsOperators());
			};
			readSettings();
		}, []),
	);

	async function saveCustomTariffs(tariffs: CustomTariff): Promise<void> {
		setFavoriteTariffIds(tariffs.favorite ?? []);
		const newValue = {
			...current,
			tariffs,
		} satisfies CustomTariffsOperators;
		await saveToStorage(key, newValue);
	}

	async function resetCustomTariffs(): Promise<void> {
		await saveToStorage(key, {
			...current,
			tariffs: {
				add: [],
				remove: [],
			},
		} satisfies CustomTariffsOperators);
	}

	async function resetCustomOperators(): Promise<void> {
		await saveToStorage(key, {
			...current,
			operators: {
				add: [],
				remove: [],
			},
		} satisfies CustomTariffsOperators);
	}

	async function saveCustomOperators(operators: CustomTariff): Promise<void> {
		const newValue = {
			...current,
			operators,
		} satisfies CustomTariffsOperators;
		await saveToStorage(key, newValue);
	}

	return {
		saveCustomTariffs,
		saveCustomOperators,
		resetCustomTariffs,
		resetCustomOperators,
		customTariffs: current.tariffs,
		customOperators: current.operators,
	};
}
