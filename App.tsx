import React, { useEffect } from "react";
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
import { DetailScreen } from "./screens/detailView";
import { Tariff } from "./types/tariff";
import { CloseButton } from "./components/closButton";
import { DetailHeader } from "./components/detailScreen/detailHeader";
import { StatusBar, View } from "react-native";
import { useAppStore } from "./state/state";

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

	const { init } = useAppStore();

	useEffect(() => {
		if (!allApiData.data) {
			return;
		}
		init(allApiData.data);
	}, [init, allApiData.data]);

	if (allApiData.isPending || allApiData.error || !fontsLoaded) {
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
				<RootStack.Group screenOptions={{ presentation: "modal" }}>
					<RootStack.Screen
						component={DetailScreen}
						options={({ navigation, route }) => ({
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
				<RootStack.Group screenOptions={{ presentation: "modal" }}>
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
