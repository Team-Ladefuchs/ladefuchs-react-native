import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import ArrowLeftBack from "@assets/generic/arrow_back-left.svg";
import { colors } from "../../theme";
import * as Haptics from "expo-haptics";

interface ListHeaderProps {
	children: React.ReactNode;
	onReset: () => void;
}

export function ListerFilterHeader({
	children,
	onReset,
}: ListHeaderProps): JSX.Element {
	return (
		<View style={styles.container}>
			<View style={{ flex: 2 }}>{children}</View>
			<TouchableOpacity
				onPress={() => {
					Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Warning,
					);
					onReset();
				}}
				hitSlop={scale(8)}
				activeOpacity={0.8}
				style={styles.arrowLeftContainer}
			>
				<ArrowLeftBack
					style={{
						left: scale(4),
						top: scale(-1),
					}}
				/>
			</TouchableOpacity>
		</View>
	);
}

const styles = ScaledSheet.create({
	container: {
		marginHorizontal: scale(14),
		flexDirection: "row",
		alignItems: "center",
		gap: scale(14),
		marginVertical: scale(8),
	},
	arrowLeftContainer: {
		backgroundColor: colors.ladefuchsOrange,
		borderRadius: scale(12),
		paddingVertical: scale(6),
		width: scale(38),
		paddingHorizontal: scale(6),
	},
});
