import { ToastAndroid } from "react-native";
import { AppData } from "../types/app";
import {
	ChargeMode,
	ChargingCondition,
	ConditionsResponse,
} from "../types/conditions";
import { Operator, OperatorsResponse } from "../types/operator";
import { Tariff, TariffResponse } from "../types/tariff";

//hier wird der Operator für den Picker geholt

const apiPath = "https://api.ladefuchs.app";
const authHeader = {
	headers: {
		Authorization: `Bearer ${process.env.API_TOKEN}`,
		"Content-Type": "application/json",
	},
} as const;

export async function fetchOperators({ standard = true }): Promise<Operator[]> {
	try {
		const response = await fetch(
			`${apiPath}/v3/operators?standard=${standard}`,
			authHeader
		);
		if (!response.ok) {
			console.error(response);
			throw new Error(
				`Failed to fetch operators: status: ${response.status}`
			);
		}
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
			authHeader
		);
		const data = (await response.json()) as TariffResponse;
		return data.tariffs;
	} catch (error) {
		console.error("fetchTariff", error);
		return [];
	}
}

export async function fetchChargingConditions(requestBody: {
	tariffsIds: string[];
	operatorIds: string[];
	chargingModes: ChargeMode[];
}): Promise<ChargingCondition[]> {
	authHeader.headers.Authorization;
	try {
		const response = await fetch(`${apiPath}/v3/conditions`, {
			method: "POST",
			headers: authHeader.headers,
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

export async function fetchAllApiData(): Promise<AppData> {
	// mache die Abfrage in Parallel
	const [operators, tariffs] = await Promise.all([
		fetchOperators({ standard: true }),
		fetchTariffs({ standard: true }),
	]);

	const tariffsIds = tariffs.map((item) => item.identifier);
	const operatorIds = operators.map((item) => item.identifier);
	const chargingConditions = await fetchChargingConditions({
		tariffsIds,
		operatorIds,
		chargingModes: ["ac", "dc"],
	});
	return {
		operators,
		tariffs: tariffsToHashMap(tariffs),
		chargingConditions,
	};
}

export async function fetchImage(url: string) {
	const response = await fetch(url, authHeader);
	const blob = await response.blob();
	return URL.createObjectURL(blob);
}
