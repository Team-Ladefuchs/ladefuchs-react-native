import { Tariff, TariffResponse } from "../../types/tariff";
import { apiUrl, authHeader } from "./base";
import { deduplicate, defaultTimeout, fetchWithTimeout } from "../util";
import { retrieveFromStorage, saveToStorage } from "../storage/storage";

export async function fetchAllTariffs(
	{
		writeCache,
	}: {
		writeCache: boolean;
	},
	timeout = defaultTimeout,
): Promise<Tariff[]> {
	const storageKey = "allTariffsCache";

	const response = await fetchWithTimeout(
		`${apiUrl}/v3/tariffs`,
		{
			headers: {
				...authHeader.headers,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		},
		timeout,
	);
	const { tariffs } = (await response.json()) as TariffResponse;

	if (!tariffs.length) {
		const tariffs =
			(await retrieveFromStorage<Tariff[] | null>(storageKey)) ?? [];
		return tariffs;
	}

	if (writeCache) {
		await saveToStorage(storageKey, tariffs);
	}

	return tariffs;
}

interface TariffCustomRequest {
	add: string[];
	remove: string[];
	operatorIds?: string[];
	standard: boolean;
}

export async function fetchTariffsCustom(
	{ add, remove }: TariffCustomRequest, // operatorIds = []
	timeout = defaultTimeout,
): Promise<Tariff[]> {
	try {
		const response = await fetchWithTimeout(
			`${apiUrl}/v3/tariffs`,
			{
				method: "POST",
				headers: {
					...authHeader.headers,
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					add: deduplicate(add),
					remove: deduplicate(remove),
				}),
			},
			timeout,
		);

		const { tariffs } = (await response.json()) as TariffResponse;

		return tariffs;
	} catch (error) {
		console.warn("fetchTariffsCustom", error);
		return [];
	}
}
