import { Tariff, TariffResponse } from "../../types/tariff";
import { apiUrl, authHeader } from "../api";
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
		const data = (await response.json()) as TariffResponse;
		return data.tariffs;
	} catch (error) {
		console.error("fetchTariffs", error);
		return [];
	}
}
