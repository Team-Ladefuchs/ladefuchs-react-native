import { useQueries, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useShallow } from "zustand/react/shallow";
import { OnBoardingState, useAppStore } from "../state/state";
import { getBanners } from "../functions/api/banner";
import { getAllChargeConditions } from "../functions/api/chargeCondition";
import { getFirstOnboarding } from "../functions/storage/onboarding";

export function useQueryAppData() {
	const [
		setChargeConditions,
		setAppError,
		operators,
		setBanners,
		ladefuchsBanners,
		setShowOnboarding,
	] = useAppStore(
		useShallow((state) => [
			state.setChargeConditions,
			state.setAppError,
			state.operators,
			state.setBanners,
			state.ladefuchsBanners,
			state.setOnboarding,
		]),
	);

	const onBoardingQuery = useQuery({
		queryKey: ["showOnBoarding"],
		queryFn: async (): Promise<OnBoardingState> => {
			const value = await getFirstOnboarding();
			return value ? "start" : "hide";
		},
	});

	useEffect(() => {
		if (!onBoardingQuery.data) {
			return;
		}
		setShowOnboarding(onBoardingQuery.data);
	}, [onBoardingQuery.data]);

	const [allChargeConditionsQuery, bannerQuery] = useQueries({
		queries: [
			{
				queryKey: ["appChargeConditions"],
				retryDelay: 100,
				retry: 2,
				queryFn: async () => {
					return await getAllChargeConditions({
						writeToCache: !operators.length,
					});
				},
			},
			{
				queryKey: ["appBanners"],
				retryDelay: 160,
				retry: 2,
				queryFn: async () => {
					return await getBanners({
						writeToCache: !ladefuchsBanners.length,
					});
				},
			},
		],
	});

	useEffect(() => {
		setAppError(allChargeConditionsQuery?.error);

		if (allChargeConditionsQuery.data) {
			setChargeConditions(allChargeConditionsQuery.data);
		}
	}, [
		allChargeConditionsQuery.data,
		allChargeConditionsQuery.error,
		setAppError,
		setChargeConditions,
	]);

	useEffect(() => {
		if (bannerQuery.data) {
			setBanners(bannerQuery.data);
		}
	}, [bannerQuery.data, setBanners]);

	return [allChargeConditionsQuery];
}
