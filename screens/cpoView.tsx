import React from "react";
import {styles} from "../theme";
import { View, Text, ScrollView } from "react-native";

export function CPOView(): JSX.Element {
	return (
<ScrollView style={styles.scrollView} bounces>
	<View style={{ padding: 30 }}>
					<Text style={styles.sponsorText}>Charge Point Operator (CPO)</Text>
				</View>
				</ScrollView>
	);
}
