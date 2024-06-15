import { AppData, BannerData, ChargeConditionData } from "../state/state";
import {
	getBannerType,
	retrieveFromStorage,
	saveToStorage,
} from "../state/storage";
import { Banner, BannerType, LadefuchsBanner } from "../types/banner";
import {
	ChargeMode,
	ChargingCondition,
	ConditionsResponse,
	TariffCondition,
} from "../types/conditions";
import { Operator, OperatorsResponse } from "../types/operator";
import { Tariff, TariffResponse } from "../types/tariff";

//hier wird der Operator für den Picker geholt

const apiPath = "https://api.ladefuchs.app";
export const authHeader = {
	headers: {
		Authorization: `Bearer ${process.env.API_TOKEN}`,
	},
} as const;

export async function fetchOperators({ standard = true }): Promise<Operator[]> {
	try {
		const response = await fetch(
			`${apiPath}/v3/operators?standard=${standard}`,
			{
				headers: {
					...authHeader.headers,
					Accept: "application/json",
				},
			}
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
		const response = await fetch(
			`${apiPath}/v3/tariffs?standard=${standard}`,
			{
				headers: {
					...authHeader.headers,
					Accept: "application/json",
				},
			}
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
		const response = await fetch(`${apiPath}/v3/conditions`, {
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
	data: ChargingCondition[]
): Map<string, TariffCondition[]> {
	const map = new Map();

	for (const conditions of data) {
		map.set(conditions.operatorId, conditions.tariffConditions);
	}

	return map;
}

export async function fetchAllLadefuchsBanners(): Promise<LadefuchsBanner[]> {
	try {
		const response = await fetch(`${apiPath}/v3/banners`, {
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
		const response = await fetch(
			`${apiPath}/v3/banners/chargeprice/advertisement`,
			{
				headers: {
					...authHeader.headers,
					Accept: "application/json",
				},
			}
		);
		return response.json();
	} catch {
		return null;
	}
}

const storageKey = "ladefuchsOfflineCache";

async function getBanner(): Promise<BannerData> {
	const bannerType = await getBannerType();
	const [ladefuchsBanners, chargePriceAdBanner] = await Promise.all([
		fetchAllLadefuchsBanners(),
		bannerType === "chargePrice" ? fetchChargePriceAdBanner() : null,
	]);

	return { bannerType, ladefuchsBanners, chargePriceAdBanner };
}

interface OfflineData {
	ladefuchsBanners: LadefuchsBanner[];
	chargePriceAdBanner?: Banner | null;
	operators: Operator[];
	tariffs: Tariff[];
	chargingConditions: ChargingCondition[];
}
export async function fetchAllApiData({
	writeToCache,
}: {
	writeToCache: boolean;
}): Promise<AppData> {
	const [
		operators,
		tariffs,
		{ bannerType, ladefuchsBanners, chargePriceAdBanner },
	] = await Promise.all([
		fetchOperators({ standard: true }),
		fetchTariffs({ standard: true }),
		getBanner(),
	]);

	const chargingConditions = await fetchChargingConditions({
		tariffsIds: tariffs.map((item) => item.identifier),
		operatorIds: operators.map((item) => item.identifier),
		chargingModes: ["ac", "dc"],
	});

	if (!chargingConditions.length) {
		return await getFromLocaleCache(bannerType);
	}
	if (writeToCache) {
		await saveToStorage<OfflineData>(storageKey, {
			operators,
			tariffs,
			chargingConditions,
			ladefuchsBanners,
			chargePriceAdBanner,
		});
	}

	return {
		ladefuchsBanners,
		chargePriceAdBanner,
		bannerType,
		operators,
		tariffs: tariffsToHashMap(tariffs),
		chargingConditions: chargeConditionToHashMap(chargingConditions),
	};
}

async function getFromLocaleCache(bannerType: BannerType) {
	const offlineData = await retrieveFromStorage<OfflineData>(storageKey);
	if (!offlineData) {
		throw new Error("The Api is maybe down");
	}
	return {
		ladefuchsBanners: offlineData.ladefuchsBanners,
		chargePriceAdBanner: offlineData.chargePriceAdBanner,
		operators: offlineData.operators,
		bannerType,
		tariffs: tariffsToHashMap(offlineData.tariffs),
		chargingConditions: chargeConditionToHashMap(
			offlineData.chargingConditions
		),
	};
}
