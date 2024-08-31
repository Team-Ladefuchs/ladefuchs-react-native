import { PlatformOSType } from "react-native";

export interface LadefuchsBanner extends Banner {
	identifier: string;
	frequency: number;
	isAffiliate: boolean;
	lastUpdatedDate: string;
}

export interface Banner {
	identifier: string;
	affiliateLinkUrl: string;
	imageUrl: string;
	bannerType: BannerType;
}

export type BannerType = "ladefuchs" | "chargePrice";

export interface ImpressionRequest {
	bannerId: string;
	platform: PlatformOSType;
}
