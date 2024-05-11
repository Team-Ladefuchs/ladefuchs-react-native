export interface TariffResponse {
	tariffs: Tariff[];
}

export interface Tariff {
	identifier: string;
	name: string;
	imageUrl: string;
	isCustomerOnly: false;
	isStandard: boolean;
	monthlyFee: number;
	note?: string;
	affiliateLinkUrl?: string;
}
