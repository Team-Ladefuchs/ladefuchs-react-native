import React from "react";
import { View, Text, TouchableWithoutFeedback, Linking } from "react-native";
import { styles } from "../../theme";

export function Impressum() {
	return (
		<View style={styles.headerView}>
			<Text style={styles.headLine}>IMPRESSUM</Text>
			<Text style={styles.sponsorText}>
				{"\n"}Dipl.-Designer Malik Aziz{"\n"}Stephanstraße 43-45{"\n"}
				52064 Aachen
			</Text>
			<TouchableWithoutFeedback
				onPress={() => Linking.openURL("mailto:ios@ladefuchs.app")}
			>
				<Text style={styles.sponsorTextLink}>ios@ladefuchs.app</Text>
			</TouchableWithoutFeedback>
			<Text style={styles.sponsorText}>
				Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
			</Text>
			<Text style={styles.sponsorText}>
				{"\n"}Dipl.-Designer Malik Aziz{"\n"}Stephanstraße 43-45{"\n"}
				52064 Aachen{"\n"}Quelle: Impressum-Generator von anwalt.de
			</Text>
		</View>
	);
}
