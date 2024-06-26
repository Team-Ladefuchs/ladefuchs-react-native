import React from "react";
import { View, Text, Image } from "react-native";

export function OfflineView(): JSX.Element {
	return (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				alignContent: "center",
				marginTop: 50,
			}}
		>
			<Image
				source={require("@assets/fuchs/ladefuchs.png")}
				style={{ width: 200, height: 200 }}
			/>
			<Text
				style={{
					color: "red",
					textAlign: "center",
					fontSize: 20,
					marginTop: 20,
				}}
			>
				Sorry, du bist offline.
			</Text>
		</View>
	);
}
