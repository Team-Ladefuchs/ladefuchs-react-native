import { useState, useEffect } from "react";
import { Keyboard, AppStateStatus, AppState } from "react-native";

export function useAutoDismissKeybaord() {
	const [appState] = useState<AppStateStatus>(AppState.currentState);

	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			(nextAppState) => {
				if (nextAppState === "background") {
					Keyboard.dismiss();
				}
			},
		);

		return () => subscription.remove();
	}, []);

	return appState;
}
