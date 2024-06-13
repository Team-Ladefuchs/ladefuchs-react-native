import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";

import { AboutScreen } from "./screens/about";
import { HomeScreen } from "./screens/home";
import { colors } from "./theme";
import { AppHeader } from "./components/header/appHeader";
import {
	QueryClient,
	QueryClientProvider,
	focusManager,
	useQuery,
} from "@tanstack/react-query";
import { fetchAllChargeConditions } from "./functions/api";
import { DetailScreen } from "./screens/detailView";
import { Tariff } from "./types/tariff";
import { CloseButton } from "./components/header/closeButton";
import { DetailHeader } from "./components/detail/detailHeader";
import {
	AppState,
	AppStateStatus,
	Platform,
	StatusBar,
	View,
} from "react-native";
import { useAppStore } from "./state/state";
import { useShallow } from "zustand/react/shallow";

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
		</QueryClientProvider>
	);
}

function AppWrapper(): JSX.Element {
	const allApiData = useQuery({
		queryKey: ["AllApiData"],
		queryFn: async () => {
			return fetchAllChargeConditions();
		},
	});

	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			onAppStateChange
		);
		return () => subscription.remove();
	}, []);

	const [setAppData, setHasAppError] = useAppStore(
		useShallow((state) => [state.setAppData, state.setAppError])
	);
	useEffect(() => {
		setHasAppError(allApiData?.error);
		if (!allApiData.data) {
			return;
		}
		console.log("set app data");
		setAppData(allApiData.data);
	}, [allApiData.data, allApiData.error, setHasAppError]);

	const [fontsLoaded] = useFonts({
		Bitter: require("./assets/fonts/Bitter-Italic.ttf"),
		Roboto: require("./assets/fonts/Roboto-Bold.ttf"),
	});
	if (!fontsLoaded) {
		return <View></View>;
	}

	return (
		<NavigationContainer>
			<StatusBar barStyle="default" backgroundColor="#fff" />
			<RootStack.Navigator>
				<RootStack.Group>
					<RootStack.Screen
						name="Home"
						component={HomeScreen}
						options={({}) => ({
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
					style={{ marginRight: 16 }}
				/>
			);
		},
		headerStyle: {
			backgroundColor: colors.ladefuchsLightBackground,
		},
		headerTintColor: colors.ladefuchsOrange, // Farbe für den Header-Text
	};
}
