import React from "react";
import {
	Text,
	Button,
	Image,
	StyleSheet,
	View,
	TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AboutScreen } from "./screens/about";
import { HomeScreen } from "./screens/home";
import { colors } from "./theme";
import { fonts } from "./theme";
import { AppHeader } from "./components/header";

function App() {
	const Stack = createNativeStackNavigator();
	return (
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
				<Stack.Screen name="Einstellungen" component={AboutScreen} />
			</Stack.Navigator>
		</NavigationContainer>
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
