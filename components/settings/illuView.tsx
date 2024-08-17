import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../theme";
import { Line } from "./line";
import { scale } from "react-native-size-matters";

export function Illustration() {
	return (
		<View>
			<Text style={styles.headLine}>ILLUFÜCHSE</Text>
			<Text style={styles.italicText}>
				Illustriert mit ❤️ von Aga und Marcel-André
			</Text>
			<Line style={{ marginTop: scale(16) }} />
		</View>
	);
}
