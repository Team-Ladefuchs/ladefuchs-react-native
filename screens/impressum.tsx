import React from "react";
import { View, Text, TouchableWithoutFeedback, Linking } from "react-native";
import { colors, styles } from "../theme";
import { ScaledSheet, scale } from "react-native-size-matters";

export function Impressum(): JSX.Element {
	return (
		<View style={settingsStyle.screen}>
			<Text style={styles.italicText}>
				Dipl.-Designer Malik Aziz{"\n"}Stephanstraße 43-45{"\n"}
				52064 Aachen
			</Text>
			<TouchableWithoutFeedback
				onPress={async () =>
					await Linking.openURL("mailto:ios@ladefuchs.app")
				}
			>
				<Text
					style={[
						styles.italicTextLink,
						{ textDecorationLine: "underline" },
					]}
				>
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
				52064 Aachen{"\n"}
			</Text>
		</View>
	);
}
const settingsStyle = ScaledSheet.create({
	screen: {
		padding: "16@s",
		height: "100%",
		backgroundColor: colors.ladefuchsLightBackground,
	},
});
