// todo add the rest
import i18n from "./localization";
export const appRoutes = {
	customerOperator: {
		title: i18n.t('ladesaeulen'),
		key: "customerOperator",
	},
	customTariffs: {
		title: i18n.t('ladetarife'),
		key: "customTariffs",
	},
	settingsStack: {
		key: "SettingsStack",
	},
	detailScreen: {
		key: "tariffDetailView",
	},
	settings: {
		title: i18n.t('einstellungen'),
		key: "Einstellungen",
	},
	feedback: {
		title: "Feedback",
		key: "feedback",
	},

	eula: {
		title: i18n.t('lizenzen'),
		key: "eula",
	},
} as const;
