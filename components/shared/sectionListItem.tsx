import React, { forwardRef, Ref, useImperativeHandle } from "react";
import { View } from "react-native";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

interface Props {
	onDelete: () => void;
	disableAnimation: boolean;
	children: React.ReactNode;
}

export interface ItemMethods {
	fadeOut: () => void;
	cancel: () => void;
	opacity: () => number;
}

export const SectionListItem = forwardRef<ItemMethods, Props>(
	({ onDelete, children, disableAnimation }: Props, ref: Ref<any>) => {
		const opacity = useSharedValue(1);

		function cancelAnimation() {
			opacity.value = withTiming(1, { duration: 0 });
		}

		useImperativeHandle(
			ref,
			() =>
				({
					fadeOut: () => {
						opacity.value = withTiming(
							0,
							{
								duration: 1500,
							},
							(isFinished) => {
								if (isFinished) {
									if (onDelete) {
										runOnJS(onDelete)();
									}
								}
							},
						);
					},
					opacity: () => opacity.value,
					cancel: cancelAnimation,
				}) satisfies ItemMethods,
		);

		const animatedStyle = useAnimatedStyle(() => {
			return {
				opacity: opacity.value,
			};
		});

		if (disableAnimation) {
			return <View>{children}</View>;
		}

		return <Animated.View style={animatedStyle}>{children}</Animated.View>;
	},
);
