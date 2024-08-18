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
	monthlyFee: number;
	note?: string;
	affiliateLinkUrl?: string;
	// only for view
	added?: boolean;
}
