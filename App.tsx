import React, { JSX } from "react";
import { AppStateStatus, Platform, View } from "react-native";
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
import { useAnounncement } from "./hooks/useAnnoucement";

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

	const annoncement = useAnounncement();

	const handleCloseInfoModal = () => {
		annoncement.hideInfoContent();
	};

	useQueryAppData();
	useAopMetrics();

	if (!fontLoaded) {
		return <View />;
	}

	return (
		<>
			<InfoModal
				visible={annoncement.hasAnnouncement()}
				onClose={handleCloseInfoModal}
				content={annoncement.infoContent}
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
