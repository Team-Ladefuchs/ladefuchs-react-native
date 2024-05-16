import { View, Text } from "react-native";
import { colors } from "../theme";

export function DetailScreen() {
	return (
		<View
			style={{
				backgroundColor: colors.ladefuchsLightBackground,
				height: "100%",
			}}
		>
			<Text
				style={{
					fontSize: 40,
					paddingHorizontal: 32,
					paddingTop: 64,
					textAlign: "center",
				}}
			>
				Malik: "Gute Nacht"
			</Text>
		</View>
	);
}
