import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import { ScaledSheet, scale } from "react-native-size-matters";

interface Props {
	title: string;
	screenKey: string;
	iconPrefix?: React.ReactElement;
	justifyContent: "space-between" | "space-evenly";
	description?: string;
}

export function NavigationItem({
	title,
	screenKey,
	justifyContent,
	description,
	iconPrefix,
}: Props): JSX.Element {
	const navigation = useNavigation<any>();

	return (
		<TouchableOpacity
			activeOpacity={0.6}
			hitSlop={scale(10)}
			onPress={async () => {
				await navigation.navigate(screenKey);
			}}
		>
			<View style={navigationItemStyle.container}>
				{iconPrefix && iconPrefix}
				<View
					style={{
						flex: 1,
						flexDirection: "row",
						justifyContent,
						alignItems: "center",
					}}
				>
					<View style={navigationItemStyle.middleContainer}>
						<Text style={styles.headLine}>
							{title.toUpperCase()}
						</Text>
						{description && (
							<Text style={navigationItemStyle.descriptionText}>
								{description}
							</Text>
						)}
					</View>
					<Text style={styles.arrow}>›</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const navigationItemStyle = ScaledSheet.create({
	container: {
		flexDirection: "row",
		gap: "32@s",
		width: "100%",
		alignItems: "center",
	},
	middleContainer: {
		alignContent: "center",
		marginRight: "16@s",
	},
	descriptionText: {
		color: "black",
		fontFamily: "Bitter",
		lineHeight: "18@s",
		paddingBottom: "2@s",
	},
});
