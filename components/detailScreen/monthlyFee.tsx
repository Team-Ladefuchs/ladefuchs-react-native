import { View } from "react-native";
import { ItalicText } from "../../screens/detailView";
import { colors } from "../../theme";
import { CardHeader } from "./cardHeader";

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
			<CardHeader text="Monatliche Gebühr" />
			<ItalicText text={formattedFee} />
		</View>
	);
}
