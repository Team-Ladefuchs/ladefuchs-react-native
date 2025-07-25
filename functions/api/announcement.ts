import {
	AnnouncementResponse,
	InfoContentSection,
} from "../../types/announcement";
import { fetchWithTimeout } from "../util";
import { apiUrl, authHeader } from "./base";

export async function fetchAnouncement(): Promise<AnnouncementResponse | null> {
	try {
		const response = await fetchWithTimeout(`${apiUrl}/v3/announcement`, {
			headers: {
				...authHeader.headers,
				Accept: "application/json",
			},
		});
		return (await response.json()) as AnnouncementResponse;
	} catch (error) {
		console.error("fetchAnouncement", error);
		return null;
	}
}
