// todo add the rest
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import i18n from "./localization";
import { type Tariff } from "./types/tariff";
import { type Operator } from "./types/operator";
import { type TariffCondition } from "./types/conditions";
import { type RouteProp } from "@react-navigation/native";

export const appRoutes = {
	home: {
		key: "home",
	},
	onBoarding: {
		key: "onBoarding",
	},
	customerOperator: {
		title: i18n.t("ladesaeulen"),
		key: "customerOperator",
	},
	customTariffs: {
		title: i18n.t("ladetarife"),
		key: "customTariffs",
	},
	settingsStack: {
		key: "settingsStack",
	},
	detailScreen: {
		key: "tariffDetailView",
	},
	settings: {
		title: i18n.t("einstellungen"),
		key: "settings",
	},
	feedback: {
		title: "Feedback",
		key: "feedback",
	},
	license: {
		title: i18n.t("lizenzen"),
		key: "license",
	},
} as const;

type MainStackParamList = {
	[appRoutes.home.key]: undefined;
	[appRoutes.onBoarding.key]: undefined;
};

export type ModalStackParamList = {
	[appRoutes.settingsStack.key]: undefined;
	[appRoutes.feedback.key]: {
		tariff: Tariff;
		acTariffCondition: TariffCondition | null | undefined;
		dcTariffCondition: TariffCondition | null | undefined;
		operator: Operator;
	};
	[appRoutes.detailScreen.key]: {
		tariff: Tariff;
		tariffCondition: TariffCondition;
	};
};

export type OnboardingScreenNavigationProp = NativeStackNavigationProp<
	MainStackParamList,
	typeof appRoutes.onBoarding.key
>;

export type HomeScreenNavigationProp = NativeStackNavigationProp<
	MainStackParamList,
	typeof appRoutes.home.key
>;

export type SettingsScreenNavigationProp = NativeStackNavigationProp<
	ModalStackParamList,
	typeof appRoutes.settingsStack.key
>;

export type FeedbackScreenNavigationProp = NativeStackNavigationProp<
	ModalStackParamList,
	typeof appRoutes.feedback.key
>;

export type FeedbackScreenRouteParams = RouteProp<
	ModalStackParamList,
	typeof appRoutes.feedback.key
>;

export type TariffDetailScreenNavigationProp = NativeStackNavigationProp<
	ModalStackParamList,
	typeof appRoutes.detailScreen.key
>;

export type TariffDetailScreenNavigationParams = RouteProp<
	ModalStackParamList,
	typeof appRoutes.detailScreen.key
>;
