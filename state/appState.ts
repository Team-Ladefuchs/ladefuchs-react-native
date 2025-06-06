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
	lastBannerChange: number;
}

export interface BannerData {
	ladefuchsBanners: LadefuchsBanner[];
	bannerType: BannerType;
}

export type OnBoardingState = "start" | "hide" | "init";

export type NetworkState = "offline" | "online";

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
	networkStatus: NetworkState;
	setNetworkState: (value: NetworkState) => void;
	isHapticEnabled: boolean;
	setHapticEnabled: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => {
	let ladefuchsBannerIndex = 0;
	const initialLastBannerChange = 0;
	return {
		lastBannerChange: initialLastBannerChange,
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
			const { bannerType, ladefuchsBanners } = data;
			const now = Date.now();
			const { lastBannerChange } = get();
			const delayedReload = 30 * 1000;

			if (
				lastBannerChange === 0 ||
				now - lastBannerChange >= delayedReload
			) {
				set(() => ({
					ladefuchsBanners,
					banner: selectLadefuchsBanner({
						ladefuchsBanners,
					}),
					bannerType,
					lastBannerChange: now,
				}));
			}
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
		networkStatus: "online",
		setNetworkState: (value: NetworkState) => {
			set(() => ({ networkStatus: value }));
		},
		setAppError: (appError) => {
			set(() => ({ appError }));
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
		isHapticEnabled: true,
		setHapticEnabled: (value: boolean) => {
			set(() => ({ isHapticEnabled: value }));
		},
	};
});

export async function getBannerType(): Promise<BannerType> {
	return "ladefuchs";
}

function selectLadefuchsBanner({
	ladefuchsBanners,
}: {
	ladefuchsBanners: LadefuchsBanner[] | null;
}): Banner | null {
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
