import React from "react";
import { View, Text } from "react-native";
import { colors } from "@theme";
import { CloseButton } from "../header/closeButton";
import { Tariff } from "../../types/tariff";
import { ScaledSheet } from "react-native-size-matters";

interface Props {
	tariff: Tariff;
	navigation: { goBack: () => void };
}

export function DetailHeader({ tariff, navigation }: Props): React.JSX.Element {
	return (
		<View style={styles.container}>
			<View
				style={{
					flex: 1,
					columnGap: 10,
				}}
			>
				<Text style={styles.tariffName}>{tariff.name}</Text>
				<Text style={styles.providerName}>{tariff.providerName}</Text>
			</View>
			<View>
				<CloseButton
					onPress={() => navigation.goBack()}
					backgroundColor={colors.ladefuchsDarkBackground}
				/>
			</View>
		</View>
	);
}

const styles = ScaledSheet.create({
	container: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		paddingVertical: "14@s",
		paddingHorizontal: "16@s",
		backgroundColor: colors.ladefuchsDunklerBalken,
		borderBottomWidth: 0.5,
		borderBottomColor: colors.ladefuchsLightGrayBackground,
	},
	tariffName: {
		fontWeight: "bold",
		fontSize: "22@s",
	},
	providerName: {
		fontWeight: "bold",
		fontSize: "17@s",
	},
});
