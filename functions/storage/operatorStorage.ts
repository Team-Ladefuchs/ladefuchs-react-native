import { retrieveFromStorage, saveToStorage } from "../../state/storage";
import { Operator } from "../../types/operator";

// operator ids to add or remove
export interface OperatorSettings {
	toAdd: Operator[];
	toRemove: Operator[];
}

export async function readOperatorSettings(): Promise<OperatorSettings> {
	return (
		(await retrieveFromStorage<OperatorSettings>("operatorSettings")) ?? {
			toAdd: [],
			toRemove: [],
		}
	);
}

export async function getOperatorsFromStorage({
	operatorResponse,
	writeToCache,
}: {
	operatorResponse: Operator[];
	writeToCache: boolean;
}): Promise<Operator[]> {
	const operatorSettings = await readOperatorSettings();

	const existingIdentifiers = new Set(
		operatorResponse.map((item) => item.identifier),
	);

	const operatorsToAdd = operatorSettings.toAdd.filter(
		(item) => !existingIdentifiers.has(item.identifier),
	);

	if (writeToCache) {
		await saveOperatorSettings(operatorSettings);
	}

	return [
		...operatorsToAdd,
		...operatorResponse.filter(
			(op) =>
				!operatorSettings.toRemove
					.map(({ identifier }) => identifier)
					.includes(op.identifier),
		),
	].sort((a, b) =>
		a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()),
	);
}

export async function saveOperatorSettings(
	settings: OperatorSettings,
): Promise<void> {
	await saveToStorage("operatorSettings", settings);
}
