import { ChargingCondition, TariffCondition } from "./conditions";
import { Operator } from "./operator";
import { Tariff } from "./tariff";

export interface AppData {
	operators: Operator[];
	tariffs: Map<string, Tariff>;
	chargingConditions: ChargingCondition[];
}

export interface AppState extends AppData {
	operatorId: string;
	setOperatorId: (id: string) => void;
	tariffConditions: TariffCondition[];
	setTariffConditions: (tariffs: TariffCondition[]) => void;
}
