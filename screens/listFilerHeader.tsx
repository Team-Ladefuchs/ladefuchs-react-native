import React from "react";
import { TouchableOpacity, View } from "react-native";
import { scale } from "react-native-size-matters";
import ArrowLeftBack from "@assets/generic/arrow_back-left.svg";
import { colors } from "../theme";

interface ListHeaderProps {
	children: React.ReactNode;
	onReset: () => void;
}

export function ListerFilerHeader({
	children,
	onReset,
}: ListHeaderProps): JSX.Element {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				paddingRight: scale(16),
				marginVertical: scale(8),
			}}
		>
			<View style={{ flex: 2 }}>{children}</View>
			<TouchableOpacity
				onPress={onReset}
				hitSlop={scale(8)}
				activeOpacity={0.8}
				style={{
					backgroundColor: colors.ladefuchsOrange,
					borderRadius: scale(12),
					paddingVertical: scale(3),
					height: "100%",
					width: scale(38),
					paddingHorizontal: scale(6),
				}}
			>
				<ArrowLeftBack style={{ left: scale(4), top: scale(3.5) }} />
			</TouchableOpacity>
		</View>
	);
}
