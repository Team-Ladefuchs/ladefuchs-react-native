import { create } from "zustand";
import { Banner, BannerType, LadefuchsBanner } from "../types/banner";
import { TariffCondition } from "../types/conditions";
import { Operator } from "../types/operator";
import { Tariff } from "../types/tariff";
import { shuffleAndPickOne } from "../functions/util";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppData = ChargeConditionData & BannerData;

export interface ChargeConditionData {
	operators: Operator[];
	tariffs: Map<string, Tariff>;
	favoriteTariffIds: Set<string>;
	chargingConditions: Map<string, TariffCondition[]>;
}

export interface BannerData {
	ladefuchsBanners: LadefuchsBanner[];
	bannerType: BannerType;
	chargePriceAdBanner?: Banner | null;
}

export type OnBoardingState = "start" | "hide" | "init";

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
	isFavoriteTariffOnly: boolean;
	setisFavoriteTariffOnly: (value: boolean) => void;
	favoriteTariffIds: Set<string>;
	setFavoriteTariffIds: (ids: Set<string> | string[]) => void;
	showOnboarding: OnBoardingState;
	setOnboarding: (value: OnBoardingState) => void;
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
				set(() => ({
					...appData,
					favoriteTariffIds: appData.favoriteTariffIds ?? new Set(),
					operators: [...operators],
					operatorId,
				}));
			}
		},
		setBanners(data) {
			const { bannerType, ladefuchsBanners, chargePriceAdBanner } = data;
			set(() => ({
				ladefuchsBanners,
				chargePriceAdBanner,
				banner: selectLadefuchsBanner({
					ladefuchsBanners,
					chargePriceAdBanner,
				}),
				bannerType,
			}));
		},
		operatorId: "",
		setOperatorId: (operatorId) => {
			set(() => ({ operatorId }));
		},
		tariffConditions: [],
		setTariffConditions: (tariffConditions: TariffCondition[]) => {
			set(() => ({ tariffConditions }));
		},
		tariffs: new Map(),
		operators: [],
		ladefuchsBanners: [],
		chargingConditions: new Map(),
		bannerType: "ladefuchs",
		banner: null,
		appError: null,
		setAppError: (appError) => {
			set(() => ({ appError }));
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
			const appBanner = {
				...newBanner,
				bannerType: "ladefuchs",
			} satisfies Banner;
			set(() => ({ banner: appBanner }));
		},
		isFavoriteTariffOnly: false,
		setisFavoriteTariffOnly: (value: boolean) => {
			set(() => ({ isFavoriteTariffOnly: value }));
		},
		favoriteTariffIds: new Set<string>(),
		setFavoriteTariffIds: (ids: Set<string> | string[]) => {
			if (Array.isArray(ids)) {
				set(() => ({ favoriteTariffIds: new Set(ids) }));
			} else if (ids instanceof Set) {
				set(() => ({ favoriteTariffIds: ids }));
			}
		},
		showOnboarding: "init",
		setOnboarding: async (showOnboarding: OnBoardingState) => {
			set(() => ({ showOnboarding }));
		},
	};
});

export async function getBannerType(): Promise<BannerType> {
	const key = "bannerType";
	const ladefuchsValue = "ladefuchs";
	const chargePriceValue = "chargePrice";

	try {
		const storedValue = (await AsyncStorage.getItem(key)) ?? ladefuchsValue;
		const showChargePriceBanner = storedValue === chargePriceValue;
		if (showChargePriceBanner) {
			await AsyncStorage.setItem(key, ladefuchsValue);
			return chargePriceValue;
		} else {
			await AsyncStorage.setItem(key, chargePriceValue);
			return ladefuchsValue;
		}
	} catch {
		console.log("Could not get banner type from storage");
	}
	return ladefuchsValue;
}

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
		identifier: banner.identifier,
		bannerType: "ladefuchs",
		affiliateLinkUrl: banner.affiliateLinkUrl,
		imageUrl: banner.imageUrl,
	};
}
