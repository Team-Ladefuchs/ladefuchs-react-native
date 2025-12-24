import React, { JSX } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { styles } from "../../theme";
import { scale } from "react-native-size-matters";
import SwiftIcon from "../../assets/generic/swift.svg";
import { showHelloWorld } from "../../functions/util/infoModule";

export function InfoModuleButton(): JSX.Element {
	const isIOS = Platform.OS === "ios";
	const isAndroid = Platform.OS === "android";

	if (!isIOS && !isAndroid) {
		return <></>;
	}

	return (
		<View style={{ marginBottom: scale(16), marginLeft: scale(15) }}>
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<Text style={styles.headLine}>
					{isIOS ? "elvah Swift SDK" : "elvah Kotlin SDK"}
				</Text>
				{isIOS && <SwiftIcon width={scale(24)} height={scale(24)} />}
			</View>
			<View style={{ marginTop: scale(8) }}>
				<TouchableOpacity
					activeOpacity={0.8}
					hitSlop={scale(10)}
					onPress={async () => await showHelloWorld()}
					style={{ marginTop: scale(1) }}
				>
					<Text style={styles.settingsLink}>
						{isIOS ? "Swift Module anzeigen" : "Kotlin Module anzeigen"}
					</Text>
				</TouchableOpacity>

			</View>
		</View>
	);
}

