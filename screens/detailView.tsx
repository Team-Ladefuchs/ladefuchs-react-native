import { View, Image, Text, StyleSheet } from "react-native";
import { colors } from "../theme";
import { Tariff } from "../types/tariff";
import { ChargeMode, TariffCondition } from "../types/conditions";
import { authHeader } from "../functions/api";
import { useContext } from "react";
import { AppStateContext } from "../contexts/appStateContext";
import CCS from "../assets/ccs.svg";
import Typ2 from "../assets/typ2.svg";

export function DetailScreen({ route }) {
	/* 2. Get the param */

	const { operators, operatorId } = useContext(AppStateContext);

	const currentOperator = operators.find(
		(item) => item.identifier === operatorId
	);

	const { tariff, tariffCondition } = route.params as {
		tariff: Tariff;
		tariffCondition: TariffCondition;
	};
	return (
		<View
			style={{
				backgroundColor: colors.ladefuchsLightBackground,
				height: "100%",
				paddingTop: 30,
				paddingHorizontal: 20,
			}}
		>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					gap: 5,
				}}
			>
				<Image
					source={{ uri: tariff.imageUrl, ...authHeader }}
					height={55}
					width={88}
					style={{
						transform: [{ rotate: "-15deg" }],
						borderRadius: 4,
					}}
				/>
				<Image
					source={{ uri: currentOperator.imageUrl, ...authHeader }}
					height={140}
					width={180}
					style={{
						objectFit: "scale-down",
					}}
				/>
			</View>

			<View
				style={{
					display: "flex",
					flexDirection: "row",
					marginTop: 20,
					gap: 20,
					flex: 1,
				}}
			>
				<PriceBox chargeMode="ac" price={0.59} />
				<PriceBox chargeMode="dc" price={0.79} />
			</View>
		</View>
	);
}

function PriceBox({
	chargeMode,
	price,
}: {
	chargeMode: ChargeMode;
	price: number;
}) {
	const plugSize = 25;
	const plug =
		chargeMode === "ac" ? (
			<Typ2 width={plugSize} height={plugSize} marginLeft={4} />
		) : (
			<CCS width={plugSize} height={plugSize} marginLeft={4} />
		);
	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					display: "flex",
					borderTopLeftRadius: 8,
					borderTopRightRadius: 8,
					justifyContent: "center",
					alignContent: "center",
					alignItems: "center",
					flexDirection: "row",
					paddingHorizontal: 12,
					paddingVertical: 12,
					backgroundColor: colors.ladefuchsDunklerBalken,
				}}
			>
				<Text
					style={{
						fontSize: 24,
						fontWeight: "800",
						textAlign: "center",
					}}
				>
					{chargeMode.toLocaleUpperCase()}
				</Text>
				{plug}
			</View>
			<View
				style={{
					backgroundColor: colors.ladefuchsLightGrayBackground,
					borderBottomLeftRadius: 8,
					borderBottomRightRadius: 8,
					paddingHorizontal: 12,
					paddingVertical: 12,
				}}
			>
				<Text
					style={{
						textAlign: "center",
						fontWeight: "500",
						fontSize: 49,
					}}
				>
					{price.toFixed(2)}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	headerText: {
		fontSize: 33,
		color: "black",
		fontFamily: "Roboto",
	},
	headerImage: {
		// width: 28,
		height: 28,
		resizeMode: "contain",
	},
	headerView: {
		flex: 1,
		flexDirection: "row",
		height: "100%",
		backgroundColor: colors.ladefuchsDarkBackground,
		alignItems: "center",
		justifyContent: "center",
	},
});
