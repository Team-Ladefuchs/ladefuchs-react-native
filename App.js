import { Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AboutScreen } from "./screens/about";
import { HomeScreen } from "./screens/home";

function App() {
	const Stack = createNativeStackNavigator();
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="Home"
					component={HomeScreen}
					options={({ navigation, route }) => ({
						headerTitle: "Ladefuchs",
						// Add a placeholder button without the `onPress` to avoid flicker
						headerRight: () => (
							<Button
								title="About"
								onPress={() => navigation.navigate("About")}
							/>
						),
					})}
				/>
				<Stack.Screen name="About" component={AboutScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
