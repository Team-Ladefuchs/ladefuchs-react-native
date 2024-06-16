import { create } from "zustand";
import { Banner, BannerType, LadefuchsBanner } from "../types/banner";
import { TariffCondition } from "../types/conditions";
import { Operator } from "../types/operator";
import { Tariff } from "../types/tariff";
import { shuffleAndPickOne } from "../functions/util";

export type AppData = ChargeConditionData & BannerData;

export interface ChargeConditionData {
	operators: Operator[];
	tariffs: Map<string, Tariff>;
	chargingConditions: Map<string, TariffCondition[]>;
}

export interface BannerData {
	ladefuchsBanners: LadefuchsBanner[];
	bannerType: BannerType;
	chargePriceAdBanner?: Banner | null;
}

export interface AppState extends AppData {
	setChargeConditions: (appData: ChargeConditionData) => Promise<void>;
	operatorId: string;
	setOperatorId: (id: string) => void;
	tariffConditions: TariffCondition[];
	setTariffConditions: (tariffs: TariffCondition[]) => void;
	banner: Banner | null;
	setBanners: (data: BannerData) => void;
	appError: Error | null;
	setAppError: (value: Error | null) => void;
	reloadBanner: () => void;
}

export const useAppStore = create<AppState>((set, get) => {
	let ladefuchsBannerIndex = 0;
	return {
		setChargeConditions: async (appData): Promise<void> => {
			const { operators } = appData;
			let { operatorId } = get();
			if (!operatorId) {
				operatorId = operators[0]?.identifier ?? "";
			}
			if (operators) {
				set((state) => ({
					...state,
					...appData,
					operatorId,
				}));
			}
		},
		setBanners(data) {
			const { bannerType, ladefuchsBanners, chargePriceAdBanner } = data;
			set((state) => ({
				...state,
				banner: selectLadefuchsBanner({
					...state,
					ladefuchsBanners,
					chargePriceAdBanner,
				}),
				bannerType,
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
		appError: null,
		setAppError: (appError) => {
			set((state) => ({ ...state, appError }));
		},
		reloadBanner: () => {
			const { banner, ladefuchsBanners } = get();
			if (ladefuchsBanners.length < 2) {
				return;
			}
			let newBanner: Banner | null = null;
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
	chargePriceAdBanner: Banner | null | undefined;
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
	const [banner] = shuffleAndPickOne(ladefuchsBanners);
	if (!banner) {
		return null;
	}
	return {
		bannerType: "ladefuchs",
		affiliateLinkUrl: banner.affiliateLinkUrl,
		imageUrl: banner.imageUrl,
	};
}
