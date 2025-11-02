import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { colors } from "@theme";
import OperatorPicker from "../components/home/operatorPicker";
import { ChargeConditionTable } from "../components/home/chargeCondtitonTable/chargeConditionTable";
import { AppBanner } from "../components/home/appBanner";
import { ChargingTableHeader } from "../components/home/chargeCondtitonTable/chargingTableHeader";
import { useAppStore } from "../state/appState";
import { OfflineView } from "../components/home/offline";
import { ScaledSheet } from "react-native-size-matters";
import i18n from "../translations/translations";
import { useNavigation } from "@react-navigation/native";
import { type OnboardingScreenNavigationProp, appRoutes } from "../appRoutes";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MapViewScreen } from "./mapView";

export function HomeScreen(): React.JSX.Element {
	const router = useNavigation<OnboardingScreenNavigationProp>();

	const { appError, showOnboarding, showMapView } = useAppStore(
		useShallow((state) => ({
			appError: state.appError,
			showOnboarding: state.showOnboarding,
			showMapView: state.showMapView,
		})),
	);

	useEffect(() => {
		if (showOnboarding === "start") {
			router.navigate(appRoutes.onBoarding.key);
		}
	}, [showOnboarding]);

	if (appError) {
		return <OfflineView />;
	}

	return (
		<SafeAreaProvider>
			<View style={{ flex: 1 }}>
				{showMapView ? (
					<MapViewScreen />
				) : (
					<>
						<ChargingTableHeader />
						<ChargeConditionTable />
						<View style={styles.pickerBanner}>
							<Text
								style={styles.pickerBannerText}
								allowFontScaling={false}
							>
								{i18n.t("pickerheader")}
							</Text>
						</View>
						<OperatorPicker />
						<AppBanner />
					</>
				)}
			</View>
		</SafeAreaProvider>
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
		fontWeight: "bold",
		fontFamily: "Roboto",
	},
});
