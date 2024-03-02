import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function HomeScreen(props) {
	const navigation = useNavigation();
	return (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<Text>Home Screen 123</Text>
			<Button
				title="Go to About"
				onPress={() => navigation.navigate("About")}
			/>
			<Text>Props: {JSON.stringify(props)}</Text>
		</View>
	);
}
