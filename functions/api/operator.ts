import { Operator, OperatorsResponse } from "../../types/operator";
import { apiUrl, authHeader } from "./base";
import { fetchWithTimeout } from "../util";
import { retrieveFromStorage, saveToStorage } from "../storage/storage";

export async function fetchAllOperators({
	writeCache,
}: {
	writeCache: boolean;
}): Promise<Operator[]> {
	const storageKey = "allOperatorsCache";

	const operators = await fetchOperators({ standard: false, timeout: 4200 });

	if (!operators.length) {
		return (await retrieveFromStorage<Operator[] | null>(storageKey)) ?? [];
	}

	if (writeCache) {
		await saveToStorage(storageKey, operators);
	}

	return operators;
}

export async function fetchOperators({
	standard = true,
	timeout,
}: {
	standard: boolean;
	timeout?: number;
}): Promise<Operator[]> {
	try {
		const response = await fetchWithTimeout(
			`${apiUrl}/v3/operators?standard=${standard}`,
			{
				headers: {
					...authHeader.headers,
					Accept: "application/json",
				},
			},
			timeout,
		);
		const data = (await response.json()) as OperatorsResponse;
		return data.operators;
	} catch (error) {
		console.error("fetchOperators", error);
		return [];
	}
}

interface OperatorCustomRequest {
	add: string[];
	remove: string[];
}

export async function fetchOperatorCustom(
	request: OperatorCustomRequest,
): Promise<Operator[]> {
	try {
		const response = await fetchWithTimeout(`${apiUrl}/v3/operators`, {
			method: "POST",
			headers: {
				...authHeader.headers,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		});
		const { operators } = (await response.json()) as OperatorsResponse;
		return operators;
	} catch (error) {
		console.warn("fetchOperatorCustom", error);
		return [];
	}
}
