import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { colors } from "../theme";
import OperatorPicker from "../components/home/operatorPicker";
import { ChargeConditionTable } from "../components/home/chargeCondtitonTable/chargeConditionTable";
import { AppBanner } from "../components/home/appBanner";
import { ChargingTableHeader } from "../components/home/chargeCondtitonTable/chargingTableHeader";
import { useAppStore } from "../state/state";
import { OfflineView } from "../components/home/offline";
import { ScaledSheet } from "react-native-size-matters";
import i18n from "../localization";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenNavigationProp, appRoutes } from "../appRoutes";

export function HomeScreen(): JSX.Element {
	const router = useNavigation<HomeScreenNavigationProp>();

	const { appError, showOnboarding } = useAppStore(
		useShallow((state) => ({
			appError: state.appError,
			showOnboarding: state.showOnboarding,
		})),
	);

	useEffect(() => {
		if (showOnboarding === "start") {
			router.navigate(appRoutes.home.key);
		}
	}, [showOnboarding]);

	if (appError) {
		return <OfflineView />;
	}

	return (
		<View style={{ flex: 1 }}>
			<ChargingTableHeader />

			<ChargeConditionTable />
			<View style={styles.pickerBanner}>
				<Text style={styles.pickerBannerText} allowFontScaling={false}>
					{i18n.t("pickerheader")}
				</Text>
			</View>
			<OperatorPicker />
			<AppBanner />
		</View>
	);
}

const styles = ScaledSheet.create({
	pickerBanner: {
		paddingTop: "10@s",
		paddingBottom: "10@s",
		backgroundColor: colors.ladefuchsDarkBackground,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 5,
		zIndex: 1,
	},
	pickerBannerText: {
		fontSize: "16@s",
		color: "black",
		fontFamily: "Roboto",
	},
});
