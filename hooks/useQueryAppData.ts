import { useQueries } from "@tanstack/react-query";
import { useEffect } from "react";

import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../state/state";
import { getBanners } from "../functions/api/banner";
import { getAllChargeConditions } from "../functions/api/chargeCondition";

export function useQueryAppData() {
	const [
		setChargeConditions,
		setAppError,
		operators,
		setBanners,
		ladefuchsBanners,
	] = useAppStore(
		useShallow((state) => [
			state.setChargeConditions,
			state.setAppError,
			state.operators,
			state.setBanners,
			state.ladefuchsBanners,
		]),
	);

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
		,
	]);

	useEffect(() => {
		if (bannerQuery.data) {
			setBanners(bannerQuery.data);
		}
	}, [bannerQuery.data, setBanners]);

	return [allChargeConditionsQuery];
}
