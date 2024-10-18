import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import Chargeprice from "@assets/about/chargeprice_logo.svg";
import { styles } from "../../theme";
import { scale } from "react-native-size-matters";
import { Line } from "./line";
import i18n from "@translations/translations";

export function DatenView(): JSX.Element {
	return (
		<View>
			<Text style={styles.headLine}>{i18n.t("datenfuchs")}</Text>
			<Text style={styles.italicText}>{i18n.t("datenfuchstext")}</Text>
			<TouchableOpacity
				activeOpacity={0.9}
				hitSlop={scale(10)}
				onPress={async () =>
					await Linking.openURL("https://www.chargeprice.app")
				}
				style={{ marginTop: scale(1) }}
			>
				<Chargeprice height={35} width={230} />
			</TouchableOpacity>
			<Line style={{ marginTop: scale(16) }} />
		</View>
	);
}
