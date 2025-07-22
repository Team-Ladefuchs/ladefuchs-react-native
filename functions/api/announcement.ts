import {
	AnnouncementResponse,
	InfoContentSection,
} from "../../types/announcement";
import { fetchWithTimeout } from "../util";
import { apiUrl, authHeader } from "./base";

export async function fetchAnouncement(): Promise<InfoContentSection[]> {
	try {
		const response = await fetchWithTimeout(`${apiUrl}/v3/announcement`, {
			headers: {
				...authHeader.headers,
				Accept: "application/json",
			},
		});
		const data = (await response.json()) as AnnouncementResponse;
		return data?.content ?? [];
	} catch (error) {
		console.error("fetchAnouncement", error);
		return [];
	}
}
