import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme";
import { ChargeMode } from "../../types/conditions";
import CCS from "@assets/plugs/ccs.svg";
import Typ2 from "@assets/plugs/typ2.svg";
import { useFormatNumber } from "../../hooks/numberFormat";
import { scale } from "react-native-size-matters";

export function PriceBox({
	chargeMode,
	price,
	rounded = false,
}: {
	chargeMode: ChargeMode;
	price: number | null | undefined;
	rounded?: boolean;
}) {
	const { formatNumber } = useFormatNumber();
	const plugSize = 25;
	const plugOpacity = 0.5;
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
			<View
				style={[
					styles.priceContainer,
					rounded && styles.roundedContainer,
				]}
			>
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
		fontSize: scale(38),
	},
	priceContainer: {
		backgroundColor: colors.ladefuchsLightGrayBackground,
		paddingHorizontal: scale(11),
		paddingVertical: scale(11),
	},
	priceHeaderText: {
		fontSize: scale(24),
		fontWeight: "700",
		textAlign: "center",
		marginRight: scale(4),
	},
	roundedContainer: {
		borderBottomLeftRadius: scale(12),
		borderBottomRightRadius: scale(12),
	},
	priceHeaderContainer: {
		display: "flex",
		borderTopLeftRadius: scale(12),
		borderTopRightRadius: scale(12),
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",
		flexDirection: "row",
		paddingHorizontal: scale(12),
		paddingVertical: scale(11),
		backgroundColor: colors.ladefuchsDarkGrayBackground,
	},
});
