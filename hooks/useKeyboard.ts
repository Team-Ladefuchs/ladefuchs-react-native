import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export function useKeyBoard(): boolean {
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	useEffect(() => {
		const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
			setKeyboardStatus(true);
		});
		const showSubscription2 = Keyboard.addListener(
			"keyboardWillShow",
			() => {
				setKeyboardStatus(true);
			},
		);
		const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
			setKeyboardStatus(false);
		});
		const hideSubscription2 = Keyboard.addListener(
			"keyboardWillHide",
			() => {
				setKeyboardStatus(false);
			},
		);

		return () => {
			showSubscription.remove();
			showSubscription2.remove();
			hideSubscription.remove();
			hideSubscription2.remove();
		};
	}, []);

	return keyboardStatus;
}
