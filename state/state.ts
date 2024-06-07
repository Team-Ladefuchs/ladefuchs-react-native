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
	initAppData: (data: AppData) => Promise<void>;
	operatorId: string;
	setOperatorId: (id: string) => void;
	tariffConditions: TariffCondition[];
	setTariffConditions: (tariffs: TariffCondition[]) => void;
	banner: Banner | null;
	reloadBanner: () => void; // Hinzugefügte Methode zum Neuladen des Banners
}

export const useAppStore = create<AppState>((set, get) => {
	let ladefuchsBannerIndex = 0;
	return {
		initAppData: async (data: AppData): Promise<void> => {
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
		reloadBanner: () => {
			const { banner, ladefuchsBanners } = get();
			if (ladefuchsBanners.length < 2) {
				return;
			}
			let newBanner = undefined;
			do {
				ladefuchsBannerIndex =
					(ladefuchsBannerIndex + 1) % ladefuchsBanners.length;
				newBanner = ladefuchsBanners[ladefuchsBannerIndex];
			} while (newBanner.imageUrl === banner?.imageUrl);
			set((state) => ({ ...state, banner: newBanner }));
		},
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
