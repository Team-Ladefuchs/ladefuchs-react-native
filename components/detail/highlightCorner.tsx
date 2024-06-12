import React from "react";
import { StyleSheet } from "react-native";
import Svg, { G, Path } from "react-native-svg";

interface Props {
	size?: number;
}

export function HighlightCorner({ size = 17 }: Props) {
	return (
		<Svg
			style={styles.highlightCorner}
			width={size}
			height={size}
			viewBox="0 0 78 79"
			fillRule="evenodd"
			clipRule="evenodd"
			strokeLinejoin="round"
			strokeMiterlimit={2}
		>
			<G transform="matrix(1,0,0,1,-477,-756)">
				<G transform="matrix(0.878467,0,0,0.878467,63.1579,98.0008)">
					<Path
						d="M547.547,836.094L473.494,762.04C471.455,760.002 470.845,756.936 471.948,754.272C473.052,751.609 475.651,749.872 478.534,749.872L540.241,749.872C550.99,749.872 559.716,758.598 559.716,769.346L559.716,831.054C559.716,833.937 557.979,836.536 555.315,837.639C552.652,838.743 549.586,838.133 547.547,836.094Z"
						fill="rgb(228,40,16)"
					/>
				</G>
			</G>
		</Svg>
	);
}

const styles = StyleSheet.create({
	highlightCorner: {
		position: "absolute",
		zIndex: 3,
		top: -2,
		right: -2,
		shadowColor: "#000",
		shadowOffset: { width: -1, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 4,
	},
});
