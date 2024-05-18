import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { styles } from "../../theme";

export function Teamfuchs() {
	return (
		<View style={styles.headerView}>
			<Text style={styles.headLine}>TEAMFUCHS</Text>
			<Text style={styles.headerText}>
				Wir sind schuld. Wirklich! Trotzdem alle Angaben ohne Gewähr.
			</Text>
		</View>
	);
}
