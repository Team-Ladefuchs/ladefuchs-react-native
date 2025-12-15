import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
import * as Location from "expo-location";

export function HomeScreen(): React.JSX.Element {
	const router = useNavigation<OnboardingScreenNavigationProp>();
	const [street, setStreet] = useState<string | null>(null);
	const [city, setCity] = useState<string | null>(null);
	const [initialStreet, setInitialStreet] = useState<string | null>(null);
	const [initialCity, setInitialCity] = useState<string | null>(null);
	const [locationLabel, setLocationLabel] = useState<string>(i18n.t("locationText"));
	const handleLocationSelected = (payload: { street: string | null; city: string | null }) => {
		setStreet(payload.street);
		setCity(payload.city);
		setLocationLabel(i18n.t("selectedLocationText"));
		setShowMapView(false);
	};

	const handleUseCurrentLocation = () => {
		setStreet(initialStreet);
		setCity(initialCity);
		setLocationLabel(i18n.t("locationText"));
	};

	const { appError, showOnboarding, showMapView, setShowMapView } = useAppStore(
		useShallow((state) => ({
			appError: state.appError,
			showOnboarding: state.showOnboarding,
			showMapView: state.showMapView,
			setShowMapView: state.setShowMapView,
		})),
	);

	useEffect(() => {
		if (showOnboarding === "start") {
			router.navigate(appRoutes.onBoarding.key);
		}
	}, [showOnboarding, router]);

	// Location abrufen für Stadt und Straße
	useEffect(() => {
		(async () => {
			try {
				const { status } =
					await Location.requestForegroundPermissionsAsync();
				if (status !== "granted") {
					return;
				}

				const currentLocation = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Balanced,
				});

				const reverseGeocode = await Location.reverseGeocodeAsync({
					latitude: currentLocation.coords.latitude,
					longitude: currentLocation.coords.longitude,
				});

				if (reverseGeocode && reverseGeocode.length > 0) {
					const address = reverseGeocode[0];
					const resolvedStreet = address.street || address.name || null;
					const resolvedCity = address.city || address.region || null;
					setStreet(resolvedStreet);
					setCity(resolvedCity);
					setInitialStreet(resolvedStreet);
					setInitialCity(resolvedCity);
				}
			} catch (error) {
				console.error("Fehler beim Abrufen der Location:", error);
			}
		})();
	}, []);

	if (appError) {
		return <OfflineView />;
	}

	return (
		<SafeAreaProvider>
			<View style={{ flex: 1 }}>
				{showMapView ? (
					<MapViewScreen onLocationSelected={handleLocationSelected} />
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
							{(street || city) && (
								<View style={styles.locationContainer}>
									<Text
										style={styles.locationText}
										allowFontScaling={false}
									>{locationLabel}
										{[city].filter(Boolean).join(", ")}
									</Text>
									<TouchableOpacity
										onPress={() => {
											if (locationLabel === i18n.t("selectedLocationText")) {
												handleUseCurrentLocation();
											} else {
												setShowMapView(true);
											}
										}}
										activeOpacity={0.7}
									>
										<Text
											style={styles.mapLinkText}
											allowFontScaling={false}
										>
											{locationLabel === i18n.t("selectedLocationText")
												? i18n.t("useCurrentLocation")
												: i18n.t("showOnMap")}
										</Text>
									</TouchableOpacity>
								</View>
							)}
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
	locationContainer: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "nowrap",
		marginTop: "4@s",
	},
	locationText: {
		color: "black",
		fontFamily: "Bitter",
		lineHeight: "20@s",
	},
	mapLinkText: {
		fontFamily: "Bitter",
		textDecorationLine: "underline",
		marginLeft: "4@s",
	},
});
