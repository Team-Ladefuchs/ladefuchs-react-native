import { colors } from "../../theme";
import { Text } from "react-native";
export function CardHeader({ text }: { text: string }): JSX.Element {
	return (
		<Text
			style={{
				fontSize: 16,
				paddingBottom: 4,
				fontWeight: "bold",
				color: colors.ladefuchsGrayTextColor,
			}}
		>
			{text.toLocaleUpperCase()}
		</Text>
	);
}
