import { LadefuchsBanner } from "./banner";
import { ChargingCondition, TariffCondition } from "./conditions";
import { Operator } from "./operator";
import { Tariff } from "./tariff";

export interface AppData {
	operators: Operator[];
	tariffs: Map<string, Tariff>;
	ladefuchsBanners: LadefuchsBanner[];
	chargingConditions: ChargingCondition[];
}

export interface AppState extends AppData {
	operatorId: string;
	setOperatorId: (id: string) => void;
	tariffConditions: TariffCondition[];
	setTariffConditions: (tariffs: TariffCondition[]) => void;
}
