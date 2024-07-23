import React from "react";
import {styles} from "../theme";
import { View, Text,ScrollView } from "react-native";

export function MSPView(): JSX.Element {
	return(
		<ScrollView style={styles.scrollView} bounces>
	<View style={{ padding: 30 }}>
					<Text style={styles.sponsorText}>E-Mobility-Provider (MSP, EMSP)</Text>
				</View>
				</ScrollView>
	);
}
