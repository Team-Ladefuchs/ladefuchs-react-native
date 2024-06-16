import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { colors } from "../../theme";
import { ChargeMode } from "../../types/conditions";
import CCS from "@assets/plugs/ccs.svg";
import Typ2 from "@assets/plugs/typ2.svg";
import { useFormatNumber } from "../../hooks/numberFormat";

export function PriceBox({
	chargeMode,
	price,
}: {
	chargeMode: ChargeMode;
	price: number | null | undefined;
}) {
	const { formatNumber } = useFormatNumber();
	const plugSize = 25;
	const plugOpacity = 0.45;
	const plug =
		chargeMode === "ac" ? (
			<Typ2 width={plugSize} height={plugSize} opacity={plugOpacity} />
		) : (
			<CCS width={plugSize} height={plugSize} opacity={plugOpacity} />
		);
	return (
		<View>
			<View style={styles.priceHeaderContainer}>
				<Text style={styles.priceHeaderText}>
					{chargeMode.toLocaleUpperCase()}
				</Text>
				{plug}
			</View>
			<View style={styles.priceContainer}>
				<Text style={styles.priceText}>
					{formatNumber(price) ?? "—"}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	priceText: {
		textAlign: "center",
		fontWeight: "500",
		...Platform.select({
			android: {
				fontSize: 40,
			},
			default: {
				fontSize: 50,
			},
		}),
	},
	priceContainer: {
		backgroundColor: colors.ladefuchsLightGrayBackground,
		paddingHorizontal: 12,
		paddingVertical: 14,
	},
	priceHeaderText: {
		fontSize: 25,
		fontWeight: "700",
		textAlign: "center",
		marginRight: 4,
	},
	priceHeaderContainer: {
		display: "flex",
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",
		flexDirection: "row",
		paddingHorizontal: 12,
		paddingVertical: 12,
		backgroundColor: colors.ladefuchsDarkGrayBackground,
	},
});
