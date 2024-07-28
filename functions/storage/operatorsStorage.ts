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

	operatorSettings.toAdd = operatorSettings.toAdd.filter(
		(item) =>
			!operatorResponse.find(
				({ identifier }) => identifier === item.identifier,
			),
	);

	if (writeToCache) {
		await saveOperatorSettings(operatorSettings);
	}
	return [
		...operatorSettings.toAdd,
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
