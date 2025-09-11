import { useState, useEffect, useRef } from "react";
import { Keyboard, AppStateStatus, AppState } from "react-native";

export function useAutoDismissKeybaord() {
	const [appState] = useState<AppStateStatus>(AppState.currentState);
	const isMounted = useRef(true);
	const subscriptionRef = useRef<any>(null);

	useEffect(() => {
		isMounted.current = true;

		try {
			subscriptionRef.current = AppState.addEventListener(
				"change",
				(nextAppState) => {
					if (isMounted.current && nextAppState === "background") {
						try {
							Keyboard.dismiss();
						} catch (error) {
							console.warn("Error dismissing keyboard:", error);
						}
					}
				},
			);
		} catch (error) {
			console.warn("Failed to add app state listener:", error);
		}

		return () => {
			isMounted.current = false;
			if (subscriptionRef.current) {
				try {
					subscriptionRef.current.remove();
					subscriptionRef.current = null;
				} catch (error) {
					console.warn("Error removing app state listener:", error);
				}
			}
		};
	}, []);

	return appState;
}
