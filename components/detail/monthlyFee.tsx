import { View } from "react-native";
import { colors } from "../../theme";
import { CardHeader } from "./cardHeader";
import { ItalicText } from "./ItalicText";
import { HighlightCorner } from "./highlightCorner";
import React from "react";
import { useFormatNumber } from "../../hooks/useNumberFormat";

export function MonthlyFee({ fee }: { fee?: number | null }): JSX.Element {
	const { formatCurrency } = useFormatNumber();
	const formattedFee = fee ? `${formatCurrency(fee)}` : "› keine";
	return (
		<View
			style={{
				backgroundColor: colors.ladefuchsLightGrayBackground,
				padding: 12,
				marginTop: 10,
				borderRadius: 12,
			}}
		>
			{fee && <HighlightCorner />}
			<CardHeader text="Monatliche Gebühr" />
			<ItalicText text={formattedFee} />
		</View>
	);
}
