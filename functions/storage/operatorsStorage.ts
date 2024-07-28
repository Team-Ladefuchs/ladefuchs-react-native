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


export async function getOperatorsFromStorage() {

}

export async function saveOperatorSettings(
	settings: OperatorSettings,
): Promise<void> {
	await saveToStorage("operatorSettings", settings);
}
