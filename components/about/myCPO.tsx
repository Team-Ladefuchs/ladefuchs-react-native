import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../theme";
import { useNavigation } from '@react-navigation/native';




export function MyCPO (): JSX.Element {
	const navigation = useNavigation();

	return (
		<View style={styles.headerView}>
		<TouchableOpacity
			activeOpacity={0.6}
			onPress={() => {
				//@ts-ignore
				navigation.navigate("Meine Stromanbieter");
			}}
		>
			<View style={{ padding: 3, flexDirection: 'row', alignItems: 'center' }}>
			<View style={{ flex: 1 }}>
			<Text style={styles.headLine}>Meine Stromanbieter</Text>
			<Text style={styles.sponsorText}>Wenn Du einen anderen Ladesäulen-Betreiber...</Text>
			</View>
			<Text style={styles.arrow}>›</Text>
			</View>
		</TouchableOpacity>
	</View>
	);
}
