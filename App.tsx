import React, { useEffect, useState } from "react";
import { AppState, AppStateStatus, Platform, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
	StackNavigationOptions,
	createStackNavigator,
} from "@react-navigation/stack";

import { SettingsScreen } from "./screens/settings";
import { HomeScreen } from "./screens/home";
import { colors } from "./theme";
import { AppHeader } from "./components/header/appHeader";
import {
	QueryClient,
	QueryClientProvider,
	focusManager,
} from "@tanstack/react-query";

import { TariffDetailView } from "./screens/tariffDetailView";
import { Tariff } from "./types/tariff";
import { CloseButton } from "./components/header/closeButton";
import { DetailHeader } from "./components/detail/detailHeader";

import { useQueryAppData } from "./hooks/useQueryAppData";
import { useCustomFonts } from "./hooks/useCustomFonts";
import { scale } from "react-native-size-matters";
import { FeedbackView } from "./screens/feedbackView";
import { ToastNotification } from "./components/detail/feedbackView/toastNotification";
import { useAopMetrics } from "./hooks/useAppMetrics";
import { LicenseView } from "./screens/licenseView";
import { OperatorList } from "./screens/operatorList";
import { TariffList } from "./screens/tariffList";
import { appRoutes } from "./appRoutes";
import i18n from "./translations/translations";
import { OnboardingView } from "./screens/onboardingView";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { InfoModal } from "./components/InfoModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiUrl, authHeader } from "./functions/api/base";

type InfoContentSection =
	| { type: "headline"; text: string }
	| { type: "text"; text: string }
	| { type: "link"; text: string; url: string };

const INFO_MODAL_INTERVAL_MS = 24 * 60 * 60 * 1000;

const queryClient = new QueryClient();
const RootStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const MainStack = createStackNavigator<{ [appRoutes.home.key]: undefined }>();

export default function App(): JSX.Element {
	return (
		<QueryClientProvider client={queryClient}>
			<SafeAreaProvider>
				<AppWrapper />
				<ToastNotification />
			</SafeAreaProvider>
		</QueryClientProvider>
	);
}

function AppWrapper(): JSX.Element {
	const fontLoaded = useCustomFonts();
	const [showInfoModal, setShowInfoModal] = useState(false);
	const [infoContent, setInfoContent] = useState<InfoContentSection[]>([]);

	useEffect(() => {
		const checkAndFetchModal = async () => {
			try {
				const response = await fetch(`${apiUrl}/v3/announcement`, {
					headers: {
						...authHeader.headers,
						Accept: "application/json",
					},
				});
				if (!response.ok) {
					// Datei existiert nicht oder Fehler
					setShowInfoModal(false);
					setInfoContent([]);
					return;
				}
				const data = await response.json();
				if (!data.content || data.content.length === 0) {
					// Datei existiert, aber kein Inhalt
					setShowInfoModal(false);
					setInfoContent([]);
					return;
				}
				// Datei existiert und hat Inhalt
				setInfoContent(data.content);

				const lastShown =
					await AsyncStorage.getItem("infoModalLastShown");
				const now = Date.now();
				if (
					!lastShown ||
					now - parseInt(lastShown, 10) > INFO_MODAL_INTERVAL_MS
				) {
					setShowInfoModal(true);
				}
			} catch {
				setShowInfoModal(false);
				setInfoContent([]);
			}
		};
		checkAndFetchModal();

		const handleAppStateChange = async (status: AppStateStatus) => {
			if (status === "active") {
				try {
					const response = await fetch(`${apiUrl}/v3/announcement`);
					if (!response.ok) {
						setShowInfoModal(false);
						setInfoContent([]);
						return;
					}
					const data = await response.json();
					if (!data.content || data.content.length === 0) {
						setShowInfoModal(false);
						setInfoContent([]);
						return;
					}
					setInfoContent(data.content);

					const lastShown =
						await AsyncStorage.getItem("infoModalLastShown");
					const now = Date.now();
					if (
						!lastShown ||
						now - parseInt(lastShown, 10) > INFO_MODAL_INTERVAL_MS
					) {
						setShowInfoModal(true);
					}
				} catch {
					setShowInfoModal(false);
					setInfoContent([]);
				}
			}
			onAppStateChange(status);
		};

		const subscription = AppState.addEventListener(
			"change",
			handleAppStateChange,
		);
		return () => {
			subscription.remove();
		};
	}, []);

	const handleCloseInfoModal = async () => {
		setShowInfoModal(false);
		await AsyncStorage.setItem("infoModalLastShown", Date.now().toString());
	};

	useQueryAppData();
	useAopMetrics();

	if (!fontLoaded) {
		return <View />;
	}

	return (
		<>
			<InfoModal
				visible={showInfoModal && infoContent.length > 0}
				onClose={handleCloseInfoModal}
				content={infoContent}
			/>
			<NavigationContainer>
				<RootStack.Navigator>
					<MainStack.Group screenOptions={{ presentation: "card" }}>
						<RootStack.Screen
							name={appRoutes.home.key}
							component={HomeScreen}
							options={() => ({
								header: () => <AppHeader />,
								headerStyle: {
									backgroundColor:
										colors.ladefuchsDarkBackground,
								},
								headerTintColor: colors.ladefuchsOrange,
							})}
						/>
						<RootStack.Screen
							name={appRoutes.onBoarding.key}
							component={OnboardingView}
							options={{ headerShown: false }}
						/>
					</MainStack.Group>

					<RootStack.Group screenOptions={{ presentation: "modal" }}>
						<RootStack.Screen
							name={appRoutes.detailScreen.key}
							component={TariffDetailView as any}
							options={({ navigation, route }: any) => ({
								headerBackTitleVisible: false,
								headerLeft: undefined,
								header: () => {
									const tariff = route.params[
										"tariff"
									] as Tariff;
									return (
										<DetailHeader
											tariff={tariff}
											navigation={navigation}
										/>
									);
								},
								headerRight: undefined,
								headerTitleStyle: { display: "none" },
							})}
						/>
						<RootStack.Screen
							name={appRoutes.feedback.key}
							component={FeedbackView}
							options={({ navigation }) =>
								modalHeader({
									navigation,
									title: appRoutes.feedback.title,
								})
							}
						/>
						<RootStack.Screen
							name={appRoutes.settingsStack.key}
							component={SettingsStackNavigator}
							options={{ headerShown: false }}
						/>
					</RootStack.Group>
				</RootStack.Navigator>
			</NavigationContainer>
		</>
	);
}

function SettingsStackNavigator(): JSX.Element {
	return (
		<SettingsStack.Navigator>
			<SettingsStack.Screen
				name={appRoutes.settings.key}
				component={SettingsScreen}
				options={({ navigation }) =>
					modalHeader({ navigation, title: appRoutes.settings.title })
				}
			/>
			<SettingsStack.Screen
				name={appRoutes.customerOperator.key}
				component={OperatorList}
				options={() =>
					normalHeader({ title: appRoutes.customerOperator.title })
				}
			/>
			<SettingsStack.Screen
				name={appRoutes.customTariffs.key}
				component={TariffList}
				options={() =>
					normalHeader({ title: appRoutes.customTariffs.title })
				}
			/>
			<SettingsStack.Screen
				name={appRoutes.license.key}
				component={LicenseView}
				options={() => normalHeader({ title: appRoutes.license.title })}
			/>
		</SettingsStack.Navigator>
	);
}

function onAppStateChange(status: AppStateStatus) {
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}

function normalHeader({ title }: { title: string }): StackNavigationOptions {
	return {
		headerBackTitle: i18n.t("back"),
		title,
		headerStyle: { backgroundColor: colors.ladefuchsDunklerBalken },
		headerTintColor: "#000",
	};
}

function modalHeader({
	navigation,
	title,
}: {
	navigation: { goBack: () => void };
	title: string;
}): StackNavigationOptions {
	return {
		headerBackTitleVisible: false,
		// @ts-ignore null works
		headerLeft: null,
		title,
		headerRight: () => (
			<CloseButton
				onPress={() => navigation.goBack()}
				style={{ marginRight: scale(16) }}
			/>
		),
		headerStyle: { backgroundColor: colors.ladefuchsDunklerBalken },
		headerTintColor: "#000",
	};
}
