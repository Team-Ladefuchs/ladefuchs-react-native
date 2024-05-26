import { SafeAreaView, Linking, Text, TouchableOpacity } from "react-native";
import { colors } from "../../theme";

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
			<TouchableOpacity
				activeOpacity={0.8}
				style={{
					backgroundColor: colors.ladefuchsOrange,
					padding: 12,
					borderRadius: 12,
				}}
				onPress={() => Linking.openURL(link)}
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
			</TouchableOpacity>
		</SafeAreaView>
	);
}
