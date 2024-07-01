import {
	SafeAreaView,
	Linking,
	Text,
	TouchableOpacity,
	Platform,
} from "react-native";
import { colors } from "../../theme";
import React from "react";
import { ScaledSheet } from "react-native-size-matters";

export function AffiliateButton({
	link,
}: {
	link: string | null | undefined;
}): JSX.Element {
	if (!link) {
		return <></>;
	}
	return (
		<SafeAreaView style={{ marginTop: "auto", marginHorizontal: 16 }}>
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

const styles = ScaledSheet.create({
	button: {
		...Platform.select({
			android: {
				marginBottom: "14@s",
				padding: "8@s",
			},
			default: {
				marginBottom: "1@s",
				padding: "9@s",
			},
		}),
		backgroundColor: colors.ladefuchsOrange,
		borderRadius: "12@s",
	},
	buttonText: {
		fontSize: "22@s",
		color: "#fff",
		textAlign: "center",
		fontWeight: "bold",
	},
});
