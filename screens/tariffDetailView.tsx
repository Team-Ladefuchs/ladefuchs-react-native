import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import { colors } from "../theme";
import { Tariff } from "../types/tariff";
import { ChargeMode, TariffCondition } from "../types/conditions";
import { DetailLogos } from "../components/detail/detailLogos";
import { PriceBox } from "../components/detail/priceBox";
import { AffiliateButton } from "../components/detail/affiliateButton";
import { Notes } from "../components/detail/notes";
import { MonthlyFee } from "../components/detail/monthlyFee";
import { BlockingFee } from "../components/detail/blockingFee";
import { useAppStore } from "../state/state";
import { useShallow } from "zustand/react/shallow";
import { ScrollView } from "react-native-gesture-handler";
import { ScaledSheet } from "react-native-size-matters";
import { FeedbackButton } from "../components/detail/feedbackButton";
import { useNavigation } from "@react-navigation/native";
import { appRoutes } from "../appRoutes";

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
		(item) =>
			item.tariffId === tariffId && item.chargingMode === chargeMode,
	);
}

export function TariffDetailView({ route }: { route: any }): JSX.Element {
	const navigation = useNavigation();

	const [operators, operatorId, tariffConditions] = useAppStore(
		useShallow((state) => [
			state.operators,
			state.operatorId,
			state.tariffConditions,
		]),
	);

	const operator = useMemo(() => {
		return operators.find((item) => item.identifier === operatorId);
	}, [operators, operatorId]);

	const { tariff } = route.params as {
		tariff: Tariff;
	};

	const getTariffCondition = useCallback(
		(chargeMode: ChargeMode) => {
			return findTariffCondition({
				tariffConditions,
				chargeMode,
				tariffId: tariff?.identifier,
			});
		},
		[tariff?.identifier, tariffConditions],
	);

	const acTariffCondition = useMemo(
		() => getTariffCondition("ac"),
		[getTariffCondition],
	);
	const dcTariffCondition = useMemo(
		() => getTariffCondition("dc"),
		[getTariffCondition],
	);

	return (
		<View style={styles.detailView}>
			<ScrollView touchAction={"none"}>
				<View style={styles.scrollView}>
					<DetailLogos tariff={tariff} operator={operator!} />
					<View style={styles.priceBoxesContainer}>
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
					<FeedbackButton
						onPress={() => {
							// @ts-ignore
							navigation.navigate(appRoutes.feedback.key, {
								tariff,
								acTariffCondition,
								dcTariffCondition,
								operator,
							});
						}}
					/>
				</View>
			</ScrollView>

			<AffiliateButton link={tariff.affiliateLinkUrl} />
		</View>
	);
}

const styles = ScaledSheet.create({
	detailView: {
		backgroundColor: colors.ladefuchsLightBackground,
		height: "100%",
	},
	priceBoxesContainer: {
		flexDirection: "row",
		marginTop: 14,
		gap: "14@s",
	},
	scrollView: {
		paddingTop: 14,
		paddingHorizontal: 16,
	},
});
