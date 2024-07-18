import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme";
import { ChargeMode } from "../../types/conditions";
import CCS from "@assets/plugs/ccs.svg";
import Typ2 from "@assets/plugs/typ2.svg";
import { useFormatNumber } from "../../hooks/numberFormat";
import { scale } from "react-native-size-matters";
import { PriceModifyButton } from "./feedbackView/priceModifyButton";

interface Props {
	editMode?: boolean;
	chargeMode: ChargeMode;
	price: number | null | undefined;
	rounded?: boolean;
	onIncrement?: () => void;
	onDecrement?: () => void;
}

export function PriceBox({
	chargeMode,
	price,
	rounded = false,
	editMode = false,
	onIncrement = () => {},
	onDecrement = () => {},
}: Props) {
	const { formatNumber } = useFormatNumber();

	const plugSize = 25;
	const plugOpacity = 0.5;

	return (
		<View>
			<View style={styles.headerContainer}>
				<Text style={styles.headerText}>
					{chargeMode.toLocaleUpperCase()}
				</Text>
				{chargeMode === "ac" ? (
					<Typ2
						width={plugSize}
						height={plugSize}
						opacity={plugOpacity}
					/>
				) : (
					<CCS
						width={plugSize}
						height={plugSize}
						opacity={plugOpacity}
					/>
				)}
			</View>
			<View
				style={[
					styles.bodyContainer,
					rounded && styles.roundedContainer,
				]}
			>
				{editMode && price ? (
					<View style={[styles.editPriceContainer]}>
						<PriceModifyButton
							buttonType="minus"
							onPress={onDecrement}
						/>

						<Text
							style={[styles.priceText, { fontSize: scale(28) }]}
						>
							{formatNumber(price) ?? "—"}
						</Text>

						<PriceModifyButton
							buttonType="plus"
							onPress={onIncrement}
						/>
					</View>
				) : (
					<View style={styles.priceContainer}>
						<Text
							style={{ ...styles.priceText, fontSize: scale(36) }}
						>
							{formatNumber(price) ?? "—"}
						</Text>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	bodyContainer: {
		backgroundColor: colors.ladefuchsLightGrayBackground,
	},
	priceText: {
		textAlign: "center",
		fontWeight: "500",
	},
	priceContainer: {
		paddingHorizontal: scale(11),
		paddingVertical: scale(11),
		justifyContent: "center",
		display: "flex",
		flexDirection: "row",
		fontSize: scale(40),
	},
	editPriceContainer: {
		justifyContent: "space-between",
		alignItems: "center",
		alignContent: "center",
		paddingHorizontal: scale(9),
		paddingVertical: scale(14),
		width: "100%",
		display: "flex",
		flexDirection: "row",
		rowGap: scale(1),
	},
	headerText: {
		fontSize: scale(24),
		fontWeight: "700",
		textAlign: "center",
		marginRight: scale(4),
	},
	roundedContainer: {
		borderBottomLeftRadius: scale(12),
		borderBottomRightRadius: scale(12),
	},
	headerContainer: {
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
