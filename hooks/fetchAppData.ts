import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAllChargeConditions, getBanners } from "../functions/api";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../state/state";

export function useFetchAppData(): void {
	const [setAppData, setAppError, operators, setBanners, ladefuchsBanners] =
		useAppStore(
			useShallow((state) => [
				state.setChargeConditions,
				state.setAppError,
				state.operators,
				state.setBanners,
				state.ladefuchsBanners,
			])
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

	const bannerQuery = useQuery({
		queryKey: ["appBanners"],
		retry: 3,
		queryFn: async () => {
			return await getBanners({ writeToCache: !ladefuchsBanners.length });
		},
	});

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
