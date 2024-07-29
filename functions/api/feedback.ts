import { FeedbackRequest } from "../../types/feedback";
import { apiUrl, authHeader } from "./base";
import { fetchWithTimeout } from "../util";

export async function sendFeedback(request: FeedbackRequest): Promise<void> {
	const response = await fetchWithTimeout(`${apiUrl}/v3/feedback`, {
		method: "POST",
		headers: {
			...authHeader.headers,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(request),
	});
	if (!response.ok) {
		throw Error("could not send feedback, got an bad status code");
	}
}
