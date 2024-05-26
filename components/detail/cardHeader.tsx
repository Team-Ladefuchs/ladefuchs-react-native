import { colors } from "../../theme";
import { Text } from "react-native";
export function CardHeader({ text }: { text: string }): JSX.Element {
	return (
		<Text
			style={{
				fontWeight: "bold",
				fontSize: 16,
				paddingBottom: 4,
				color: colors.ladefuchsGrayTextColor,
			}}
		>
			{text.toLocaleUpperCase()}
		</Text>
	);
}
