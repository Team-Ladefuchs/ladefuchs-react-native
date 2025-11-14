/**
 * BEISPIEL-IMPLEMENTIERUNG: MapView mit Plugsurfing API Integration
 * 
 * Diese Datei zeigt, wie man die Plugsurfing API in die MapView integrieren könnte.
 * 
 * WICHTIG: 
 * - Erfordert Registrierung bei Plugsurfing und API-Key
 * - Diese Implementierung ist ein Beispiel und sollte angepasst werden
 * - Die Plugsurfing API kann auch mit OpenChargeMap kombiniert werden
 */

import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { colors } from "@theme";
import { scale } from "react-native-size-matters";
import {
	fetchPlugsurfingStations,
	PlugsurfingStation,
	formatPlugsurfingPrice,
	formatPlugsurfingAvailability,
} from "../functions/api/plugsurfing";

interface LocationCoords {
	latitude: number;
	longitude: number;
	latitudeDelta: number;
	longitudeDelta: number;
}

export function MapViewScreenWithPlugsurfing(): React.JSX.Element {
	const [location, setLocation] = useState<LocationCoords | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [chargingStations, setChargingStations] = useState<PlugsurfingStation[]>([]);
	const [loadingStations, setLoadingStations] = useState<boolean>(false);
	const [usePlugsurfing, setUsePlugsurfing] = useState<boolean>(true); // Toggle zwischen APIs

	const SEARCH_RADIUS_KM = 10;

	useEffect(() => {
		(async () => {
			try {
				// Berechtigungen für Location anfordern
				const { status } =
					await Location.requestForegroundPermissionsAsync();
				if (status !== "granted") {
					setErrorMsg("Berechtigung zum Zugriff auf den Standort wurde verweigert");
					setLoading(false);
					return;
				}

				// Aktuellen Standort abrufen
				const currentLocation = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Balanced,
				});

				const coords = {
					latitude: currentLocation.coords.latitude,
					longitude: currentLocation.coords.longitude,
					latitudeDelta: 0.05,
					longitudeDelta: 0.05,
				};
				setLocation(coords);
				setLoading(false);
				
				// Lade Ladestationen in der Nähe
				fetchChargingStations(coords.latitude, coords.longitude);
			} catch (error) {
				console.error("Fehler beim Abrufen des Standorts:", error);
				setErrorMsg("Fehler beim Abrufen des Standorts");
				setLoading(false);
			}
		})();
	}, []);

	const fetchChargingStations = async (lat: number, lon: number) => {
		setLoadingStations(true);
		try {
			if (usePlugsurfing) {
				// Plugsurfing API verwenden
				const stations = await fetchPlugsurfingStations(
					{ latitude: lat, longitude: lon },
					SEARCH_RADIUS_KM,
					50,
				);
				setChargingStations(stations);
				console.log(`${stations.length} Plugsurfing Stationen gefunden`);
			} else {
				// Fallback: OpenChargeMap API (wie bisher)
				// ... bestehender Code ...
			}
		} catch (error) {
			console.error("Fehler beim Laden der Ladestationen:", error);
		} finally {
			setLoadingStations(false);
		}
	};

	if (loading) {
		return (
			<View style={styles.container}>
				<View style={styles.centerContent}>
					<ActivityIndicator
						size="large"
						color={colors.ladefuchsOrange}
					/>
					<Text style={styles.loadingText}>
						Standort wird geladen...
					</Text>
				</View>
			</View>
		);
	}

	if (errorMsg) {
		return (
			<View style={styles.container}>
				<View style={styles.centerContent}>
					<Text style={styles.errorText}>{errorMsg}</Text>
				</View>
			</View>
		);
	}

	if (!location) {
		return (
			<View style={styles.container}>
				<View style={styles.centerContent}>
					<Text style={styles.errorText}>
						Standort konnte nicht ermittelt werden
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<MapView
				style={styles.map}
				provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
				initialRegion={{
					latitude: location.latitude,
					longitude: location.longitude,
					latitudeDelta: location.latitudeDelta,
					longitudeDelta: location.longitudeDelta,
				}}
				showsUserLocation={true}
				showsMyLocationButton={true}
				showsCompass={true}
			>
				<Marker
					coordinate={{
						latitude: location.latitude,
						longitude: location.longitude,
					}}
					title="Mein Standort"
					description="Hier bin ich"
					pinColor={colors.ladefuchsOrange}
				/>
				
				{chargingStations.map((station) => {
					// Marker-Farbe basierend auf Verfügbarkeit
					const availabilityRatio = station.availability.available / station.availability.total;
					let pinColor = "green";
					if (availabilityRatio === 0) {
						pinColor = "red"; // Alle belegt
					} else if (availabilityRatio < 0.3) {
						pinColor = "orange"; // Wenige verfügbar
					}

					return (
						<Marker
							key={station.id}
							coordinate={{
								latitude: station.location.latitude,
								longitude: station.location.longitude,
							}}
							pinColor={pinColor}
						>
							<Callout>
								<View style={styles.calloutContainer}>
									<Text style={styles.calloutTitle}>
										{station.name}
									</Text>
									{station.address.street && (
										<Text style={styles.calloutText}>
											{station.address.street}
										</Text>
									)}
									{station.address.city && (
										<Text style={styles.calloutText}>
											{station.address.postalCode} {station.address.city}
										</Text>
									)}
									{station.distance !== undefined && (
										<Text style={styles.calloutDistance}>
											{station.distance.toFixed(2)} km entfernt
										</Text>
									)}
									
									{/* Verfügbarkeit - NEU mit Plugsurfing */}
									<View style={styles.availabilityContainer}>
										<Text style={styles.availabilityText}>
											{formatPlugsurfingAvailability(station.availability)}
										</Text>
										{station.realTimeData && (
											<Text style={styles.realTimeBadge}>
												🟢 Echtzeit
											</Text>
										)}
									</View>

									{/* Preise - NEU mit strukturierten Daten */}
									{station.pricing && (
										<Text style={styles.calloutPrice}>
											💰 {formatPlugsurfingPrice(station.pricing)}
										</Text>
									)}

									{station.operator && (
										<Text style={styles.calloutText}>
											Betreiber: {station.operator.name}
										</Text>
									)}

									{/* Steckertypen mit Status */}
									{station.connectors.length > 0 && (
										<View style={styles.connectorsContainer}>
											<Text style={styles.calloutText}>
												Steckertypen:
											</Text>
											{station.connectors.map((connector) => (
												<View key={connector.id} style={styles.connectorRow}>
													<Text style={styles.connectorText}>
														{connector.type}
														{connector.powerKw && ` (${connector.powerKw} kW)`}
													</Text>
													<Text
														style={[
															styles.connectorStatus,
															{
																color:
																	connector.status === "available"
																		? "green"
																		: connector.status === "occupied"
																		? "orange"
																		: "red",
															},
														]}
													>
														{connector.status === "available"
															? "✓ Verfügbar"
															: connector.status === "occupied"
															? "⚡ Belegt"
															: "✗ Nicht verfügbar"}
													</Text>
												</View>
											))}
										</View>
									)}

									<Text
										style={[
											styles.calloutText,
											{
												color:
													station.status === "operational"
														? "green"
														: station.status === "temporarily_unavailable"
														? "orange"
														: "red",
											},
										]}
									>
										Status:{" "}
										{station.status === "operational"
											? "Betriebsbereit"
											: station.status === "temporarily_unavailable"
											? "Temporär nicht verfügbar"
											: "Unbekannt"}
									</Text>
								</View>
							</Callout>
						</Marker>
					);
				})}
			</MapView>
			{loadingStations && (
				<View style={styles.loadingStationsOverlay}>
					<ActivityIndicator size="small" color={colors.ladefuchsOrange} />
					<Text style={styles.loadingStationsText}>Lade Stationen...</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.ladefuchsLightBackground,
	},
	map: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	centerContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: scale(20),
	},
	loadingText: {
		marginTop: scale(16),
		fontSize: scale(16),
		color: colors.text,
		fontFamily: "Roboto",
	},
	errorText: {
		fontSize: scale(16),
		color: colors.ladefuchsOrange,
		fontFamily: "Roboto",
		textAlign: "center",
	},
	calloutContainer: {
		padding: scale(10),
		minWidth: scale(250),
	},
	calloutTitle: {
		fontFamily: "Roboto-Bold",
		fontSize: scale(14),
		marginBottom: scale(4),
		color: colors.text,
	},
	calloutText: {
		fontFamily: "Roboto",
		fontSize: scale(12),
		marginTop: scale(2),
		color: colors.text,
	},
	calloutDistance: {
		fontFamily: "Roboto-Bold",
		fontSize: scale(12),
		marginTop: scale(4),
		color: colors.ladefuchsOrange,
	},
	calloutPrice: {
		fontFamily: "Roboto-Bold",
		fontSize: scale(13),
		marginTop: scale(6),
		color: "#2E7D32",
		backgroundColor: "#E8F5E9",
		paddingHorizontal: scale(8),
		paddingVertical: scale(4),
		borderRadius: scale(4),
	},
	availabilityContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: scale(4),
		gap: scale(8),
	},
	availabilityText: {
		fontFamily: "Roboto-Bold",
		fontSize: scale(12),
		color: "#1976D2",
	},
	realTimeBadge: {
		fontFamily: "Roboto",
		fontSize: scale(10),
		color: "#4CAF50",
		backgroundColor: "#E8F5E9",
		paddingHorizontal: scale(6),
		paddingVertical: scale(2),
		borderRadius: scale(3),
	},
	connectorsContainer: {
		marginTop: scale(6),
		paddingTop: scale(6),
		borderTopWidth: 1,
		borderTopColor: "#E0E0E0",
	},
	connectorRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: scale(4),
	},
	connectorText: {
		fontFamily: "Roboto",
		fontSize: scale(11),
		color: colors.text,
		flex: 1,
	},
	connectorStatus: {
		fontFamily: "Roboto-Bold",
		fontSize: scale(10),
		marginLeft: scale(8),
	},
	loadingStationsOverlay: {
		position: "absolute",
		top: scale(10),
		right: scale(10),
		backgroundColor: "rgba(255, 255, 255, 0.9)",
		padding: scale(10),
		borderRadius: scale(8),
		flexDirection: "row",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	loadingStationsText: {
		marginLeft: scale(8),
		fontFamily: "Roboto",
		fontSize: scale(12),
		color: colors.text,
	},
});


