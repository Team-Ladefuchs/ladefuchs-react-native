import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import Chargeprice from "../../assets/chargeprice_logo.svg";
import { styles } from "../../theme";

export function Datenview() {
	return (
		<View style={styles.headerView}>
			<Text style={styles.headLine}>DATENFUCHS</Text>
			<Text style={styles.sponsorText}>
				Beste schlaue Daten kommen direkt von
			</Text>
			<TouchableOpacity
				onPress={() => Linking.openURL("https://www.chargeprice.app")}
			>
				<Chargeprice height={35} width={230} />
			</TouchableOpacity>
		</View>
	);
}
