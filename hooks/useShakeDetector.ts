import { useCallback, useEffect, useState } from "react";
import { Accelerometer } from "expo-sensors";

const SHAKE_THRESHOLD = 2; // Adjust based on sensitivity
const SHAKE_TIME_THRESHOLD = 500; // Time threshold in milliseconds to prevent multiple detections

export function useShakeDetector(onShake: () => void) {
	const [lastShake, setLastShake] = useState<number>(0);

	const handleAccelerometerData = useCallback(
		(data: { x: number; y: number; z: number }) => {
			const { x, y, z } = data;
			const acceleration = Math.sqrt(x * x + y * y + z * z);

			const now = Date.now();
			if (
				acceleration > SHAKE_THRESHOLD &&
				now - lastShake > SHAKE_TIME_THRESHOLD
			) {
				setLastShake(now);
				onShake();
			}
		},
		[lastShake, onShake],
	);

	useEffect(() => {
		const subscription = Accelerometer.addListener(handleAccelerometerData);

		return () => {
			subscription.remove();
		};
	}, [handleAccelerometerData]);
}
