import { SafeAreaView, TouchableHighlight, Linking, Text } from "react-native";
import { colors } from "../theme";

export function AffiliateButton({
	link,
}: {
	link: string | null;
}): JSX.Element {
	if (!link) {
		return <></>;
	}
	return (
		<SafeAreaView style={{ marginTop: "auto" }}>
			<TouchableHighlight
				style={{
					backgroundColor: colors.ladefuchsOrange,
					padding: 12,
					borderRadius: 12,
				}}
				onPress={() => Linking.openURL(link)}
				underlayColor="#fff"
			>
				<Text
					style={{
						color: "#fff",
						textAlign: "center",
						fontSize: 24,
						fontWeight: "bold",
					}}
				>
					{"Hol dir die Karte!".toLocaleUpperCase()}
				</Text>
			</TouchableHighlight>
		</SafeAreaView>
	);
}
