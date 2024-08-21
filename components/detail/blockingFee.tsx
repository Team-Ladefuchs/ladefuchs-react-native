import React from "react";
import { View } from "react-native";
import { colors } from "../../theme";
import { CardHeader } from "./cardHeader";
import { ItalicText } from "./ItalicText";
import { HighlightCorner } from "./highlightCorner";
import { useFormatNumber } from "../../hooks/useNumberFormat";
import { ScaledSheet } from "react-native-size-matters";
import i18n from "../../localization";

export function BlockingFee({
	feeStart,
	fee,
}: {
	feeStart?: number | null;
	fee?: number | null;
}): JSX.Element {
	const { formatCurrency } = useFormatNumber();
	let textBlock: JSX.Element;
	let showHighlightCorner = false;

	if (feeStart && fee) {
		textBlock = (
			<View>
				<ItalicText text={`› ab Min. ${feeStart}`} />
				<ItalicText text={`› ${formatCurrency(fee)} / Min.`} />
			</View>
		);
		showHighlightCorner = true;
	} else {
		textBlock = <ItalicText text="› keine" />;
	}

	return (
		<View style={styles.container}>
			{showHighlightCorner && <HighlightCorner />}
			<CardHeader text={i18n.t('blockingfee')} />
			{textBlock}
		</View>
	);
}

const styles = ScaledSheet.create({
	container: {
		position: "relative",
		backgroundColor: colors.ladefuchsLightGrayBackground,
		paddingHorizontal: "12@s",
		paddingVertical: "10@s",
		borderBottomLeftRadius: "12@s",
		borderBottomRightRadius: "12@s",
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
