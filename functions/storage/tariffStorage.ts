import { retrieveFromStorage, saveToStorage } from "../../state/storage";
import { Tariff } from "../../types/tariff";

// operator ids to add or remove
export interface TariffSettings {
	toAdd: Tariff[];
}

export async function readTariffSettings(): Promise<TariffSettings> {
	return (
		(await retrieveFromStorage<TariffSettings>("tariffSettings")) ?? {
			toAdd: [],
		}
	);
}

export async function saveTariffSettings(
	settings: TariffSettings,
): Promise<void> {
	await saveToStorage("tariffSettings", settings);
}
