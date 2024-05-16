import { View, Image } from "react-native";
import { dropShadow } from "../chargeCard";
import { authHeader } from "../../functions/api";

export function Logos({
	tariffImageUrl,
	operatorImageUrl,
}: {
	tariffImageUrl: string | null;
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
				<View
					style={{
						...dropShadow,
					}}
				>
					<Image
						source={{ uri: tariffImageUrl, ...authHeader }}
						height={55}
						width={88}
						style={{
							transform: [{ rotate: "-15deg" }],
							borderRadius: 4,
						}}
					/>
				</View>

				<Image
					source={{ uri: operatorImageUrl, ...authHeader }}
					height={140}
					width={180}
					style={{
						objectFit: "scale-down",
					}}
				/>
			</View>
		</>
	);
}
