import React from "react";
import { View, ViewStyle } from "react-native";
import { NavigationItem } from "./navigationItem";
import { Line } from "./line";

interface NavigationListProps {
	style?: ViewStyle;
	children: React.ReactElement<typeof NavigationItem>[];
}

export function NavigationList({ style, children }: NavigationListProps) {
	return (
		<View style={[style]}>
			{children.map(function (item, index) {
				return (
					<React.Fragment key={index}>
						{item}
						{index < children.length - 1 && <Line />}
					</React.Fragment>
				);
			})}
		</View>
	);
}
