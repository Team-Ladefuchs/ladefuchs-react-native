import React from "react";
import { View, Text, TouchableWithoutFeedback, Linking } from "react-native";
import { styles } from "../../theme";
import { scale } from "react-native-size-matters";

export function Impressum() {
	return (
		<View>
			<Text style={styles.headLine}>IMPRESSUM</Text>
			<Text style={styles.italicText}>
				Dipl.-Designer Malik Aziz{"\n"}Stephanstraße 43-45{"\n"}
				52064 Aachen
			</Text>
			<TouchableWithoutFeedback
				onPress={async () =>
					await Linking.openURL("mailto:ios@ladefuchs.app")
				}
			>
				<Text style={[styles.italicTextLink]}>
					{"\n"}
					ios@ladefuchs.app
					{"\n"}
				</Text>
			</TouchableWithoutFeedback>
			<Text style={styles.italicText}>
				Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
			</Text>
			<Text style={styles.italicText}>
				Dipl.-Designer Malik Aziz{"\n"}Stephanstraße 43-45{"\n"}
				52064 Aachen{"\n"}Quelle: Impressum-Generator von anwalt.de
			</Text>
		</View>
	);
}
