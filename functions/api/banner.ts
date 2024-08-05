import { Platform } from "react-native";
import { LadefuchsBanner, Banner, ImpressionRequest } from "../../types/banner";
import { apiUrl, authHeader } from "./base";
import { fetchWithTimeout, isDebug } from "../util";
import { BannerData } from "../../state/state";
import { storageSet } from "../storage/chargeConditionStorage";
import {
	getBannerType,
	retrieveFromStorage,
	saveToStorage,
} from "../../state/storage";

export async function fetchAllLadefuchsBanners(): Promise<LadefuchsBanner[]> {
	try {
		const response = await fetchWithTimeout(`${apiUrl}/v3/banners`, {
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
			`${apiUrl}/v3/banners/chargeprice/advertisement`,
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

export async function postBannerImpression(
	banner: Banner | null,
): Promise<void> {
	if (isDebug) {
		return;
	}

	if (!banner?.identifier) {
		return;
	}

	const response = await fetchWithTimeout(`${apiUrl}/v3/banners/impression`, {
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
	});
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
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