import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";

import { createStackNavigator } from "@react-navigation/stack";

import { AboutScreen } from "./screens/about";
import { HomeScreen } from "./screens/home";
import { colors } from "./theme";
import { AppHeader } from "./components/appheader";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { fetchAllApiData } from "./functions/api";
import { AppStateProvider } from "./contexts/appStateContext";
import { DetailScreen } from "./screens/detailView";
import { Tariff } from "./types/tariff";
import { CloseButton } from "./components/closButton";
import { DetailHeader } from "./components/detailScreen/detailHeader";
import { View } from "react-native";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AppWrapper />
		</QueryClientProvider>
	);
}

const RootStack = createStackNavigator();

function AppWrapper(): JSX.Element {
	const allApiData = useQuery({
		queryKey: ["AllApiData"],
		queryFn: async () => {
			return await fetchAllApiData();
		},
	});

	const [fontsLoaded] = useFonts({
		Bitter: require("./assets/fonts/Bitter-Italic.ttf"),
		Roboto: require("./assets/fonts/Roboto-Bold.ttf"),
	});

	if (allApiData.isPending || allApiData.error || !fontsLoaded) {
		return <View></View>;
	}
	return (
		<AppStateProvider value={allApiData.data}>
			<NavigationContainer>
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
									backgroundColor:
										colors.ladefuchsDarkBackground,
								},
								headerTintColor: colors.ladefuchsOrange,
							})}
						/>
					</RootStack.Group>
					<RootStack.Group screenOptions={{ presentation: "modal" }}>
						<RootStack.Screen
							component={DetailScreen}
							options={({ navigation, route }) => ({
								headerBackTitleVisible: false,
								headerLeft: null,
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
								headerRight: null,
								headerTitleStyle: {
									display: "none",
								},
							})}
							name="detailScreen"
						/>
					</RootStack.Group>
					<RootStack.Group screenOptions={{ presentation: "modal" }}>
						<RootStack.Screen
							name="Einstellungen"
							options={modalHeader}
							component={AboutScreen}
						/>
					</RootStack.Group>
				</RootStack.Navigator>
			</NavigationContainer>
		</AppStateProvider>
	);
}

function modalHeader({ navigation }) {
	return {
		headerBackTitleVisible: false,
		headerLeft: null,
		headerRight: () => {
			return (
				<View style={{ marginRight: 16 }}>
					<CloseButton onPress={() => navigation.goBack()} />
				</View>
			);
		},
		headerStyle: {
			backgroundColor: colors.ladefuchsLightBackground,
		},
		headerTintColor: colors.ladefuchsOrange, // Farbe für den Header-Text
	};
}

export default App;
