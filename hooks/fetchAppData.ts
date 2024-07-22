import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
	getAllChargeConditions,
	getBanners,
	postAppMetric,
	postBannerImpression,
} from "../functions/api";

import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../state/state";
import { isDebug } from "../functions/util";
import { AppState, AppStateStatus } from "react-native";

export function useFetchAppData(): void {
	const [
		setAppData,
		setAppError,
		operators,
		setBanners,
		ladefuchsBanners,
		banner,
	] = useAppStore(
		useShallow((state) => [
			state.setChargeConditions,
			state.setAppError,
			state.operators,
			state.setBanners,
			state.ladefuchsBanners,
			state.banner,
		]),
	);
	const allChargeConditionsQuery = useQuery({
		queryKey: ["appChargeConditions"],
		retry: 3,
		queryFn: async () => {
			return await getAllChargeConditions({
				writeToCache: !operators.length,
			});
		},
	});

	const sendBannerImpression = useMutation({
		mutationFn: () => postBannerImpression(banner),
		retry: 1,
	});

	useEffect(() => {
		if (banner?.bannerType !== "ladefuchs") {
			return;
		}
		if (isDebug) {
			return;
		}
		sendBannerImpression.mutateAsync();
	}, [banner?.identifier]);

	const bannerQuery = useQuery({
		queryKey: ["appBanners"],
		retry: 3,
		queryFn: async () => {
			return await getBanners({ writeToCache: !ladefuchsBanners.length });
		},
	});

	const sendAppMetric = useMutation({
		mutationFn: () => postAppMetric(),
		retry: 1,
	});

	useEffect(() => {
		const handleAppStateChange = (nextAppState: AppStateStatus) => {
			if (nextAppState === "active") {
				setTimeout(async () => {
					await sendAppMetric.mutateAsync();
				}, 1020);
			}
		};
		const subscription = AppState.addEventListener(
			"change",
			handleAppStateChange,
		);

		return () => {
			subscription.remove();
		};
	}, [sendAppMetric]);

	useEffect(() => {
		setAppError(allChargeConditionsQuery?.error);

		if (allChargeConditionsQuery.data) {
			setAppData(allChargeConditionsQuery.data);
		}
	}, [
		allChargeConditionsQuery.data,
		allChargeConditionsQuery.error,
		setAppError,
		setAppData,
	]);

	useEffect(() => {
		if (bannerQuery.data) {
			setBanners(bannerQuery.data);
		}
	}, [bannerQuery.data, setBanners]);
}
