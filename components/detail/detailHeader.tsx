import { View, Text, StyleSheet, Platform } from "react-native";
import { colors } from "../../theme";
import { CloseButton } from "../header/closeButton";
import { Tariff } from "../../types/tariff";
import React from "react";

interface Props {
	tariff: Tariff;
	navigation: { goBack: () => void };
}

export function DetailHeader({ tariff, navigation }: Props): JSX.Element {
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
				<CloseButton onPress={() => navigation.goBack()} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		paddingVertical: 16,
		paddingHorizontal: 16,
		backgroundColor: colors.ladefuchsDunklerBalken,
		borderBottomWidth: 0.5,
		borderBottomColor: colors.ladefuchsLightGrayBackground,
	},
	tariffName: {
		fontWeight: "bold",
		...Platform.select({
			android: {
				fontSize: 21,
			},
			default: {
				fontSize: 23,
			},
		}),
	},
	providerName: {
		fontWeight: "bold",
		...Platform.select({
			android: {
				fontSize: 16,
			},
			default: {
				fontSize: 18,
			},
		}),
	},
});
