import { View } from "react-native";
import { colors } from "../../theme";
import { CardHeader } from "./cardHeader";
import { ItalicText } from "./ItalicText";
import { HighlightCorner } from "./highlightCorner";

export function MonthlyFee({ fee }: { fee?: number | null }): JSX.Element {
	const formattedFee = fee ? `${fee} €` : "› keine";
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
