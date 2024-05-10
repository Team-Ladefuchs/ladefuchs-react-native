import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AboutScreen } from "./screens/about";
import { HomeScreen } from "./screens/home";
import { colors } from "./theme";
import { AppHeader } from "./components/header";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { AppDataProvider } from "./contexts/appDataContext";
import { fetchAllApiData } from "./functions/api";

const queryClient = new QueryClient();

function App() {
	const Stack = createNativeStackNavigator();
	return (
		<QueryClientProvider client={queryClient}>
			<AppWrapper Stack={Stack} />
		</QueryClientProvider>
	);
}

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
		<AppDataProvider value={allApiData.data}>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name="Home"
						component={HomeScreen}
						options={({ navigation, route }) => ({
							header: () => {
								return <AppHeader />;
							},

							headerStyle: {
								backgroundColor: colors.background, // Verwendung der Ladefuchs Farbe für den Header-Hintergrund
							},
							headerTintColor: colors.ladefuchsOrange, // Farbe für den Header-Text
						})}
					/>
					<Stack.Screen
						name="Einstellungen"
						component={AboutScreen}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</AppDataProvider>
	);
}

export default App;
