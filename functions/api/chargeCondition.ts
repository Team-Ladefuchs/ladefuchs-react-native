import { ChargeConditionData } from "../../state/state";
import { saveToStorage } from "../../state/storage";
import {
	ChargeMode,
	ChargingCondition,
	ConditionsResponse,
} from "../../types/conditions";
import { apiUrl, authHeader } from "../api";
import { getOfflineChargeConditionData, OfflineChargeConditionData, storageSet } from "../storage/chargeConditionStorage";
import { getOperatorsFromStorage } from "../storage/operatorStorage";
import { chargeConditionToHashMap, fetchWithTimeout, tariffsToHashMap } from "../util";
import { fetchOperators } from "./operator";
import { fetchTariffs } from "./tariff";

export async function fetchChargingConditions(requestBody: {
	tariffsIds: string[];
	operatorIds: string[];
	chargingModes: ChargeMode[];
}): Promise<ChargingCondition[]> {
	try {
		const response = await fetchWithTimeout(`${apiUrl}/v3/conditions`, {
			method: "POST",
			headers: {
				...authHeader.headers,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		const data = (await response.json()) as ConditionsResponse;
		return data.chargingConditions;
	} catch (error) {
		console.error("fetchConditions", error);
		return [];
	}
}

export async function getAllChargeConditions({
	writeToCache,
}: {
	writeToCache: boolean;
}): Promise<ChargeConditionData> {
	const [operatorResponse, tariffs] = await Promise.all([
		fetchOperators({ standard: true }),
		fetchTariffs({ standard: true }),
	]);

	const operators = await getOperatorsFromStorage({
		operatorResponse,
		writeToCache,
	});

	const chargingConditions = await fetchChargingConditions({
		tariffsIds: tariffs.map((item) => item.identifier),
		operatorIds: operators.map((item) => item.identifier),
		chargingModes: ["ac", "dc"],
	});

	if (!chargingConditions.length) {
		return await getOfflineChargeConditionData();
	}
	if (writeToCache) {
		await saveToStorage<OfflineChargeConditionData>(
			storageSet.chargeConditionData,
			{
				operators,
				tariffs,
				chargingConditions,
			},
		);
	}

	return {
		operators,
		tariffs: tariffsToHashMap(tariffs),
		chargingConditions: chargeConditionToHashMap(chargingConditions),
	};
}
