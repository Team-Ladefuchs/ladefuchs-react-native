import { View } from "react-native";
import { colors } from "../../theme";
import { CardHeader } from "./cardHeader";
import { ItalicText } from "./ItalicText";
import { HighlightCorner } from "./highlightCorner";
import React from "react";

export function Notes({ notes }: { notes?: string | null }): JSX.Element {
	if (!notes?.trim) {
		return <></>;
	}

	return (
		<View
			style={{
				backgroundColor: colors.ladefuchsLightGrayBackground,
				padding: 12,
				marginTop: 10,
				borderRadius: 12,
			}}
		>
			<HighlightCorner />
			<CardHeader text="Notizen" />
			<ItalicText text={notes} />
		</View>
	);
}
