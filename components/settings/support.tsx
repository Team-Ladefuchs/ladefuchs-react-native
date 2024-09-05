import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../theme";
import { Line } from "./line";
import { scale } from "react-native-size-matters";
import i18n from "../../localization";

export function Support() {
	return (
		<View>
			<Text style={styles.headLine}>{i18n.t('supportfuchs')}</Text>
			<Text style={styles.italicText}>
			{i18n.t('supportfuchstext')}
			</Text>
			<Line style={{ marginTop: scale(16) }} />
		</View>
	);
}
