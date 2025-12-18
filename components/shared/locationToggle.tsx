import React, { useEffect } from "react";
import { Pressable, ViewStyle, View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSpring,
	withRepeat,
	withSequence,
	interpolateColor,
	Easing,
	cancelAnimation,
} from "react-native-reanimated";
import { colors } from "@theme";
import * as Haptics from "expo-haptics";
import { triggerHaptic } from "../../functions/util/haptics";
import MapIcon from "@assets/map.svg";
import GpsIcon from "@assets/gps.svg";

interface Props {
	checked: boolean;
	onValueChange: (value: boolean) => void;
	size?: number;
	style?: ViewStyle;
}

export function LocationToggle({
	checked,
	onValueChange,
	style,
	size = 29,
}: Props): React.JSX.Element {
	const toggleProgress = useSharedValue(checked ? 1 : 0);
	const scaleValue = useSharedValue(1);
	
	// Flag um zu steuern, ob Animationen laufen sollen
	const isAnimating = useSharedValue(checked);
	
	// Pulsierende Animation für die konzentrischen Kreise
	const pulse1 = useSharedValue(0);
	const pulse2 = useSharedValue(0);
	const pulse3 = useSharedValue(0);

	useEffect(() => {
		// Synchronisiere Toggle-Status mit Animation
		toggleProgress.value = withSpring(checked ? 1 : 0, {
			damping: 15,
			stiffness: 150,
		});

		// Setze Animations-Flag
		isAnimating.value = checked;

		if (checked) {
			// Stoppe alle laufenden Animationen bevor neue gestartet werden
			cancelAnimation(pulse1);
			cancelAnimation(pulse2);
			cancelAnimation(pulse3);
			
			// Setze auf 0 bevor neue Animationen starten
			pulse1.value = 0;
			pulse2.value = 0;
			pulse3.value = 0;

			// Starte pulsierende Animationen sofort wenn Location aktiviert wird
			// Erster Puls startet sofort - maximal 3 Wiederholungen
			pulse1.value = withRepeat(
				withSequence(
					withTiming(1, {
						duration: 2000,
						easing: Easing.out(Easing.ease),
					}),
					withTiming(0, { duration: 0 })
				),
				3,
				false
			);

			// Zweiter Puls startet nach kurzer Verzögerung - maximal 3 Wiederholungen
			pulse2.value = withRepeat(
				withSequence(
					withTiming(0, { duration: 0 }),
					withTiming(1, {
						duration: 2000,
						easing: Easing.out(Easing.ease),
					}),
					withTiming(0, { duration: 0 })
				),
				3,
				false
			);

			// Dritter Puls startet mit noch längerer Verzögerung - maximal 3 Wiederholungen
			pulse3.value = withRepeat(
				withSequence(
					withTiming(0, { duration: 0 }),
					withTiming(0, { duration: 666 }),
					withTiming(1, {
						duration: 2000,
						easing: Easing.out(Easing.ease),
					}),
					withTiming(0, { duration: 0 })
				),
				2,
				false
			);
		} else {
			// Stoppe alle Animationen sofort wenn Location deaktiviert wird
			cancelAnimation(pulse1);
			cancelAnimation(pulse2);
			cancelAnimation(pulse3);
			// Setze direkt auf 0 für sofortiges Stoppen
			pulse1.value = 0;
			pulse2.value = 0;
			pulse3.value = 0;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checked]);

	const animatedContainerStyle = useAnimatedStyle(() => {
		// Nur backgroundColor wenn aktiviert, sonst transparent
		const backgroundColor = checked
			? interpolateColor(
					toggleProgress.value,
					[0, 1],
					["transparent", colors.ladefuchsOrange]
			  )
			: "transparent";

		return {
			backgroundColor,
			transform: [{ scale: scaleValue.value }],
		};
	});

	const animatedIconStyle = useAnimatedStyle(() => {
		return {
			opacity: 1,
		};
	});

	// Pulsierende Kreis-Animationen - nur sichtbar wenn isAnimating true ist
	// Die Kreise starten außerhalb des Button-Radius und dehnen sich nach außen aus
	const pulseStyle1 = useAnimatedStyle(() => {
		if (!isAnimating.value) {
			return {
				transform: [{ scale: 1 }],
				opacity: 0,
			};
		}
		// Start bei 1.2 (außerhalb des Buttons) und dehne bis 2.5 aus
		const scale = 1.2 + pulse1.value * 1.3;
		const opacity = (1 - pulse1.value) * 0.4;
		return {
			transform: [{ scale }],
			opacity,
		};
	});

	const pulseStyle2 = useAnimatedStyle(() => {
		if (!isAnimating.value) {
			return {
				transform: [{ scale: 1 }],
				opacity: 0,
			};
		}
		const scale = 1.2 + pulse2.value * 1.3;
		const opacity = (1 - pulse2.value) * 0.3;
		return {
			transform: [{ scale }],
			opacity,
		};
	});

	const pulseStyle3 = useAnimatedStyle(() => {
		if (!isAnimating.value) {
			return {
				transform: [{ scale: 1 }],
				opacity: 0,
			};
		}
		const scale = 1.2 + pulse3.value * 1.3;
		const opacity = (1 - pulse3.value) * 0.2;
		return {
			transform: [{ scale }],
			opacity,
		};
	});

	const handlePress = () => {
		scaleValue.value = withSpring(0.9, { damping: 10 }, () => {
			scaleValue.value = withSpring(1, { damping: 10 });
		});

		if (!checked) {
			triggerHaptic(Haptics.NotificationFeedbackType.Success);
		} else {
			triggerHaptic(Haptics.NotificationFeedbackType.Warning);
		}

		onValueChange(!checked);
	};

	const mySize = scale(size);

	return (
		<View style={[styles.container, style]} pointerEvents="box-none">
			{/* Pulsierende Kreise - nur sichtbar wenn aktiviert, außerhalb des Buttons */}
			{checked && (
				<>
					<Animated.View
						style={[
							styles.pulseCircle,
							{ width: mySize, height: mySize, borderRadius: mySize / 2 },
							pulseStyle1,
						]}
						pointerEvents="none"
					/>
					<Animated.View
						style={[
							styles.pulseCircle,
							{ width: mySize, height: mySize, borderRadius: mySize / 2 },
							pulseStyle2,
						]}
						pointerEvents="none"
					/>
					<Animated.View
						style={[
							styles.pulseCircle,
							{ width: mySize, height: mySize, borderRadius: mySize / 2 },
							pulseStyle3,
						]}
						pointerEvents="none"
					/>
				</>
			)}
			{/* Haupt-Button - rund und immer klickbar */}
			<Pressable
				hitSlop={scale(14)}
				onPress={handlePress}
				style={{ zIndex: 10 }}
			>
				<Animated.View
					style={[
						styles.toggleContainer,
						animatedContainerStyle,
						{ 
							width: mySize, 
							height: mySize,
							borderRadius: mySize / 2,
						},
					]}
				>
					<Animated.View style={[styles.iconContainer, animatedIconStyle]}>
						{checked ? (
							<MapIcon width={mySize * 0.6} height={mySize * 0.6} color="#fff" />
						) : (
							<GpsIcon width={mySize * 1.4} height={mySize * 1.3} color="#146CEB" />
						)}
					</Animated.View>
				</Animated.View>
			</Pressable>
		</View>
	);
}

const styles = ScaledSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	pressableButton: {
		zIndex: 10,
	},
	toggleContainer: {
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
	},
	iconContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	pulseCircle: {
		position: "absolute",
		backgroundColor: "#007AFF", // iOS Blau
		zIndex: 1,
	},
});
