import { View, Image } from "react-native";
import { dropShadow } from "../home/chargeCondition";
import { authHeader } from "../../functions/api";
import { CardImage } from "../cardImage";
import { Tariff } from "../../types/tariff";

export function Logos({
	tariff,
	operatorImageUrl,
}: {
	tariff: Tariff | null;
	operatorImageUrl: string | null;
}): JSX.Element {
	return (
		<>
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
					tariff={tariff}
					width={88}
					style={{
						transform: [{ rotate: "-15deg" }],
					}}
				/>
				<Image
					source={{ uri: operatorImageUrl, ...authHeader }}
					height={120}
					width={180}
					style={{
						objectFit: "scale-down",
					}}
				/>
			</View>
		</>
	);
}
