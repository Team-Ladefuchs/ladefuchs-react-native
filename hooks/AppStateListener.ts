import { focusManager } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";

export function useAppStateListener() {
	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			onAppStateChange
		);

		return () => {
			subscription.remove();
		};
	}, [onAppStateChange]);
}

function onAppStateChange(status: AppStateStatus) {
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}
