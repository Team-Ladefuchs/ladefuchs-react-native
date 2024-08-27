import { Tariff, TariffResponse } from "../../types/tariff";
import { apiUrl, authHeader } from "./base";
import { fetchWithTimeout } from "../util";
import { retrieveFromStorage, saveToStorage } from "../storage/storage";

export async function fetchAllTariffs({
	writeCache,
}: {
	writeCache: boolean;
}): Promise<Tariff[]> {
	const storageKey = "allTariffsCache";

	const tariffs = await fetchTariffs({ standard: false, timeout: 3500 });

	if (!tariffs.length) {
		return (await retrieveFromStorage<Tariff[] | null>(storageKey)) ?? [];
	}

	if (writeCache) {
		await saveToStorage(storageKey, tariffs);
	}

	return tariffs;
}

export async function fetchTariffs({
	standard = true,
	timeout,
}: {
	standard: boolean;
	timeout?: number;
}): Promise<Tariff[]> {
	try {
		const response = await fetchWithTimeout(
			`${apiUrl}/v3/tariffs?standard=${standard}`,
			{
				headers: {
					...authHeader.headers,
					Accept: "application/json",
				},
			},
			timeout,
		);
		const { tariffs } = (await response.json()) as TariffResponse;
		return tariffs;
	} catch (error) {
		console.warn("fetchTariffs", error);
		return [];
	}
}

interface TariffCustomRequest {
	add: string[];
	remove: string[];
}

export async function fetchTariffsCustom(
	request: TariffCustomRequest,
): Promise<Tariff[]> {
	try {
		const response = await fetchWithTimeout(`${apiUrl}/v3/tariffs`, {
			method: "POST",
			headers: {
				...authHeader.headers,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		});

		const { tariffs } = (await response.json()) as TariffResponse;

		return tariffs;
	} catch (error) {
		console.warn("fetchTariffsCustom", error);
		return [];
	}
}
