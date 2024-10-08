import { View } from "react-native";
import { CardImage } from "../shared/cardImage";
import { Tariff } from "../../types/tariff";
import React from "react";
import { Operator } from "../../types/operator";
import { OperatorImage } from "../shared/operatorImage";
interface Props {
	tariff: Tariff;
	operator: Operator | null;
}

export function DetailLogos({ tariff, operator }: Props): JSX.Element {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				gap: 5,
			}}
		>
			<CardImage
				imageUrl={tariff.imageUrl}
				name={tariff.name}
				width={79}
				style={{
					transform: [{ rotate: "-15deg" }],
				}}
			/>
			{operator && (
				<OperatorImage
					name={operator.name}
					imageUrl={operator.imageUrl}
					height={125}
					width={180}
				/>
			)}
		</View>
	);
}
