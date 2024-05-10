export interface TariffResponse {
	tariffs: Tariff[];
}

export interface Tariff {
	identifier: string;
	name: string;
	imageUrl: string;
}
