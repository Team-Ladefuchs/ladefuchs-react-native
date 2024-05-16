import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { Svg, G, Path } from "react-native-svg";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";

import { AboutScreen } from "./screens/about";
import { HomeScreen } from "./screens/home";
import { colors } from "./theme";
import { AppHeader } from "./components/header";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { fetchAllApiData } from "./functions/api";
import { AppStateProvider } from "./contexts/appStateContext";
import { DetailScreen } from "./screens/detailView";
import { Tariff } from "./types/tariff";

const queryClient = new QueryClient();

function App() {
	const Stack = createNativeStackNavigator();
	return (
		<QueryClientProvider client={queryClient}>
			<AppWrapper Stack={Stack} />
		</QueryClientProvider>
	);
}
const RootStack = createStackNavigator();

function AppWrapper({ Stack }): JSX.Element {
	const allApiData = useQuery({
		queryKey: ["AllApiData"],
		queryFn: async () => {
			return await fetchAllApiData();
		},
	});
	if (allApiData.isPending || allApiData.error) {
		return null;
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
										colors.ladefuchsDarkBackground, // Verwendung der Ladefuchs Farbe für den Header-Hintergrund
								},
								headerTintColor: colors.ladefuchsOrange, // Farbe für den Header-Text
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
										<View
											style={{
												width: "100%",
												display: "flex",
												flexDirection: "row",
												paddingVertical: 16,
												paddingHorizontal: 16,
												backgroundColor:
													colors.ladefuchsDunklerBalken,
												borderBottomWidth: 0.5,
												borderBottomColor:
													colors.ladefuchsLightGrayBackground,
											}}
										>
											<View
												style={{
													flex: 1,
													columnGap: 10,
												}}
											>
												<Text
													style={{
														fontSize: 23,
														fontWeight: "bold",
													}}
												>
													{tariff.name}
												</Text>
												<Text
													style={{
														fontSize: 18,
														fontWeight: "bold",
													}}
												>
													{tariff.providerName}
												</Text>
											</View>
											<View>
												<AppHeaderCloseButton
													onPress={() =>
														navigation.goBack()
													}
												/>
											</View>
										</View>
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
							options={modelHeader}
							component={AboutScreen}
						/>
					</RootStack.Group>
				</RootStack.Navigator>
			</NavigationContainer>
		</AppStateProvider>
	);
}

function AppHeaderCloseButton({ onPress }) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				marginRight: 16,
				marginTop: 3,
				borderRadius: 100,
				backgroundColor: colors.ladefuchsDarkGrayBackground,
				padding: 6,
			}}
		>
			<Svg width={14} height={14} viewBox="0 0 320 512">
				<Path
					fill={colors.ladefuchsLightBackground}
					d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"
				/>
			</Svg>
		</TouchableOpacity>
	);
}

function modelHeader({ navigation }) {
	return {
		headerBackTitleVisible: false,
		headerLeft: null,
		headerRight: () => {
			return <AppHeaderCloseButton onPress={() => navigation.goBack()} />;
		},
		headerStyle: {
			backgroundColor: colors.ladefuchsLightBackground, // Verwendung der Ladefuchs Farbe für den Header-Hintergrund
		},
		headerTintColor: colors.ladefuchsOrange, // Farbe für den Header-Text
	};
}

export default App;
