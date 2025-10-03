import { ChargeConditionData } from "../../state/appState";
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
		console.warn("fetchConditions", error);
		return [];
	}
}

function deduplicate<T>(values: T[]) {
	return Array.from(new Set(values));
}

export async function getAllChargeConditions({
	writeToCache,
}: {
	writeToCache: boolean;
}): Promise<ChargeConditionData> {
	const { tariffs: customTariffs, operators: customOperators } =
		await getCustomTariffsOperators();

	const operators = await fetchOperatorCustom(customOperators);
	const operatorIds = deduplicate(operators.map((item) => item.identifier));
	const tariffs = await fetchTariffsCustom({
		...customTariffs,
		standard: true,
	});

	const chargingConditions = await fetchChargingConditions({
		tariffIds: deduplicate(tariffs.map((item) => item.identifier)),
		operatorIds: operatorIds,
		chargingModes: ["ac", "dc"],
	});

	const favoriteTariffIds = new Set(customTariffs.favorite ?? []);

	if (!chargingConditions[0]?.tariffConditions?.length) {
		return {
			favoriteTariffIds,
			...(await getOfflineChargeConditionData()),
		};
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
		favoriteTariffIds,
		tariffs: tariffsToHashMap(tariffs),
		chargingConditions: chargeConditionToHashMap(chargingConditions),
	};
}
