import React, { JSX } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { styles } from "../../theme";
import { Line } from "./line";
import { scale } from "react-native-size-matters";
import { openSettings, showHelloWorld } from "../../functions/util/infoModule";
import SwiftIcon from "../../assets/generic/swift.svg";

export function InfoModuleButton(): JSX.Element {
	if (Platform.OS !== "ios") {
		return <></>;
	}

	return (
		<View>
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<Text style={styles.headLine}>Swift Modul testen</Text>
				<SwiftIcon width={scale(24)} height={scale(24)} />
			</View>
			<View style={{ marginTop: scale(8), gap: scale(8) }}>
				<TouchableOpacity
					activeOpacity={0.8}
					hitSlop={scale(10)}
					onPress={async () => await showHelloWorld()}
					style={{ marginTop: scale(1) }}
				>
					<Text style={styles.settingsLink}>Swift Module anzeigen</Text>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.8}
					hitSlop={scale(10)}
					onPress={async () => await openSettings()}
					style={{ marginTop: scale(1) }}
				>
					<Text style={styles.settingsLink}>iOS Settings öffnen</Text>
				</TouchableOpacity>
			</View>
			<Line style={{ marginTop: scale(16) }} />
		</View>
	);
}

