import { PlatformOSType } from "react-native";

export interface AppMetricsRequest {
	deviceId: string | null;
	platform: PlatformOSType;
	version: number;
}

export interface AppMetricResponse {
	deviceId: string;
}

export interface AppMetricCache {
	deviceId: string | null;
	lastUpdated: string;
}
