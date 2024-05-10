import { ChargingCondition } from "./conditions";
import { Operator } from "./operator";
import { Tariff } from "./tariff";

export interface AppData {
	operators: Operator[];
	tariffs: Map<string, Tariff>;
	chargingConditions: ChargingCondition[];
}
