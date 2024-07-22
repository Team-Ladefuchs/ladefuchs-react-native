import { Platform } from "react-native";
import { BannerData, ChargeConditionData } from "../state/state";
import {
	getBannerType,
	retrieveFromStorage,
	saveToStorage,
} from "../state/storage";
import { Banner, ImpressionRequest, LadefuchsBanner } from "../types/banner";
import {
	ChargeMode,
	ChargingCondition,
	ConditionsResponse,
	TariffCondition,
} from "../types/conditions";
import { FeedbackRequest } from "../types/feedback";
import { Operator, OperatorsResponse } from "../types/operator";
import { Tariff, TariffResponse } from "../types/tariff";
import { appVersionNumber, fetchWithTimeout, getMinutes } from "./util";
import {
	AppMetricCache,
	AppMetricResponse,
	AppMetricsRequest,
} from "../types/metrics";

const apiPath = "https://api.ladefuchs.app";
export const authHeader = {
	headers: {
		Authorization: `Bearer ${process.env.API_TOKEN}`,
	},
} as const;

export async function fetchOperators({ standard = true }): Promise<Operator[]> {
	try {
		const response = await fetchWithTimeout(
			`${apiPath}/v3/operators?standard=${standard}`,
			{
				headers: {
					...authHeader.headers,
					Accept: "application/json",
				},
			},
		);
		const data = (await response.json()) as OperatorsResponse;
		return data.operators;
	} catch (error) {
		console.error("fetchOperators", error);
		return [];
	}
}

export async function fetchTariffs({
	standard = true,
}: {
	standard: boolean;
}): Promise<Tariff[]> {
	try {
		const response = await fetchWithTimeout(
			`${apiPath}/v3/tariffs?standard=${standard}`,
			{
				headers: {
					...authHeader.headers,
					Accept: "application/json",
				},
			},
		);
		const data = (await response.json()) as TariffResponse;
		return data.tariffs;
	} catch (error) {
		console.error("fetchTariffs", error);
		return [];
	}
}

export async function fetchChargingConditions(requestBody: {
	tariffsIds: string[];
	operatorIds: string[];
	chargingModes: ChargeMode[];
}): Promise<ChargingCondition[]> {
	try {
		const response = await fetchWithTimeout(`${apiPath}/v3/conditions`, {
			method: "POST",
			headers: {
				...authHeader.headers,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		const data = (await response.json()) as ConditionsResponse;
		return data.chargingConditions;
	} catch (error) {
		console.error("fetchConditions", error);
		return [];
	}
}

function tariffsToHashMap(data: Tariff[]): Map<string, Tariff> {
	const map = new Map();

	for (const tariff of data) {
		map.set(tariff.identifier, tariff);
	}
	return map;
}

function chargeConditionToHashMap(
	data: ChargingCondition[],
): Map<string, TariffCondition[]> {
	const map = new Map();

	for (const conditions of data) {
		map.set(conditions.operatorId, conditions.tariffConditions);
	}

	return map;
}

export async function fetchAllLadefuchsBanners(): Promise<LadefuchsBanner[]> {
	try {
		const response = await fetchWithTimeout(`${apiPath}/v3/banners`, {
			headers: {
				...authHeader.headers,
				Accept: "application/json",
			},
		});

		return response.json();
	} catch (error) {
		console.error("fetchAllLadefuchsBanners", error);
		return [];
	}
}

export async function fetchChargePriceAdBanner(): Promise<Banner | null> {
	try {
		const response = await fetchWithTimeout(
			`${apiPath}/v3/banners/chargeprice/advertisement`,
			{
				headers: {
					...authHeader.headers,
					Accept: "application/json",
				},
			},
		);
		return response.json();
	} catch {
		return null;
	}
}

export async function sendFeedback(request: FeedbackRequest): Promise<void> {
	const response = await fetchWithTimeout(`${apiPath}/v3/feedback`, {
		method: "POST",
		headers: {
			...authHeader.headers,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(request),
	});
	if (!response.ok) {
		throw Error("could not send feedback, got an bad status code");
	}
}

const storageSet = {
	banners: "ladefuchsOfflineCache",
	chargeConditionData: "chargeConditionData",
};

export async function postBannerImpression(banner: Banner): Promise<void> {
	if (!banner?.identifier) {
		return;
	}
	const response = await fetchWithTimeout(
		`${apiPath}/v3/banners/impression`,
		{
			method: "POST",
			headers: {
				...authHeader.headers,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				bannerId: banner.identifier,
				platform: Platform.OS,
			} satisfies ImpressionRequest),
		},
	);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
}

export async function postAppMetric(): Promise<void> {
	const cacheKey = "appMetric";
	const cache = await retrieveFromStorage<AppMetricCache>(cacheKey);

	if (cache?.lastUpdated) {
		const updatedDevice = Date.parse(cache?.lastUpdated);
		const oneHourInMs = getMinutes(60);
		if (Date.now() - updatedDevice < oneHourInMs) {
			return;
		}
	}

	const response = await fetchWithTimeout(`${apiPath}/v3/app/metrics`, {
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

export async function getBanners({
	writeToCache,
}: {
	writeToCache: boolean;
}): Promise<BannerData> {
	const bannerType = await getBannerType();
	const [ladefuchsBanners, chargePriceAdBanner] = await Promise.all([
		fetchAllLadefuchsBanners(),
		bannerType === "chargePrice" ? fetchChargePriceAdBanner() : null,
	]);

	if (!ladefuchsBanners.length) {
		const offlineData = await retrieveFromStorage<BannerData>(
			storageSet.banners,
		);
		if (!offlineData) {
			throw new Error("The Api is maybe down");
		}
		return { ...offlineData, bannerType };
	}

	if (writeToCache) {
		await saveToStorage<Partial<BannerData>>(storageSet.banners, {
			ladefuchsBanners,
			chargePriceAdBanner,
		});
	}

	return { bannerType, ladefuchsBanners, chargePriceAdBanner };
}

interface OfflineChargeConditionData {
	operators: Operator[];
	tariffs: Tariff[];
	chargingConditions: ChargingCondition[];
}

export async function getAllChargeConditions({
	writeToCache,
}: {
	writeToCache: boolean;
}): Promise<ChargeConditionData> {
	async function getOfflineChargeConditionData() {
		const offlineData =
			await retrieveFromStorage<OfflineChargeConditionData>(
				storageSet.chargeConditionData,
			);
		if (!offlineData?.chargingConditions) {
			throw new Error("The Api is maybe down");
		}
		return {
			operators: offlineData.operators,
			tariffs: tariffsToHashMap(offlineData.tariffs),
			chargingConditions: chargeConditionToHashMap(
				offlineData.chargingConditions,
			),
		};
	}

	const [operators, tariffs] = await Promise.all([
		fetchOperators({ standard: true }),
		fetchTariffs({ standard: true }),
	]);

	const chargingConditions = await fetchChargingConditions({
		tariffsIds: tariffs.map((item) => item.identifier),
		operatorIds: operators.map((item) => item.identifier),
		chargingModes: ["ac", "dc"],
	});

	if (!chargingConditions.length) {
		return await getOfflineChargeConditionData();
	}
	if (writeToCache) {
		await saveToStorage<OfflineChargeConditionData>(
			storageSet.chargeConditionData,
			{
				operators,
				tariffs,
				chargingConditions,
			},
		);
	}

	return {
		operators,
		tariffs: tariffsToHashMap(tariffs),
		chargingConditions: chargeConditionToHashMap(chargingConditions),
	};
}
