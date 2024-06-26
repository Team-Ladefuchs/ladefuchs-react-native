import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import Chargeprice from "@assets/about/chargeprice_logo.svg";
import { styles } from "../../theme";

export function DatenView(): JSX.Element {
	return (
		<View style={styles.headerView}>
			<Text style={styles.headLine}>DATENFUCHS</Text>
			<Text style={styles.sponsorText}>
				Beste schlaue Daten kommen direkt von
			</Text>
			<TouchableOpacity
			activeOpacity={0.9}
				onPress={async () =>
					await Linking.openURL("https://www.chargeprice.app")
				}
			>
				<Chargeprice height={35} width={230} />
			</TouchableOpacity>
		</View>
	);
}
