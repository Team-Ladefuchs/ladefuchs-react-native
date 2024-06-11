import React from "react";
import { Text } from "react-native";

export function ItalicText({
	text,
}: {
	text: string;
	fontSize?: number;
}) {
	return (
		<Text style={{ fontStyle: "italic", fontFamily: "Bitter" }}>
			{text}
		</Text>
	);
}
