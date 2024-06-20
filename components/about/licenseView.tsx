import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../theme";
import Constants from "expo-constants";

const expoVersion = Constants.expoConfig.version;

export function AppFooter() {
	return (
		<View style={styles.headerView}>
			<Text style={styles.headLine}>DRITTLIZENZEN</Text>
			<Text style={styles.sponsorText}>Momentan keine!</Text>
			<Text style={styles.sponsorText}>
				Handgefertigt aus ❤️ zur Elektromobilität in 👑 Aachen, 🥨
				Fürstenfeldbruck, 🏰 Ludwigsburg, ⚒️ Ahlen und 🐻 Berlin
			</Text>
			<Text style={styles.sponsorText}>
				Ladefuchs Version: {expoVersion}
			</Text>
		</View>
	);
}
