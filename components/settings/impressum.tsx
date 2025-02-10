import React from "react";
import { View, Text, TouchableWithoutFeedback, Linking } from "react-native";
import { styles } from "../../theme";
import { scale } from "react-native-size-matters";
import { Line } from "./line";
import i18n from "@translations/translations";

export function Impressum(): JSX.Element {
	return (
		<View>
			<Text style={styles.headLine}>{i18n.t("imprint")}</Text>

			<Text style={styles.italicText}>{i18n.t("imprinttext1")}:</Text>
			<Text style={styles.italicText}>{i18n.t("imprinttext2")}</Text>
			<TouchableWithoutFeedback
				onPress={async () =>
					await Linking.openURL("mailto:malik@ladefuchs.app")
				}
			>
				<Text style={[styles.settingsLink, { marginTop: scale(2) }]}>
					malik@ladefuchs.app
				</Text>
			</TouchableWithoutFeedback>
			<Line style={{ marginTop: scale(16) }} />
		</View>
	);
}
