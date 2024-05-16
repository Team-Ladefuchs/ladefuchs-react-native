import { View, Text } from "react-native";
import { colors } from "../theme";
import { Tariff } from "../types/tariff";
import { TariffCondition } from "../types/conditions";

import { useContext } from "react";
import { AppStateContext } from "../contexts/appStateContext";

import { Logos } from "../components/detailScreen/logos";
import { PriceBox } from "../components/detailScreen/priceBox";
import { AffiliateButton } from "../components/affiliateButton";
import { Notes } from "../components/detailScreen/notes";
import { MonthlyFee } from "../components/detailScreen/monthlyFee";
import { BlockingFee } from "../components/detailScreen/blockingFee";

export function DetailScreen({ route }) {
	const { operators, operatorId, tariffConditions } =
		useContext(AppStateContext);

	const operator = operators.find((item) => item.identifier === operatorId);

	const { tariff } = route.params as {
		tariff: Tariff;
		tariffCondition: TariffCondition;
	};

	const [acTariffCondition, dcTariffCondition] = tariffConditions
		.filter((item) => item.tariffId === tariff.identifier)
		.sort((a, b) => a.chargingMode.localeCompare(b.chargingMode));

	return (
		<View
			style={{
				backgroundColor: colors.ladefuchsLightBackground,
				height: "100%",
				paddingTop: 16,
				paddingHorizontal: 16,
			}}
		>
			<Logos
				tariffImageUrl={tariff.imageUrl}
				operatorImageUrl={operator.imageUrl}
			/>
			<View
				style={{
					flexDirection: "row",
					marginTop: 16,
					gap: 16,
					rowGap: 20,
				}}
			>
				<View style={{ flex: 1 }}>
					<PriceBox
						chargeMode="ac"
						price={acTariffCondition.pricePerKwh}
					/>
					<BlockingFee
						fee={acTariffCondition.blockingFeeStart}
						feeStart={acTariffCondition.blockingFeeStart}
					/>
				</View>

				<View style={{ flex: 1 }}>
					<PriceBox
						chargeMode="dc"
						price={dcTariffCondition.pricePerKwh}
					/>
					<BlockingFee
						fee={dcTariffCondition.blockingFeeStart}
						feeStart={dcTariffCondition.blockingFeeStart}
					/>
				</View>
			</View>
			<MonthlyFee fee={tariff.monthlyFee} />
			<Notes notes={tariff.note} />
			<AffiliateButton link={tariff.affiliateLinkUrl} />
		</View>
	);
}
