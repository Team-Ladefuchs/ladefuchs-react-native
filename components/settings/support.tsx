import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { styles } from "../../theme";
import { Line } from "./line";
import { scale } from "react-native-size-matters";
import i18n from "../../localization";

export function Support() {
	return (
		<View>
			<Text style={styles.headLine}>{i18n.t("supportfuchs2")}</Text>
			<Text style={styles.italicText}>{i18n.t("supportfuchstext2")}</Text>
			<TouchableOpacity
				activeOpacity={0.9}
				hitSlop={scale(10)}
				onPress={async () =>
					await Linking.openURL(
						"https://ladefuchs.app/unterstuetzen/",
					)
				}
				style={{ marginTop: scale(1) }}
			>
				<Text style={styles.headLine}>{i18n.t("supportlink")}</Text>
			</TouchableOpacity>
			<Line style={{ marginTop: scale(16) }} />
		</View>
	);
}
