import { View } from "react-native";
import { colors } from "../theme";
import { Tariff } from "../types/tariff";
import { ChargeMode, TariffCondition } from "../types/conditions";

import { Logos } from "../components/detailScreen/logos";
import { PriceBox } from "../components/detailScreen/priceBox";
import { AffiliateButton } from "../components/affiliateButton";
import { Notes } from "../components/detailScreen/notes";
import { MonthlyFee } from "../components/detailScreen/monthlyFee";
import { BlockingFee } from "../components/detailScreen/blockingFee";
import { useAppStore } from "../state/state";
import { useShallow } from "zustand/react/shallow";

function findTariffCondition({
	tariffConditions,
	tariffId,
	chargeMode,
}: {
	tariffConditions: TariffCondition[];
	tariffId: string;
	chargeMode: ChargeMode;
}): TariffCondition | null | undefined {
	return tariffConditions.find(
		(item) => item.tariffId === tariffId && item.chargingMode === chargeMode
	);
}

export function DetailScreen({ route }): JSX.Element {
	const [operators, operatorId, tariffConditions] = useAppStore(
		useShallow((state) => [
			state.operators,
			state.operatorId,
			state.tariffConditions,
		])
	);

	const operator = operators.find((item) => item.identifier === operatorId);

	const { tariff } = route.params as {
		tariff: Tariff;
		tariffCondition: TariffCondition;
	};

	const acTariffCondition = findTariffCondition({
		tariffConditions,
		chargeMode: "ac",
		tariffId: tariff.identifier,
	});

	const dcTariffCondition = findTariffCondition({
		tariffConditions,
		chargeMode: "dc",
		tariffId: tariff.identifier,
	});

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
						price={acTariffCondition?.pricePerKwh}
					/>
					<BlockingFee
						fee={acTariffCondition?.blockingFee}
						feeStart={acTariffCondition?.blockingFeeStart}
					/>
				</View>

				<View style={{ flex: 1 }}>
					<PriceBox
						chargeMode="dc"
						price={dcTariffCondition?.pricePerKwh}
					/>
					<BlockingFee
						fee={dcTariffCondition?.blockingFee}
						feeStart={dcTariffCondition?.blockingFeeStart}
					/>
				</View>
			</View>
			<MonthlyFee fee={tariff.monthlyFee} />
			<Notes notes={tariff.note} />
			<AffiliateButton link={tariff.affiliateLinkUrl} />
		</View>
	);
}
