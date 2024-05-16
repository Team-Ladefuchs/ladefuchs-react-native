import { View } from "react-native";
import { ItalicText } from "../../screens/detailView";
import { colors } from "../../theme";
import { CardHeader } from "./cardHeader";

export function BlockingFee({
	feeStart,
	fee,
}: {
	feeStart?: number | null;
	fee?: number | null;
}): JSX.Element {
	let textBlock = <ItalicText text="› keine" />;

	if (feeStart && fee) {
		textBlock = (
			<>
				<ItalicText text={`› ab Minute ${feeStart}`} />
				<ItalicText text={`› ${fee} € / Minute`} />
			</>
		);
	}

	return (
		<View
			style={{
				backgroundColor: colors.ladefuchsLightGrayBackground,
				padding: 12,
				borderBottomRightRadius: 12,
				borderBottomLeftRadius: 12,
				marginTop: 1,
			}}
		>
			<CardHeader text="Blockiergebühr" />
			{textBlock}
		</View>
	);
}
