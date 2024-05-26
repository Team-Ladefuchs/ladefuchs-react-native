import { create } from "zustand";
import { AppBanner, LadefuchsBanner } from "../types/banner";
import { TariffCondition } from "../types/conditions";
import { Operator } from "../types/operator";
import { Tariff } from "../types/tariff";
import { pickRandom, repeatNTimes } from "../functions/util";

export interface AppData {
	operators: Operator[];
	tariffs: Map<string, Tariff>;
	ladefuchsBanners: LadefuchsBanner[];
	chargingConditions: Map<string, TariffCondition[]>;
}

export interface AppState extends AppData {
	init: (data: AppData) => void;
	operatorId: string;
	setOperatorId: (id: string) => void;
	tariffConditions: TariffCondition[];
	setTariffConditions: (tariffs: TariffCondition[]) => void;
	banner: AppBanner | null;
}

export const useAppStore = create<AppState>((set) => {
	return {
		init: (data: AppData): void => {
			const operatorId = data.operators[0]?.identifier ?? "";
			if (data.operators)
				set((state) => ({
					...state,
					...data,
					operatorId,
					banner: selectBanner(data.ladefuchsBanners),
				}));
		},
		operatorId: "",
		setOperatorId: (operatorId) =>
			set((state) => ({ ...state, operatorId })),
		tariffConditions: [],
		setTariffConditions: (tariffConditions: TariffCondition[]) => {
			set((state) => ({ ...state, tariffConditions }));
		},
		tariffs: new Map(),
		operators: [],
		ladefuchsBanners: [],
		chargingConditions: new Map(),
		banner: null,
	};
});

function selectBanner(ladefuchsBanners: LadefuchsBanner[] | null): AppBanner {
	if (!ladefuchsBanners) {
		return null;
	}
	const bannerIds = ladefuchsBanners
		.flatMap((item) => repeatNTimes(item, item.frequency))
		.shuffle();
	const banner = pickRandom(bannerIds);
	return {
		affiliateLinkUrl: banner.affiliateLinkUrl,
		imageUrl: banner.imageUrl,
	};
}
