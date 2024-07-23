import React, { useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AboutScreen } from "./screens/about";
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

import { useFetchAppData } from "./hooks/fetchAppData";
import { useCustomFonts } from "./hooks/customFont";
import { scale } from "react-native-size-matters";
import { FeedbackView } from "./screens/feedbackView";
import { ToastNotification } from "./components/detail/feedbackView/toastNotification";
import {CPOView} from "./screens/cpoView";
import {MSPView} from "./screens/mspView";
import {LicenseView} from "./screens/thirdpartyLicenses";

const queryClient = new QueryClient();
const RootStack = createStackNavigator();

function onAppStateChange(status: AppStateStatus) {
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}

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

	const fontLoaded = useCustomFonts();
	if (!fontLoaded) {
		return null;
	}

	return (
		<NavigationContainer>
			<RootStack.Navigator>
				<RootStack.Group>
					<RootStack.Screen
						name="Home"
						component={HomeScreen}
						options={() => ({
							header: () => {
								return <AppHeader />;
							},
							headerStyle: {
								backgroundColor: colors.ladefuchsDarkBackground,
							},
							headerTintColor: colors.ladefuchsOrange,
						})}
					/>
				</RootStack.Group>
				<RootStack.Group
					screenOptions={{
						presentation: "modal",
					}}
				>
					<RootStack.Screen
						component={DetailScreen}
						options={({ navigation, route }: any): object => ({
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
						name="detailScreen"
					/>
				</RootStack.Group>
				<RootStack.Group
					screenOptions={{
						presentation: "modal",
					}}
				>
					<RootStack.Screen
						name="Einstellungen"
						options={modalHeader}
						component={AboutScreen}
					/>
				</RootStack.Group>
				<RootStack.Group
					screenOptions={{
						presentation: "modal",
					}}
				>
					<RootStack.Screen
						name="Feedback"
						options={modalHeader}
						component={FeedbackView}
					/>
				</RootStack.Group>
				<RootStack.Group
					screenOptions={{
						presentation: "modal",
					}}
				>
					<RootStack.Screen
						name="Meine Stromanbieter"
						options={modalHeader}
						component={CPOView}
					/>
				</RootStack.Group>
				<RootStack.Group
					screenOptions={{
						presentation: "modal",
					}}
				>
					<RootStack.Screen
						name="Meine Ladetarife"
						options={modalHeader}
						component={MSPView}
					/>
				</RootStack.Group>
				<RootStack.Group
					screenOptions={{
						presentation: "modal",
					}}
				>
					<RootStack.Screen
						name="Drittlizenzen"
						options={modalHeader}
						component={LicenseView}
					/>
				</RootStack.Group>
			</RootStack.Navigator>
		</NavigationContainer>
	);
}

function modalHeader({
	navigation,
}: {
	navigation: { goBack: () => void };
}): object {
	return {
		headerBackTitleVisible: false,
		headerLeft: null,
		headerRight: () => {
			return (
				<CloseButton
					onPress={() => navigation.goBack()}
					style={{ marginRight: scale(16) }}
				/>
			);
		},
		headerStyle: {
			backgroundColor: colors.ladefuchsLightBackground,
		},
		headerTintColor: colors.ladefuchsOrange, // Farbe für den Header-Text
	};
}
