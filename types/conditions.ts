export type ChargeMode = "ac" | "dc";

export interface ConditionsResponse {
	lastUpdatedDate: string;
	chargingConditions: ChargingCondition[];
}

export interface ChargingCondition {
	operatorId: string;
	tariffConditions: TariffCondition[];
}

export interface TariffCondition {
	blockingFeeStart: number;
	blockingFee: number;
	chargingMode: ChargeMode;
	pricePerKwh: number;
	tariffId: string;
	tariffName: string;
}
