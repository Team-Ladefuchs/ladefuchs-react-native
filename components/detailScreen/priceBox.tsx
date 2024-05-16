import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme";
import { ChargeMode } from "../../types/conditions";
import CCS from "@assets/ccs.svg";
import Typ2 from "@assets/typ2.svg";

export function PriceBox({
	chargeMode,
	price,
}: {
	chargeMode: ChargeMode;
	price: number | null | undefined;
}) {
	const plugSize = 25;
	const plug =
		chargeMode === "ac" ? (
			<Typ2 width={plugSize} height={plugSize} />
		) : (
			<CCS width={plugSize} height={plugSize} />
		);
	return (
		<View>
			<View style={styles.priceHeader}>
				<Text
					style={{
						fontSize: 24,
						fontWeight: "800",
						textAlign: "center",
					}}
				>
					{chargeMode.toLocaleUpperCase()}
				</Text>
				{plug}
			</View>
			<View style={styles.priceContainer}>
				<Text
					style={{
						textAlign: "center",
						fontWeight: "500",
						fontSize: 44,
						height: 60,
					}}
				>
					{price?.toFixed(2) ?? ""}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	priceContainer: {
		backgroundColor: colors.ladefuchsLightGrayBackground,
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderBottomRightRadius: 12,
		borderBottomLeftRadius: 12,
	},
	priceHeader: {
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
