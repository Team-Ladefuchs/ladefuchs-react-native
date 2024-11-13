import React from "react";
import { View, TouchableOpacity, Text, Linking } from "react-native";
import { scale } from "react-native-size-matters";
import { styles } from "../../theme";
import { Line } from "./line";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../../state/appState";
import i18n from "@translations/translations";

export function StartOnBoarding(): JSX.Element {
	const [setOnboarding] = useAppStore(
		useShallow((state) => [state.setOnboarding]),
	);

	const url = "https://ladefuchs.app/faq/";

	return (
		<View>
			<Text style={styles.headLine}>{i18n.t("howThisAppWorks")}</Text>
			<TouchableOpacity
				activeOpacity={0.8}
				hitSlop={scale(10)}
				onPress={() => {
					setOnboarding("start");
				}}
				style={{ marginTop: scale(1) }}
			>
				<Text style={styles.settingsLink}>
					{i18n.t("startOnBoarding")}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				activeOpacity={0.8}
				hitSlop={scale(10)}
				onPress={() => Linking.openURL(url)}
				style={{ marginTop: scale(6) }}
			>
				<Text style={styles.settingsLink}>{i18n.t("faqlink")}</Text>
			</TouchableOpacity>

			<Line style={{ marginTop: scale(16) }} />
		</View>
	);
}
