import { retrieveFromStorage } from "../../state/storage";
import { ChargingCondition } from "../../types/conditions";
import { Operator } from "../../types/operator";
import { Tariff } from "../../types/tariff";
import { chargeConditionToHashMap, tariffsToHashMap } from "../util";

export const storageSet = {
	banners: "ladefuchsOfflineCache",
	chargeConditionData: "chargeConditionData",
};

export interface OfflineChargeConditionData {
	operators: Operator[];
	tariffs: Tariff[];
	chargingConditions: ChargingCondition[];
}

export async function getOfflineChargeConditionData() {
	const offlineData = await retrieveFromStorage<OfflineChargeConditionData>(
		storageSet.chargeConditionData,
	);
	if (!offlineData?.chargingConditions) {
		throw new Error("The Api is maybe down");
	}
	return {
		operators: offlineData.operators,
		tariffs: tariffsToHashMap(offlineData.tariffs),
		chargingConditions: chargeConditionToHashMap(
			offlineData.chargingConditions,
		),
	};
}
