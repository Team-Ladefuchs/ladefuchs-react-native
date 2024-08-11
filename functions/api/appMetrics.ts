import { Platform } from "react-native";
import { retrieveFromStorage, saveToStorage } from "../storage/storage";
import {
	AppMetricCache,
	AppMetricsRequest,
	AppMetricResponse,
} from "../../types/metrics";
import { apiUrl, authHeader } from "./base";
import {
	isDebug,
	getMinutes,
	fetchWithTimeout,
	appVersionNumber,
} from "../util";

export async function postAppMetric(): Promise<void> {
	if (isDebug) {
		return;
	}
	const cacheKey = "appMetric";
	const cache = await retrieveFromStorage<AppMetricCache>(cacheKey);

	if (cache?.lastUpdated) {
		const updatedDevice = Date.parse(cache?.lastUpdated);
		const oneHourInMs = getMinutes(20);
		if (Date.now() - updatedDevice < oneHourInMs) {
			return;
		}
	}

	const response = await fetchWithTimeout(`${apiUrl}/v3/app/metrics`, {
		method: "POST",
		headers: {
			...authHeader.headers,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			deviceId: cache?.deviceId ?? null,
			version: appVersionNumber(),
			platform: Platform.OS,
		} satisfies AppMetricsRequest),
	});
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	const json: AppMetricResponse = await response.json();

	await saveToStorage(cacheKey, {
		deviceId: json.deviceId,
		lastUpdated: new Date().toISOString(),
	} satisfies AppMetricCache);
}
