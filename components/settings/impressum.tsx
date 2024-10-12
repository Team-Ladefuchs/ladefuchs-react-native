import React from "react";
import { View, Text, TouchableWithoutFeedback, Linking } from "react-native";
import { styles } from "../../theme";
import { scale } from "react-native-size-matters";
import { Line } from "./line";
import i18n from "../../localization";

export function Impressum(): JSX.Element {
	return (
		<View>
			<Text style={styles.headLine}>{i18n.t('impressum')}</Text>

			<Text style={styles.italicText}>
			{i18n.t('impressumtext1')}:
			</Text>
			<Text style={styles.italicText}>
			{i18n.t('impressumtext2')}
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
