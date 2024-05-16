import { View } from "react-native";
import { colors } from "../../theme";
import { CardHeader } from "./cardHeader";
import { ItalicText } from "./ItalicText";

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
				borderRadius: 12,
				marginTop: 4,
				height: 81,
			}}
		>
			<CardHeader text="Blockiergebühr" />
			{textBlock}
		</View>
	);
}
