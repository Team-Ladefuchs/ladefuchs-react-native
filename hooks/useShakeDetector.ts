import { useEffect, useState, useRef } from "react";
import { Accelerometer } from "expo-sensors";

const SHAKE_THRESHOLD = 2; // Adjust based on sensitivity
const SHAKE_TIME_THRESHOLD = 500; // Time threshold in milliseconds to prevent multiple detections

export function useShakeDetector(onShake: () => void) {
	const [lastShake, setLastShake] = useState<number>(0);
	const isMounted = useRef(true);
	const subscriptionRef = useRef<any>(null);

	const handleAccelerometerData = (data: { x: number; y: number; z: number }) => {
		if (!isMounted.current) return;
		
		const { x, y, z } = data;
		const acceleration = Math.sqrt(x * x + y * y + z * z);

		const now = Date.now();
		if (
			acceleration > SHAKE_THRESHOLD &&
			now - lastShake > SHAKE_TIME_THRESHOLD
		) {
			setLastShake(now);
			try {
				onShake();
			} catch (error) {
				console.warn("Error in shake handler:", error);
			}
		}
	};

	useEffect(() => {
		isMounted.current = true;
		
		try {
			subscriptionRef.current = Accelerometer.addListener(handleAccelerometerData);
		} catch (error) {
			console.warn("Failed to add accelerometer listener:", error);
		}

		return () => {
			isMounted.current = false;
			if (subscriptionRef.current) {
				try {
					subscriptionRef.current.remove();
					subscriptionRef.current = null;
				} catch (error) {
					console.warn("Error removing accelerometer listener:", error);
				}
			}
		};
	}, [handleAccelerometerData]);
}
