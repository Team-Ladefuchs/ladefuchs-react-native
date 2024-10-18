import { TouchableOpacity, ViewStyle, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "@theme";
import React from "react";
import { scale } from "react-native-size-matters";

interface Props {
	onPress: () => void;
	backgroundColor?: string;
	style?: ViewStyle;
}

export function CloseButton({
	onPress,
	style,
	backgroundColor = colors.ladefuchsDarkBackground,
}: Props): JSX.Element {
	const size = scale(19);
	return (
		<TouchableOpacity
			activeOpacity={0.6}
			onPress={onPress}
			hitSlop={scale(10)}
			style={{
				...style,
				// padding: 4,
			}}
		>
			<View
				style={{
					backgroundColor,
					borderRadius: 100,
					padding: scale(4),
				}}
			>
				<Svg width={size} height={size} viewBox="0 0 320 512">
					<Path
						fill={colors.ladefuchsLightBackground}
						d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"
					/>
				</Svg>
			</View>
		</TouchableOpacity>
	);
}
