import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../theme";
import { Line } from "./line";
import { scale } from "react-native-size-matters";
import { useAppStore } from "../../state/appState";
import { useShallow } from "zustand/react/shallow";
import { Checkbox } from "../shared/checkBox";
import i18n from "@translations/translations";

export function HapticSettings(): JSX.Element {
	const [isHapticEnabled, setHapticEnabled] = useAppStore(
		useShallow((state) => [state.isHapticEnabled, state.setHapticEnabled])
	);

	return (
		<View style={{ marginBottom: scale(10), marginLeft:scale(15) }}>

			<Text style={styles.headLine}>{i18n.t("hapticFeedback")}</Text>
				
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<Checkbox checked={isHapticEnabled} onValueChange={setHapticEnabled} />
				<Text style={[styles.italicText, { marginLeft: scale(15) }]}>{i18n.t("hapticFeedbackText")}</Text>
			</View>

		</View>
	);
} 