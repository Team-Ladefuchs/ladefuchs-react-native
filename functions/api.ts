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
			console.error(response);
			throw new Error(
				`Failed to fetch operators: status: ${response.status}`
			);
		}
		const data = (await response.json()) as OperatorsResponse;

		return data.operators;
	} catch (error) {
		console.error(error);
		return [];
	}
}
