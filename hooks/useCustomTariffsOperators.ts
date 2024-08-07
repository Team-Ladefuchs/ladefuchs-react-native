import { useCallback, useState } from "react";
import { retrieveFromStorage, saveToStorage } from "../state/storage";
import { useFocusEffect } from "@react-navigation/native";

export interface CustomTariff {
	add: string[];
	remove: string[];
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
	},
	operators: {
		add: [],
		remove: [],
	},
} satisfies CustomTariffsOperators;

const key = "customTariffsOperators";

export async function getCustomTariffsOperators(): Promise<CustomTariffsOperators> {
	return (
		(await retrieveFromStorage<CustomTariffsOperators>(key)) ??
		emptyCustomSettings
	);
}

export function useCustomTariffsOperators() {
	const [current, setCurrent] = useState(emptyCustomSettings);

	useFocusEffect(
		useCallback(() => {
			const readSettings = async () => {
				setCurrent(await getCustomTariffsOperators());
			};
			readSettings();
		}, []),
	);

	async function saveCustomTariffs(tariffs: CustomTariff): Promise<void> {
		console.log("saveCustomTariffs", tariffs);
		const newValue = {
			...current,
			tariffs,
		};
		await saveToStorage(key, newValue);
	}
	async function saveCustomOperators(operators: CustomTariff): Promise<void> {
		await saveToStorage(key, current);
		const newValue = {
			...current,
			operators,
		};
		await saveToStorage(key, newValue);
	}

	return {
		saveCustomTariffs,
		saveCustomOperators,
		customTariffs: current.tariffs,
		customOperators: current.operators,
	};
}
