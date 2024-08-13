import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../theme";

export function Illustration() {
	return (
		<View>
			<Text style={styles.headLine}>ILLUFÜCHSE</Text>
			<Text style={styles.italicText}>
				Illustriert mit ❤️ von Aga und Marcel-André
			</Text>
		</View>
	);
}
