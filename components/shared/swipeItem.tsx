import React, { forwardRef, Ref, useImperativeHandle } from "react";
import { View } from "react-native";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";
import { useShakeDetector } from "../../hooks/useShakeDetector";

interface Props {
	onDelete: () => void;
	disableSwipe: boolean;
	children: React.ReactNode;
}

export interface ItemMethods {
	fadeOut: () => void;
	cancel: () => void;
}

export const SwipeItem = forwardRef<ItemMethods, Props>(
	({ onDelete, children, disableSwipe }: Props, ref: Ref<any>) => {
		const opacity = useSharedValue(1);

		useShakeDetector(cancelAnimation);

		function cancelAnimation() {
			opacity.value = withTiming(1, { duration: 0 });
		}

		useImperativeHandle(ref, () => ({
			fadeOut: () => {
				opacity.value = withTiming(
					0,
					{ duration: 2000 },
					(isFinished) => {
						if (isFinished) {
							opacity.value = withDelay(
								110,
								withTiming(1, { duration: 0 }),
							);
							if (onDelete) {
								runOnJS(onDelete)();
							}
						}
					},
				);
			},
			cancel: cancelAnimation,
		}));

		const animatedStyle = useAnimatedStyle(() => {
			return {
				opacity: opacity.value,
			};
		});

		if (disableSwipe) {
			return <View>{children}</View>;
		}

		return <Animated.View style={animatedStyle}>{children}</Animated.View>;
	},
);
