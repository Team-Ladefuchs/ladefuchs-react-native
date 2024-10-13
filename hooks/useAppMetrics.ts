import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppStateStatus, AppState } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../state/appState";
import { postBannerImpression } from "../functions/api/banner";
import { postAppMetric } from "../functions/api/appMetrics";

export function useAopMetrics() {
	const [banner] = useAppStore(useShallow((state) => [state.banner]));

	const sendBannerImpression = useMutation({
		mutationKey: [banner?.imageUrl ?? ""],
		mutationFn: async () => await postBannerImpression(banner),
		retry: 1,
	});

	useEffect(() => {
		if (banner?.bannerType !== "ladefuchs") {
			return;
		}
		if (!sendBannerImpression.isIdle) {
			return;
		}
		sendBannerImpression.mutateAsync();
	}, [banner]);

	const sendAppMetric = useMutation({
		mutationFn: async () => await postAppMetric(),
		retry: 1,
	});

	useEffect(() => {
		const handleAppStateChange = (nextAppState: AppStateStatus) => {
			if (nextAppState !== "active") {
				return;
			}
			if (!sendAppMetric.isIdle) {
				return;
			}
			setTimeout(async () => {
				await sendAppMetric.mutateAsync();
				sendAppMetric.reset();
			}, 1300);
		};
		const subscription = AppState.addEventListener(
			"change",
			handleAppStateChange,
		);

		return () => {
			subscription.remove();
		};
	}, [sendAppMetric]);
}
