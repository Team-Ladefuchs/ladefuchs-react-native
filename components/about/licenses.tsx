import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../theme";
import { useNavigation } from '@react-navigation/native';


export function LicenseView (): JSX.Element {
	const navigation = useNavigation();

return (
		<View style={styles.headerView}>
			<TouchableOpacity
				activeOpacity={0.6}
				onPress={() => {
					navigation.navigate("Drittlizenzen");
				}}
			>
				<View style={{ padding: 3, flexDirection: 'row', alignItems: 'center' }}>
					<View style={{ flex: 1 }}>
						<Text style={styles.headLine}>Drittlizenzen</Text>
					</View>
					<Text style={styles.arrow}>›</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
};
