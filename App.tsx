import React, { useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { SettingsScreen } from "./screens/settings";
import { HomeScreen } from "./screens/home";
import { colors } from "./theme";
import { AppHeader } from "./components/header/appHeader";
import {
	QueryClient,
	QueryClientProvider,
	focusManager,
} from "@tanstack/react-query";

import { DetailScreen } from "./screens/detailView";
import { Tariff } from "./types/tariff";
import { CloseButton } from "./components/header/closeButton";
import { DetailHeader } from "./components/detail/detailHeader";

import { useFetchAppData } from "./hooks/usefetchAppData";
import { useCustomFonts } from "./hooks/useCustomFonts";
import { scale } from "react-native-size-matters";
import { FeedbackView } from "./screens/feedbackView";
import { ToastNotification } from "./components/detail/feedbackView/toastNotification";
import { useAopMetrics } from "./hooks/useAppMetrics";
import { ThirdPartyLicenses } from "./screens/thirdPartyLicenses";
import { OperatorListScreen } from "./screens/operatorListScreen";
import { TariffList } from "./screens/tariffList";
import { appRoutes } from "./appRoutes";
import { Impressum } from "./screens/impressum";

// Create query client and root stack navigator
const queryClient = new QueryClient();
const RootStack = createStackNavigator();
const EinstellungenStack = createStackNavigator();

// Main App component
export default function App(): JSX.Element {
	return (
		<QueryClientProvider client={queryClient}>
			<AppWrapper />
			<ToastNotification />
		</QueryClientProvider>
	);
}

function AppWrapper(): JSX.Element {
	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			onAppStateChange,
		);
		return () => {
			subscription.remove();
		};
	}, [onAppStateChange]);

	useFetchAppData();
	useAopMetrics();

	const fontLoaded = useCustomFonts();
	if (!fontLoaded) {
		return null;
	}

	return (
		<NavigationContainer>
			<RootStack.Navigator>
				<RootStack.Screen
					name="Home"
					component={HomeScreen}
					options={() => ({
						header: () => <AppHeader />,
						headerStyle: {
							backgroundColor: colors.ladefuchsDarkBackground,
						},
						headerTintColor: colors.ladefuchsOrange,
					})}
				/>
				<RootStack.Group screenOptions={{ presentation: "modal" }}>
					<RootStack.Screen
						name="detailScreen"
						component={DetailScreen}
						options={({ navigation, route }: any) => ({
							headerBackTitleVisible: false,
							headerLeft: null,
							header: () => {
								const tariff = route.params["tariff"] as Tariff;
								return (
									<DetailHeader
										tariff={tariff}
										navigation={navigation}
									/>
								);
							},
							headerRight: null,
							headerTitleStyle: {
								display: "none",
							},
						})}
					/>
					<RootStack.Screen
						name="Feedback"
						component={FeedbackView}
						options={modalHeader}
					/>
					<RootStack.Screen
						name="SettingsStack"
						component={SettingsStackNavigator}
						options={{ headerShown: false }}
					/>
				</RootStack.Group>
			</RootStack.Navigator>
		</NavigationContainer>
	);
}

// Define the Einstellungen stack with nested screens
function SettingsStackNavigator(): JSX.Element {
	return (
		<EinstellungenStack.Navigator>
			<EinstellungenStack.Screen
				name={appRoutes.settings.key}
				component={SettingsScreen}
				options={modalHeader}
			/>
			<EinstellungenStack.Screen
				name={appRoutes.customerOperator.key}
				component={OperatorListScreen}
				options={() => ({
					...normalHeader(),
					title: appRoutes.customerOperator.title,
				})}
			/>
			<EinstellungenStack.Screen
				name={appRoutes.customTariffs.key}
				component={TariffList}
				options={() => ({
					...normalHeader(),
					title: appRoutes.customTariffs.title,
				})}
			/>
			<EinstellungenStack.Screen
				name={appRoutes.impressum.key}
				component={Impressum}
				options={() => ({
					...normalHeader(),
					title: appRoutes.impressum.title,
				})}
			/>
			<EinstellungenStack.Screen
				name={appRoutes.eula.title}
				component={ThirdPartyLicenses}
				options={normalHeader}
			/>
		</EinstellungenStack.Navigator>
	);
}

function onAppStateChange(status: AppStateStatus) {
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}

function normalHeader() {
	return {
		headerBackTitle: "Zurück",
		headerStyle: {
			backgroundColor: colors.ladefuchsDunklerBalken,
		},
		headerTintColor: colors.ladefuchsOrange, // Farbe für den Header-Text
	};
}

function modalHeader({ navigation }: { navigation: { goBack: () => void } }) {
	return {
		headerBackTitleVisible: false,
		headerLeft: null,
		headerRight: () => (
			<CloseButton
				onPress={() => navigation.goBack()}
				style={{ marginRight: scale(16) }}
			/>
		),
		headerStyle: {
			backgroundColor: colors.ladefuchsDunklerBalken,
		},
		headerTintColor: colors.ladefuchsOrange, // Farbe für den Header-Text
	};
}
