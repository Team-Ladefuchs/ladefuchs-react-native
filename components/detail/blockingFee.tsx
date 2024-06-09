import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../../theme";
import { CardHeader } from "./cardHeader";
import { ItalicText } from "./ItalicText";
import { HighlightCorner } from "./highlightCorner";
import { formatNumberCurrency } from "../../functions/util";

export function BlockingFee({
	feeStart,
	fee,
}: {
	feeStart?: number | null;
	fee?: number | null;
}): JSX.Element {
	let textBlock: JSX.Element;
	let showHighlightCorner = false;

	if (feeStart && fee) {
		textBlock = (
			<View>
				<ItalicText text={`› ab Min. ${feeStart}`} />
				<ItalicText text={`› ${formatNumberCurrency(fee)} / Min.`} />
			</View>
		);
		showHighlightCorner = true;
	} else {
		textBlock = <ItalicText text="› keine" />;
	}

	return (
		<View style={styles.container}>
			{showHighlightCorner && <HighlightCorner />}
			<CardHeader text="Blockiergebühr" />
			{textBlock}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "relative",
		backgroundColor: colors.ladefuchsLightGrayBackground,
		padding: 12,
		borderBottomLeftRadius: 12,
		borderBottomRightRadius: 12,
		marginTop: 2,
		flex: 1,
	},
	highlightCorner: {
		position: "absolute",
		top: -1,
		right: -1,
		shadowOffset: { width: -2, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
	},
});
