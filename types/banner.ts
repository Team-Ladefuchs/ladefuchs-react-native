export interface LadefuchsBanner extends Banner {
	identifier: string;
	frequency: number;
	isAffiliate: boolean;
	lastUpdatedDate: string;
}

export interface Banner {
	affiliateLinkUrl: string;
	imageUrl: string;
	bannerType: BannerType;
}

export type BannerType = "ladefuchs" | "chargePrice";
