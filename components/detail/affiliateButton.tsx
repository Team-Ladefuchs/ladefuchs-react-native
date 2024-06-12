import {
	SafeAreaView,
	Linking,
	Text,
	TouchableOpacity,
	StyleSheet,
	Platform,
} from "react-native";
import { colors } from "../../theme";
import React from "react";

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
				style={styles.button}
				onPress={async () => await Linking.openURL(link)}
			>
				<Text style={styles.buttonText}>
					{"Hol dir die Karte!".toLocaleUpperCase()}
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	button: {
		...Platform.select({
			android: {
				padding: 9,
				marginBottom: 16,
			},
			default: {
				padding: 12,
				marginBottom: 12,
			},
		}),
		backgroundColor: colors.ladefuchsOrange,
		borderRadius: 12,
	},
	buttonText: {
		...Platform.select({
			android: {
				fontSize: 20,
			},
			default: {
				fontSize: 24,
			},
		}),
		color: "#fff",
		textAlign: "center",
		fontWeight: "bold",
	},
});
