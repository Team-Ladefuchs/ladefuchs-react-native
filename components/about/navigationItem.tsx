import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import { ScaledSheet, scale } from "react-native-size-matters";

interface Props {
	title: string;
	screenKey: string;
	description?: string;
}

export function NavigationItem({
	title,
	screenKey,
	description,
}: Props): JSX.Element {
	const navigation = useNavigation();

	return (
		<TouchableOpacity
			activeOpacity={0.6}
			hitSlop={scale(10)}
			onPress={async () => {
				// @ts-ignore
				await navigation.navigate(screenKey);
			}}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<View style={{ flex: 1 }}>
					<Text style={styles.headLine}>{title.toUpperCase()}</Text>
					{description && (
						<Text style={navigationItemStyle.descriptionText}>
							{description}
						</Text>
					)}
				</View>
				<Text style={styles.arrow}>›</Text>
			</View>
		</TouchableOpacity>
	);
}

const navigationItemStyle = ScaledSheet.create({
	descriptionText: {
		color: "black",
		fontFamily: "Bitter",
		lineHeight: "18@s",
		paddingBottom: "2@s",
	},
});
