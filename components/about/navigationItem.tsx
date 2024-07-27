import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";

interface Props {
	title: string;
	screenName: string;
	description: string;
}

export function NavigationItem({
	title,
	screenName,
	description,
}: Props): JSX.Element {
	const navigation = useNavigation();

	return (
		<View>
			<TouchableOpacity
				activeOpacity={0.6}
				onPress={() => {
					// @ts-ignore
					navigation.navigate(screenName);
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<View style={{ flex: 1 }}>
						<Text style={styles.headLine}>{title}</Text>
						<Text style={navigationItemStyle.descriptionText}>
							{description}
						</Text>
					</View>
					<Text style={styles.arrow}>›</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
}

const navigationItemStyle = ScaledSheet.create({
	descriptionText: {
		color: "black",
		fontFamily: "Bitter",
		lineHeight: "18@s",
		paddingBottom: "3@s",
	},
});
