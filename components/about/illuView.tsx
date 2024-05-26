import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../theme";

export function Illustration() {
	return (
		<View style={styles.headerView}>
			<Text style={styles.headLine}>ILLUFÜCHSE</Text>
			<Text style={styles.sponsorText}>
				Illustriert mit ❤️ von Aga und Marcel-André
			</Text>
		</View>
	);
}
