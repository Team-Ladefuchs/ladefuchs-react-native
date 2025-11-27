import React, { JSX } from "react";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import { styles } from "../../theme";
import { scale } from "react-native-size-matters";
import { useAppStore } from "../../state/appState";
import { useShallow } from "zustand/react/shallow";
import { Checkbox } from "../shared/checkBox";
import i18n from "@translations/translations";
import { openSettings, showHelloWorld } from "../../functions/util/infoModule";
import SwiftIcon from "../../assets/generic/swift.svg";


export function HapticSettings(): JSX.Element {
	const [isHapticEnabled, setHapticEnabled] = useAppStore(
		useShallow((state) => [state.isHapticEnabled, state.setHapticEnabled])
	);
	const isIOS = Platform.OS === "ios";
	const isAndroid = Platform.OS === "android";

	return (
		<View style={{ marginBottom: scale(6), marginLeft:scale(15) }}>

			<Text style={styles.headLine}>{i18n.t("hapticFeedback")}</Text>
				
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<Checkbox checked={isHapticEnabled} onValueChange={setHapticEnabled} />
				<Text style={[styles.italicText, { marginLeft: scale(15) }]}>{i18n.t("hapticFeedbackText")}</Text>
			</View>
			{isIOS && (
				<View style={{ marginTop: scale(5), flexDirection: "row", alignItems: "center", gap: scale(14) }}>
					<SwiftIcon width={scale(28)} height={scale(28)} />
					<TouchableOpacity
						activeOpacity={0.8}
						hitSlop={scale(10)}
						onPress={async () => await openSettings()}
						style={{ marginTop: scale(1) }}
					>
						<Text style={styles.settingsLink}>iOS Settings öffnen</Text>
					</TouchableOpacity>
				</View>
			)}
			{isAndroid && (
				<View style={{ marginTop: scale(5), flexDirection: "row", alignItems: "center" }}>
					<TouchableOpacity
						activeOpacity={0.8}
						hitSlop={scale(10)}
						onPress={async () => await openSettings()}
						style={{ marginTop: scale(1) }}
					>
						<Text style={styles.settingsLink}>Android Settings öffnen</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
} 