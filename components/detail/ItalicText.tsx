import { Text } from "react-native";

export function ItalicText({
	text,
	fontSize = 16,
}: {
	text: string;
	fontSize?: number;
}) {
	return (
		<Text style={{ fontStyle: "italic", fontSize, fontFamily: "Bitter" }}>
			{text}
		</Text>
	);
}
