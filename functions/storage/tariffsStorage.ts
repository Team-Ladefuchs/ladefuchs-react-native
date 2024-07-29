import { retrieveFromStorage, saveToStorage } from "../../state/storage";
import { Tariff } from "../../types/tariff";

// operator ids to add or remove
export interface TariffSettings {
	toAdd: Tariff[];
	toRemove: Tariff[];
}

export async function readTariffSettings(): Promise<TariffSettings> {
	return (
		(await retrieveFromStorage<TariffSettings>("tariffSettings")) ?? {
			toAdd: [],
			toRemove: [],
		}
	);
}

export async function getTariffsFromStorage({
	tariffResponse,
	writeToCache,
}: {
	tariffResponse: Operator[];
	writeToCache: boolean;
}): Promise<Tariff[]> {
	const tariffSettings = await readTariffSettings();

	tariffSettings.toAdd = tariffSettings.toAdd.filter(
		(item) =>
			!tariffResponse.find(
				({ identifier }) => identifier === item.identifier,
			),
	);

	if (writeToCache) {
		await saveTariffSettings(tariffSettings);
	}
	return [
		...tariffSettings.toAdd,
		...tariffResponse.filter(
			(ta) =>
				!tariffSettings.toRemove
					.map(({ identifier }) => identifier)
					.includes(ta.identifier),
		),
	].sort((a, b) =>
		a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()),
	);
}

export async function saveTariffSettings(
	settings: TariffSettings,
): Promise<void> {
	await saveToStorage("tariffSettings", settings);
}
