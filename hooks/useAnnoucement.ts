import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchAnouncement } from "../functions/api/announcement";
import {
	retrieveFromStorage,
	saveToStorage,
} from "../functions/storage/storage";
import { InfoContentSection } from "../types/announcement";
import { AppState, AppStateStatus } from "react-native";

export function useAnounncement() {
	const [infoContent, setInfoContent] = useState<InfoContentSection[]>([]);

	const queryKey = ["announcement"];
	const queryClient = useQueryClient();

	const announcementQuery = useQuery({
		queryKey,
		retry: 2,
		retryDelay: 500,
		enabled: true,
		queryFn: async () => {
			return await fetchAnouncement();
		},
	});

	useEffect(() => {
		const subscription = AppState.addEventListener("change", (state) => {
			if (state === "active") {
				queryClient.invalidateQueries({ queryKey });
			}
		});

		return () => {
			subscription.remove();
		};
	}, []);

	useEffect(() => {
		const showAnouncement = async () => {
			const { data } = announcementQuery;
			if (!data?.content?.length) {
				setInfoContent([]);
				return;
			}

			const storageKey = "infoModalLastShownDate";
			const lastShown = await retrieveFromStorage<string>(storageKey);
			if (!lastShown) {
				await saveToStorage(storageKey, data.updated);
				setInfoContent(data.content);
				return;
			}

			const currentUpdated = new Date(data.updated);
			const lastShownDate = new Date(lastShown);

			if (currentUpdated.getTime() > lastShownDate.getTime()) {
				await saveToStorage(storageKey, data.updated);
				setInfoContent(data.content);
			}
		};
		showAnouncement();
	}, [announcementQuery.data]);

	const hideInfoContent = () => {
		setInfoContent([]);
	};

	const hasAnnouncement = () => infoContent.length > 0;

	return { infoContent, hideInfoContent, hasAnnouncement };
}
