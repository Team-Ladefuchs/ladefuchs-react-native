import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { colors } from "@theme";
import { scale } from "react-native-size-matters";

interface LocationCoords {
	latitude: number;
	longitude: number;
	latitudeDelta: number;
	longitudeDelta: number;
}

interface ChargingStation {
	ID: number;
	AddressInfo: {
		Title: string;
		AddressLine1: string | null;
		Town: string | null;
		StateOrProvince: string | null;
		Postcode: string | null;
		Latitude: number;
		Longitude: number;
		Distance: number;
	};
	Connections: Array<{
		ID: number;
		ConnectionTypeID: number;
		PowerKW: number | null;
		CurrentTypeID: number | null;
		Quantity: number | null;
	}>;
	NumberOfPoints: number | null;
	StatusType: {
		IsOperational: boolean;
		Title: string;
	} | null;
	OperatorInfo: {
		Title: string;
	} | null;
	UsageCost: string | null;
	UsageType: {
		Title: string;
		IsPayAtLocation: boolean | null;
		IsMembershipRequired: boolean | null;
		IsAccessKeyRequired: boolean | null;
	} | null;
	GeneralComments: string | null;
}

export function MapViewScreen(): React.JSX.Element {
	const [location, setLocation] = useState<LocationCoords | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);
	const [loadingStations, setLoadingStations] = useState<boolean>(false);

	const OPENCHARGEMAP_API_KEY = "df7f6a4f-eac3-48e4-9576-aeb839d9d134";
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
			const url = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lon}&distance=${SEARCH_RADIUS_KM}&distanceunit=km&maxresults=50&compact=false&verbose=false&key=${OPENCHARGEMAP_API_KEY}`;
			
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const data: ChargingStation[] = await response.json();
			setChargingStations(data);
			console.log(`${data.length} Ladestationen gefunden`);
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
				
				{chargingStations.map((station) => (
					<Marker
						key={station.ID}
						coordinate={{
							latitude: station.AddressInfo.Latitude,
							longitude: station.AddressInfo.Longitude,
						}}
						pinColor="green"
					>
						<Callout>
							<View style={styles.calloutContainer}>
								<Text style={styles.calloutTitle}>
									{station.AddressInfo.Title}
								</Text>
								{station.AddressInfo.AddressLine1 && (
									<Text style={styles.calloutText}>
										{station.AddressInfo.AddressLine1}
									</Text>
								)}
								{station.AddressInfo.Town && (
									<Text style={styles.calloutText}>
										{station.AddressInfo.Postcode} {station.AddressInfo.Town}
									</Text>
								)}
								<Text style={styles.calloutDistance}>
									{station.AddressInfo.Distance.toFixed(2)} km entfernt
								</Text>
								{station.NumberOfPoints && (
									<Text style={styles.calloutText}>
										Ladepunkte: {station.NumberOfPoints}
									</Text>
								)}
								{station.OperatorInfo && (
									<Text style={styles.calloutText}>
										Betreiber: {station.OperatorInfo.Title}
									</Text>
								)}
								{station.StatusType && (
									<Text 
										style={[
											styles.calloutText,
											{ color: station.StatusType.IsOperational ? "green" : "red" }
										]}
									>
										Status: {station.StatusType.Title}
									</Text>
								)}
								{station.Connections.length > 0 && (
									<Text style={styles.calloutText}>
										Anschlüsse: {station.Connections.length}
										{station.Connections[0].PowerKW && ` (${station.Connections[0].PowerKW} kW)`}
									</Text>
								)}
								{station.UsageCost && station.UsageCost !== "None" && (
									<Text style={styles.calloutPrice}>
										💰 {station.UsageCost}
									</Text>
								)}
								{station.UsageType && (
									<View style={styles.usageTypeContainer}>
										<Text style={styles.calloutText}>
											{station.UsageType.Title}
										</Text>
										{station.UsageType.IsMembershipRequired && (
											<Text style={styles.usageNote}>🔑 Mitgliedschaft erforderlich</Text>
										)}
										{station.UsageType.IsAccessKeyRequired && (
											<Text style={styles.usageNote}>🔐 Zugangskarte erforderlich</Text>
										)}
									</View>
								)}
								{station.GeneralComments && (
									<Text style={styles.calloutComments}>
										ℹ️ {station.GeneralComments}
									</Text>
								)}
							</View>
						</Callout>
					</Marker>
				))}
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
		minWidth: scale(200),
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
	usageTypeContainer: {
		marginTop: scale(4),
	},
	usageNote: {
		fontFamily: "Roboto",
		fontSize: scale(11),
		marginTop: scale(2),
		color: colors.ladefuchsOrange,
		fontStyle: "italic",
	},
	calloutComments: {
		fontFamily: "Roboto",
		fontSize: scale(11),
		marginTop: scale(6),
		color: "#666",
		fontStyle: "italic",
		paddingTop: scale(6),
		borderTopWidth: 1,
		borderTopColor: "#E0E0E0",
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

