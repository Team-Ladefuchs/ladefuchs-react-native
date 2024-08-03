import { Tariff, TariffResponse } from "../../types/tariff";
import { apiUrl, authHeader } from "./base";
import { fetchWithTimeout } from "../util";

export async function fetchTariffs({
	standard = true,
}: {
	standard: boolean;
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
		);
		const { tariffs } = (await response.json()) as TariffResponse;
		return tariffs;
	} catch (error) {
		console.error("fetchTariffs", error);
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
		console.error("fetchTariffsCustom", error);
		return [];
	}
}
