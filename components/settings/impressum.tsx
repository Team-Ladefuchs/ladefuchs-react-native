import React from "react";
import { View, Text, TouchableWithoutFeedback, Linking } from "react-native";
import { styles } from "../../theme";
import { scale } from "react-native-size-matters";
import { Line } from "./line";

export function Impressum(): JSX.Element {
	return (
		<View>
			<Text style={styles.headLine}>IMPRESSUM</Text>

			<Text style={styles.italicText}>
				Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
			</Text>
			<Text style={styles.italicText}>
				Dipl.-Designer Malik Aziz{"\n"}Stephanstraße 43-45, 52064 Aachen
			</Text>
			<TouchableWithoutFeedback
				onPress={async () =>
					await Linking.openURL("mailto:malik@ladefuchs.app")
				}
			>
				<Text
					style={[
						styles.italicTextLink,
						{ textDecorationLine: "underline" },
					]}
				>
					malik@ladefuchs.app
				</Text>
			</TouchableWithoutFeedback>
			<Line style={{ marginTop: scale(16) }} />
		</View>
	);
}
