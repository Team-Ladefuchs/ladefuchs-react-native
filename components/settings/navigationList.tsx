import React from "react";
import { View, ViewStyle } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { NavigationItem } from "./navigationItem";
import { colors } from "../../theme";

interface NavigationListProps {
	style?: ViewStyle;
	children: React.ReactElement<typeof NavigationItem>[];
}

function NavigationList({ style, children }: NavigationListProps) {
	return (
		<View style={style}>
			{children.map(function (item, index) {
				return (
					<React.Fragment key={index}>
						{item}
						{index < children.length - 1 && (
							<View style={styles.line} />
						)}
					</React.Fragment>
				);
			})}
		</View>
	);
}

const styles = ScaledSheet.create({
	line: {
		height: "1@s",
		backgroundColor: colors.ladefuchsDarkGrayBackground,
		marginTop: "8@s",
		marginBottom: "12@s",
	},
});

export default NavigationList;
