export interface TariffResponse {
	tariffs: Tariff[];
}

export interface Tariff {
	identifier: string;
	name: string;
	providerName: string;
	imageUrl: string | null;
	isCustomerOnly: false;
	isStandard: boolean;
	isAdHoc: boolean;
	monthlyFee: number;
	note?: string;
	affiliateLinkUrl?: string;
}
