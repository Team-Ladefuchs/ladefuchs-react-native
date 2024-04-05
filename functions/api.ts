import { Operator, OperatorsResponse } from "../types/operator";

const apiPath = "https://api.ladefuchs.app";
const authHeader = {
	headers: {
		Authorization: `Bearer ${process.env.API_TOKEN}`,
	},
};

export async function fetchOperators({ standard = true }): Promise<Operator[]> {
	try {
		const response = await fetch(
			`${apiPath}/v3/operators?standard=${standard}`,
			authHeader
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch operators: ${response}`);
		}
		const data = (await response.json()) as OperatorsResponse;
		return data.operators;
	} catch (error) {
		console.error(error);
		return [];
	}
}
