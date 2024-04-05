import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AboutScreen } from "./screens/about";
import { HomeScreen } from "./screens/home";
import { colors } from "./theme";
import { AppHeader } from "./components/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
	const Stack = createNativeStackNavigator();
	return (
		<QueryClientProvider client={queryClient}>
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
		</QueryClientProvider>
	);
}

const styles = StyleSheet.create({
	headerTitleContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	headerImage: {
		width: 62,
		height: 62,
		marginRight: 0,
		marginTop: -11,
	},
	headerTitle: {
		color: colors.ladefuchsOrange,
		fontSize: 18,
	},
});

export default App;
