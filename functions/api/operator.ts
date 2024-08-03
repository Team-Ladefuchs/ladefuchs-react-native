import { Operator, OperatorsResponse } from "../../types/operator";
import { apiUrl, authHeader } from "./base";
import { fetchWithTimeout } from "../util";

export async function fetchOperators({ standard = true }): Promise<Operator[]> {
	try {
		const response = await fetchWithTimeout(
			`${apiUrl}/v3/operators?standard=${standard}`,
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
		console.error("fetchOperatorCustom", error);
		return [];
	}
}
