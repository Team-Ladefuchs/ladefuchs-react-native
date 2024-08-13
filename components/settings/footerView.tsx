import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../theme";
import Constants from "expo-constants";
import { scale } from "react-native-size-matters";

const expoVersion = Constants.expoConfig.version;

export function AppFooter() {
	return (
		<View style={{ marginTop: scale(10), paddingBottom: scale(22) }}>
			<Text style={styles.italicText}>
				Handgefertigt aus ❤️ zur Elektromobilität in 👑 Aachen, 🥨
				Fürstenfeldbruck, 🏰 Ludwigsburg, ⚒️ Ahlen und 🐻 Berlin
			</Text>
			<Text style={styles.italicText}>
				Ladefuchs Version: {expoVersion}
			</Text>
		</View>
	);
}
