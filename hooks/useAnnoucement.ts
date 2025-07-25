import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchAnouncement } from "../functions/api/announcement";
import {
	retrieveFromStorage,
	saveToStorage,
} from "../functions/storage/storage";
import { InfoContentSection } from "../types/announcement";
import { AppState, AppStateStatus } from "react-native";

export function useAnounncement() {
	const [appState, setAppState] = useState<AppStateStatus>(
		AppState.currentState,
	);

	useEffect(() => {
		const subscription = AppState.addEventListener("change", setAppState);
		return () => {
			subscription.remove();
		};
	}, []);
	const [infoContent, setInfoContent] = useState<InfoContentSection[]>([]);

	const announcementQuery = useQuery({
		queryKey: [appState === "active"],
		retry: 2,
		retryDelay: 500,
		enabled: true,
		queryFn: async () => {
			return await fetchAnouncement();
		},
	});

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
	}, [announcementQuery.data, appState]);

	const hideInfoContent = () => {
		setInfoContent([]);
	};

	const hasAnnouncement = () => infoContent.length > 0;

	return { infoContent, hideInfoContent, hasAnnouncement };
}
