import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors } from "../../theme";
import { CardHeader } from "./cardHeader";
import { ItalicText } from "./ItalicText";
import { Svg, G, Path } from "react-native-svg";

export function BlockingFee({
	feeStart,
	fee,
}: {
	feeStart?: number | null;
	fee?: number | null;
}): JSX.Element {
	let textBlock: JSX.Element;
	let shouldHighlightCorner = false;

	if (feeStart && fee) {
		textBlock = (
			<View>
				<ItalicText text={`› ab Minute ${feeStart}`} />
				<ItalicText text={`› ${fee} € / Minute`} />
			</View>
		);
		shouldHighlightCorner = true;
	} else {
		textBlock = <ItalicText text="› keine" />;
	}

	return (
		<View style={styles.container}>
			{shouldHighlightCorner && <HighlightCorner />}
			<CardHeader text="Blockiergebühr" />
			{textBlock}
		</View>
	);
}

function HighlightCorner() {
	return (
		<Svg
			style={styles.highlightCorner}
			width="20"
			height="20"
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
	container: {
		position: "relative",
		backgroundColor: colors.ladefuchsLightGrayBackground,
		padding: 12,
		borderRadius: 12,
		marginTop: 4,
		height: 81,
	},
	highlightCorner: {
		position: "absolute",
		top: 0,
		right: 0,
	},
});

export default BlockingFee;
