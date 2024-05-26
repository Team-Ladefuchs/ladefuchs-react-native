import { create } from "zustand";
import { Banner, BannerType, LadefuchsBanner } from "../types/banner";
import { TariffCondition } from "../types/conditions";
import { Operator } from "../types/operator";
import { Tariff } from "../types/tariff";
import { pickRandom, repeatNTimes } from "../functions/util";

export interface AppData {
	operators: Operator[];
	tariffs: Map<string, Tariff>;
	ladefuchsBanners: LadefuchsBanner[];
	chargePriceAdBanner?: Banner | null;
	bannerType: BannerType;
	chargingConditions: Map<string, TariffCondition[]>;
}

export interface AppState extends AppData {
	init: (data: AppData) => Promise<void>;
	operatorId: string;
	setOperatorId: (id: string) => void;
	tariffConditions: TariffCondition[];
	setTariffConditions: (tariffs: TariffCondition[]) => void;
	banner: Banner | null;
}

export const useAppStore = create<AppState>((set) => {
	return {
		init: async (data: AppData): Promise<void> => {
			const {
				operators,
				ladefuchsBanners,
				chargePriceAdBanner,
				bannerType,
			} = data;
			const operatorId = operators[0]?.identifier ?? "";
			if (data.operators)
				set((state) => ({
					...state,
					...data,
					operatorId,
					bannerType,
					banner: selectLadefuchsBanner({
						ladefuchsBanners,
						chargePriceAdBanner,
					}),
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
		bannerType: "ladefuchs",
		banner: null,
	};
});

function selectLadefuchsBanner({
	ladefuchsBanners,
	chargePriceAdBanner,
}: {
	ladefuchsBanners: LadefuchsBanner[] | null;
	chargePriceAdBanner: Banner;
}): Banner | null {
	if (chargePriceAdBanner) {
		return {
			...chargePriceAdBanner,
			bannerType: "chargePrice",
		};
	}
	if (!ladefuchsBanners) {
		return null;
	}
	const bannerIds = ladefuchsBanners
		.flatMap((item) => repeatNTimes(item, item.frequency))
		.shuffle();
	const banner = pickRandom(bannerIds);
	return {
		bannerType: "ladefuchs",
		affiliateLinkUrl: banner.affiliateLinkUrl,
		imageUrl: banner.imageUrl,
	};
}
