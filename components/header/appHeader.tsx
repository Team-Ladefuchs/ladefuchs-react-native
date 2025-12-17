import React, { JSX, useCallback } from "react";
import { View, TouchableOpacity, StatusBar, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppLogo } from "./appLogo";
import { colors } from "@theme";
import Zahnrad from "@assets/gearshape.svg";
import { useAppStore } from "../../state/appState";
import { ScaledSheet, scale } from "react-native-size-matters";
import { RootNavigationProp, appRoutes } from "../../appRoutes";
import { FavoriteCheckbox } from "../shared/favoriteCheckbox";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocationToggle } from "../shared/locationToggle";
import * as Location from "expo-location";

export function AppHeader(): JSX.Element {
	const navigation = useNavigation<RootNavigationProp>();

	// Separate selectors to prevent unnecessary re-renders
	const reloadBanner = useAppStore((state) => state.reloadBanner);
	const isFavoriteTariffOnly = useAppStore(
		(state) => state.isFavoriteTariffOnly,
	);
	const setisFavoriteTariffOnly = useAppStore(
		(state) => state.setisFavoriteTariffOnly,
	);
	const locationEnabled = useAppStore((state) => state.locationEnabled);
	const setLocationEnabled = useAppStore((state) => state.setLocationEnabled);
	const setShowMapView = useAppStore((state) => state.setShowMapView);

	const handleSettingsPress = useCallback(() => {
		navigation.navigate(appRoutes.settingsStack.key);
	}, [navigation]);

	const handleLocationToggle = useCallback(
		async (value: boolean) => {
			setLocationEnabled(value);
			// Wenn Standort deaktiviert wird, sofort zu Home wechseln
			if (!value) {
				setShowMapView(false);
			} else {
				// Location abrufen und ins Log schreiben wenn LocationToggle aktiviert wird
				try {
					// Berechtigungen für Location anfordern
					const { status } =
						await Location.requestForegroundPermissionsAsync();
					if (status !== "granted") {
						console.log(
							"Location-Berechtigung wurde verweigert. Status:",
							status
						);
						return;
					}

					// Aktuellen Standort abrufen
					const currentLocation = await Location.getCurrentPositionAsync({
						accuracy: Location.Accuracy.Balanced,
					});

					const locationData: any = {
						latitude: currentLocation.coords.latitude,
						longitude: currentLocation.coords.longitude,
						accuracy: currentLocation.coords.accuracy,
						altitude: currentLocation.coords.altitude,
						heading: currentLocation.coords.heading,
						speed: currentLocation.coords.speed,
						timestamp: currentLocation.timestamp,
					};

					// Reverse Geocoding für Stadt und Straße
					try {
						const reverseGeocode = await Location.reverseGeocodeAsync({
							latitude: currentLocation.coords.latitude,
							longitude: currentLocation.coords.longitude,
						});

						if (reverseGeocode && reverseGeocode.length > 0) {
							const address = reverseGeocode[0];
							locationData.street =
								address.street || address.name || "Unbekannt";
							locationData.city =
								address.city ||
								address.region ||
								"Unbekannt";
							locationData.postalCode = address.postalCode || "Unbekannt";
							locationData.country = address.country || "Unbekannt";
						}
					} catch (geocodeError) {
						console.error(
							"Fehler beim Reverse Geocoding:",
							geocodeError
						);
					}

					console.log("Aktuelle Location beim Aktivieren von LocationToggle:", locationData);
				} catch (error) {
					console.error("Fehler beim Abrufen der Location:", error);
				}
			}
		},
		[setLocationEnabled, setShowMapView]
	);

	return (
		<SafeAreaView style={styles.headerContainer} edges={Platform.OS === 'android' ? ['top', 'left', 'right'] : undefined}>
			{Platform.OS === 'ios' && (
				<StatusBar
					barStyle="dark-content"
					backgroundColor={colors.ladefuchsLightBackground}
				/>
			)}

			<View style={styles.headerLeftIcon}>
				<LocationToggle
					checked={locationEnabled}
					onValueChange={handleLocationToggle}
					size={29}
				/>
			</View>

			<View style={{ position: "absolute", top: scale(21) }}>
				<TouchableOpacity
					activeOpacity={1}
					style={styles.appLogoContainer}
					onLongPress={() => reloadBanner()}
				>
					<AppLogo size={81} />
				</TouchableOpacity>
			</View>

			<View style={styles.headerSettingsIcon}>
				<FavoriteCheckbox
					size={32}
					style={{ bottom: scale(0.5) }}
					checked={isFavoriteTariffOnly}
					onValueChange={setisFavoriteTariffOnly}
				/>
				<TouchableOpacity
					activeOpacity={0.6}
					hitSlop={scale(12)}
					onPress={handleSettingsPress}
				>
					<Zahnrad width={scale(29)} height={scale(29)} />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = ScaledSheet.create({
	headerContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.ladefuchsLightBackground,
		width: "100%",
		height: "100@s",
		...Platform.select({
			ios: { marginTop: scale(14) },
			android: { paddingTop: scale(14) },
		}),
	},
	headerLeftIcon: {
		position: "absolute",
		left: "15@s",
		bottom: "15@s",
	},
	headerSettingsIcon: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: "14@s",
		position: "absolute",
		right: "15@s",
		bottom: "15@s",
	},
	appLogoContainer: {
		left: "50%",
		transform: [{ translateX: scale(-38) }],
		...Platform.select({
			ios: { bottom: "-8@s" },
			android: { bottom: "-9@s" },
		}),
	},
});
