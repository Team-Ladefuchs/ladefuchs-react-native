import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { styles } from "../../theme";

export function Lizenzen() {
	return (
		<View style={styles.headerView}>
			<Text style={styles.headLine}>DRITTLIZENZEN</Text>
			<Text style={styles.sponsorText}>Momentan keine!</Text>
			<Text style={styles.sponsorText}>
				Handgefertigt aus ❤️ zur Elektromobilität in 👑 Aachen, 🥨
				Fürstenfeldbruck, 🏰 Ludwigsburg, ⚒️ Ahlen und 🐻 Berlin
			</Text>
			<Text style={styles.sponsorText}>Ladefuch Version 2.1.0</Text>
		</View>
	);
}
