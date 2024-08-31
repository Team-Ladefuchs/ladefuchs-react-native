import { useQuery } from "@tanstack/react-query";
import { getAllChargeConditions } from "../functions/api/chargeCondition";

export function useQueryChargeConditions() {
	return [
		useQuery({
			queryKey: ["appChargeConditions"],
			retryDelay: 120,
			retry: 2,
			queryFn: async () => {
				return await getAllChargeConditions({
					writeToCache: false,
				});
			},
		}),
	];
}
