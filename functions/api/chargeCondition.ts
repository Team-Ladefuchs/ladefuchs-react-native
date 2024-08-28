import { ChargeConditionData } from "../../state/state";
import {
	ChargeMode,
	ChargingCondition,
	ConditionsResponse,
} from "../../types/conditions";
import { apiUrl, authHeader } from "./base";
import {
	getOfflineChargeConditionData,
	OfflineChargeConditionData,
	storageSet,
} from "../storage/chargeConditionStorage";
import {
	chargeConditionToHashMap,
	fetchWithTimeout,
	tariffsToHashMap,
} from "../util";
import { fetchOperatorCustom } from "./operator";
import { fetchTariffsCustom } from "./tariff";
import { getCustomTariffsOperators } from "../../hooks/useCustomTariffsOperators";
import { saveToStorage } from "../storage/storage";

export async function fetchChargingConditions(requestBody: {
	tariffIds: string[];
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

		const json = await response.json();
		const data = json as ConditionsResponse;
		return data?.chargingConditions;
	} catch (error) {
		console.log("fetchConditions", error);
		return [];
	}
}

export async function getAllChargeConditions({
	writeToCache,
}: {
	writeToCache: boolean;
}): Promise<ChargeConditionData> {
	const { tariffs: customTariffs, operators: customOperators } =
		await getCustomTariffsOperators();

	const operators = await fetchOperatorCustom(customOperators);
	const operatorIds = operators.map((item) => item.identifier);
	const tariffs = await fetchTariffsCustom({
		...customTariffs,
		operatorIds,
		standard: true,
	});

	const chargingConditions = await fetchChargingConditions({
		tariffIds: tariffs.map((item) => item.identifier),
		operatorIds: operatorIds,
		chargingModes: ["ac", "dc"],
	});

	if (!chargingConditions[0]?.tariffConditions?.length) {
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
