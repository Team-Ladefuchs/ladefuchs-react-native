import { ChargeConditionData } from "../../state/state";
import { saveToStorage } from "../../state/storage";
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
		console.error("fetchConditions", error);
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

	console.log("customTariffs", customTariffs);
	const [operators, tariffs] = await Promise.all([
		fetchOperatorCustom(customOperators),
		fetchTariffsCustom(customTariffs),
	]);

	const chargingConditions = await fetchChargingConditions({
		tariffIds: tariffs.map((item) => item.identifier),
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
