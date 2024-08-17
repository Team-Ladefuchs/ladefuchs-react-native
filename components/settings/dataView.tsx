import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import Chargeprice from "@assets/about/chargeprice_logo.svg";
import { styles } from "../../theme";
import { scale } from "react-native-size-matters";
import { Line } from "./line";

export function DatenView(): JSX.Element {
	return (
		<View>
			<Text style={styles.headLine}>DATENFUCHS</Text>
			<Text style={styles.italicText}>
				Beste schlaue Daten kommen direkt von
			</Text>
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
