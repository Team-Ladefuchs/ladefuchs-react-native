import { View, StyleSheet } from "react-native";
import { colors } from "@theme";
import { CardHeader } from "./cardHeader";
import { ItalicText } from "./ItalicText";
import { HighlightCorner } from "./highlightCorner";
import React, { useEffect, useState } from "react";
import i18n from "@translations/translations";

export function Notes({ notes }: { notes?: string | null }): JSX.Element {
	const [noteText, setNoteText] = useState<string | null>(null);
	const [hasNotes, setHasNotes] = useState(false);

	useEffect(() => {
		if (notes) {
			setNoteText(notes.trim());
			setHasNotes(true);
		} else {
			setNoteText("› keine");
			setHasNotes(false);
		}
	}, [notes]);

	return (
		<View style={styles.container}>
			{hasNotes && <HighlightCorner />}
			<CardHeader text={i18n.t("notizen")} />
			<ItalicText text={noteText} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.ladefuchsLightGrayBackground,
		padding: 12,
		marginTop: 10,
		borderRadius: 12,
	},
});
