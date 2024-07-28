import {
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
} from "react-native";
import React from "react";

export function ScreenContainer(props) {
	const { children } = props;
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView
					contentInsetAdjustmentBehavior="automatic"
					keyboardShouldPersistTaps="handled"
				>
					{children}
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
