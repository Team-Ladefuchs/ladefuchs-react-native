import { Tariff, TariffResponse } from "../../types/tariff";
import { apiUrl, authHeader } from "./base";
import { defaultTimeout, fetchWithTimeout } from "../util";
import { retrieveFromStorage, saveToStorage } from "../storage/storage";
import { Operator } from "../../types/operator";

export async function fetchAllTariffs({
	writeCache,
	operators,
}: {
	operators: Operator[];
	writeCache: boolean;
}): Promise<Tariff[]> {
	const storageKey = "allTariffsCache";

	const operatorIds = operators.map(({ identifier }) => identifier);
	const tariffs = await fetchTariffsCustom(
		{
			standard: false,
			operatorIds,
			add: [],
			remove: [],
		},
		defaultTimeout,
	);
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
	operatorIds: string[];
	standard: boolean;
}

export async function fetchTariffsCustom(
	request: TariffCustomRequest,
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
				body: JSON.stringify(request),
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
