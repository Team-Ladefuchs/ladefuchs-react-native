import { useEffect, useState, useRef } from "react";
import { Keyboard } from "react-native";

export function useKeyBoard(): boolean {
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	const isMounted = useRef(true);
	const subscriptionsRef = useRef<any[]>([]);

	useEffect(() => {
		isMounted.current = true;
		subscriptionsRef.current = [];

		const createListener = (event: string, callback: () => void) => {
			try {
				const subscription = Keyboard.addListener(event, callback);
				subscriptionsRef.current.push(subscription);
				return subscription;
			} catch (error) {
				console.warn(`Failed to add keyboard listener for ${event}:`, error);
				return null;
			}
		};

		const showSubscription = createListener("keyboardDidShow", () => {
			if (isMounted.current) {
				setKeyboardStatus(true);
			}
		});
		
		const showSubscription2 = createListener("keyboardWillShow", () => {
			if (isMounted.current) {
				setKeyboardStatus(true);
			}
		});
		
		const hideSubscription = createListener("keyboardDidHide", () => {
			if (isMounted.current) {
				setKeyboardStatus(false);
			}
		});
		
		const hideSubscription2 = createListener("keyboardWillHide", () => {
			if (isMounted.current) {
				setKeyboardStatus(false);
			}
		});

		return () => {
			isMounted.current = false;
			subscriptionsRef.current.forEach(subscription => {
				if (subscription) {
					try {
						subscription.remove();
					} catch (error) {
						console.warn("Error removing keyboard listener:", error);
					}
				}
			});
			subscriptionsRef.current = [];
		};
	}, []);

	return keyboardStatus;
}
