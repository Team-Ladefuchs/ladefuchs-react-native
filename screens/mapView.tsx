import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { colors } from "@theme";
import { scale } from "react-native-size-matters";
import { sendLocationToAPI } from "../utils/locationAPI";
import Svg, { Path, Circle } from "react-native-svg";
import { LocationToggle } from "../components/shared/locationToggle";

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
	Connections: {
		ID: number;
		ConnectionTypeID: number;
		PowerKW: number | null;
		CurrentTypeID: number | null;
		Quantity: number | null;
	}[];
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

interface MapViewScreenProps {
	onLocationSelected?: (payload: { street: string | null; city: string | null }) => void;
}

export function MapViewScreen({ onLocationSelected }: MapViewScreenProps): React.JSX.Element {
	const [location, setLocation] = useState<LocationCoords | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);
	const [loadingStations, setLoadingStations] = useState<boolean>(false);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const mapRef = useRef<MapView | null>(null);
	const lastRegionRef = useRef<Region | null>(null);
	const isMountedRef = useRef<boolean>(true);
	const isLoadingRef = useRef<boolean>(false);

	const OPENCHARGEMAP_API_KEY = "df7f6a4f-eac3-48e4-9576-aeb839d9d134";
	const SEARCH_RADIUS_KM = 100;
	const DEBOUNCE_DELAY_MS = 1000; // 1 Sekunde Verzögerung vor dem Nachladen
	const MIN_DISTANCE_CHANGE_KM = 50; // Mindestdistanz in km, bevor neu geladen wird

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
				
				// Setze initiale Region
				lastRegionRef.current = {
					latitude: coords.latitude,
					longitude: coords.longitude,
					latitudeDelta: coords.latitudeDelta,
					longitudeDelta: coords.longitudeDelta,
				};
				
				// Lade Ladestationen in der Nähe
				fetchChargingStations(coords.latitude, coords.longitude);
			} catch (error) {
				console.error("Fehler beim Abrufen des Standorts:", error);
				setErrorMsg("Fehler beim Abrufen des Standorts");
				setLoading(false);
			}
		})();
	}, []);

	// Berechnet die Distanz zwischen zwei Koordinaten in Kilometern (Haversine-Formel)
	const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
		const R = 6371; // Radius der Erde in km
		const dLat = (lat2 - lat1) * (Math.PI / 180);
		const dLon = (lon2 - lon1) * (Math.PI / 180);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * (Math.PI / 180)) *
				Math.cos(lat2 * (Math.PI / 180)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	};

	const fetchChargingStations = async (lat: number, lon: number) => {
		if (!isMountedRef.current || isLoadingRef.current) return;
		
		isLoadingRef.current = true;
		setLoadingStations(true);
		try {
			const url = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lon}&distance=${SEARCH_RADIUS_KM}&distanceunit=km&maxresults=50&compact=false&verbose=false&key=${OPENCHARGEMAP_API_KEY}`;
			
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const data: ChargingStation[] = await response.json();
			if (isMountedRef.current) {
				// Filtere "Business owner at location" Standorte heraus
				const filteredData = data.filter((station) => {
					const usageTypeTitle = station.UsageType?.Title?.toLowerCase() || "";
					const operatorTitle = station.OperatorInfo?.Title?.toLowerCase() || "";
					const addressTitle = station.AddressInfo?.Title?.toLowerCase() || "";
					
					// Prüfe verschiedene Varianten und Felder
					const isBusinessOwner = 
						usageTypeTitle.includes("business owner at location") ||
						usageTypeTitle.includes("business owner") ||
						operatorTitle.includes("business owner at location") ||
						operatorTitle.includes("business owner") ||
						addressTitle.includes("business owner at location") ||
						addressTitle.includes("business owner");
					
					return !isBusinessOwner;
				});
				setChargingStations(filteredData);
				console.log(`${filteredData.length} Ladestationen gefunden (${data.length - filteredData.length} Business Owner Standorte ausgeblendet)`);
			}
		} catch (error) {
			console.error("Fehler beim Laden der Ladestationen:", error);
		} finally {
			isLoadingRef.current = false;
			if (isMountedRef.current) {
				setLoadingStations(false);
			}
		}
	};

	const handleRegionChangeComplete = (region: Region) => {
		if (!isMountedRef.current || isLoadingRef.current) return;

		// Prüfe, ob sich die Region signifikant geändert hat
		if (lastRegionRef.current) {
			const distance = calculateDistance(
				lastRegionRef.current.latitude,
				lastRegionRef.current.longitude,
				region.latitude,
				region.longitude
			);

			// Nur neu laden, wenn sich die Region um mindestens MIN_DISTANCE_CHANGE_KM geändert hat
			if (distance < MIN_DISTANCE_CHANGE_KM) {
				return;
			}
		}

		// Lösche vorherigen Timer, falls vorhanden
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
			debounceTimerRef.current = null;
		}

		// Setze neuen Timer für Debouncing
		debounceTimerRef.current = setTimeout(() => {
			if (isMountedRef.current && !isLoadingRef.current) {
				lastRegionRef.current = region;
				// Lade Ladestationen für den neuen Kartenmittelpunkt
				fetchChargingStations(region.latitude, region.longitude);
			}
		}, DEBOUNCE_DELAY_MS);
	};

	const handleSelectStation = (station: ChargingStation) => {
		// Fällt auf Titel zurück, falls keine Straße vorhanden ist
		const street = station.AddressInfo.AddressLine1 || station.AddressInfo.Title || null;
		const city =
			station.AddressInfo.Town ||
			station.AddressInfo.StateOrProvince ||
			station.AddressInfo.Postcode ||
			null;

		// Logging der gewählten Location aus dem MapView
		const selectedLocationData = {
			latitude: station.AddressInfo.Latitude,
			longitude: station.AddressInfo.Longitude,
			street: street,
			city: city,
			postcode: station.AddressInfo.Postcode || "Unbekannt",
			distance: station.AddressInfo.Distance ? `${station.AddressInfo.Distance.toFixed(2)} km` : "Unbekannt",
			operator: station.OperatorInfo?.Title || "Unbekannt",
			stationId: station.ID,
		};
		console.log("Gewählte Location aus MapView:", selectedLocationData);

		// Location an API senden
		sendLocationToAPI({
			latitude: station.AddressInfo.Latitude,
			longitude: station.AddressInfo.Longitude,
		});

		if (onLocationSelected) {
			onLocationSelected({ street, city });
		}
	};

	// Cleanup für den Timer beim Unmount
	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
				debounceTimerRef.current = null;
			}
		};
	}, []);

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
				ref={mapRef}
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
				onRegionChangeComplete={handleRegionChangeComplete}
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
					const maxPower = station.Connections.length > 0
						? Math.max(
								...station.Connections
									.map((conn) => conn.PowerKW || 0)
									.filter((power) => power > 0)
							)
						: 0;

					return (
						<Marker
							key={station.ID}
							coordinate={{
								latitude: station.AddressInfo.Latitude,
								longitude: station.AddressInfo.Longitude,
							}}
							anchor={{ x: 0.5, y: 0.5 }}
							tracksViewChanges={false}
						>
							<View style={styles.markerCalloutContainer}>
								<View style={styles.calloutSingleRow}>
									{station.OperatorInfo && (
										<Text style={styles.calloutTitle} numberOfLines={1}>
											{station.OperatorInfo.Title}
										</Text>
									)}
									{station.Connections.length > 0 && (
										<View style={styles.connectionsRingContainer}>
											<Svg width={scale(28)} height={scale(28)} viewBox="0 0 28 28">
												<Circle
													cx="14"
													cy="14"
													r="10"
													fill="#E0E0E0"
												/>
												{Array.from({ length: station.Connections.length }).map((_, index) => {
													const totalConnections = station.Connections.length;
													const gapAngle = 0.15; // Abstand zwischen Segmenten in Radiant
													const anglePerSegment = (2 * Math.PI) / totalConnections - gapAngle;
													const startAngle = index * (2 * Math.PI / totalConnections) + gapAngle / 2 - Math.PI / 2;
													const endAngle = startAngle + anglePerSegment;
													
													const centerX = 14;
													const centerY = 14;
													const innerRadius = 8;
													const outerRadius = 12;
													
													const x1 = centerX + innerRadius * Math.cos(startAngle);
													const y1 = centerY + innerRadius * Math.sin(startAngle);
													const x2 = centerX + outerRadius * Math.cos(startAngle);
													const y2 = centerY + outerRadius * Math.sin(startAngle);
													const x3 = centerX + outerRadius * Math.cos(endAngle);
													const y3 = centerY + outerRadius * Math.sin(endAngle);
													const x4 = centerX + innerRadius * Math.cos(endAngle);
													const y4 = centerY + innerRadius * Math.sin(endAngle);
													
													const largeArcFlag = anglePerSegment > Math.PI ? 1 : 0;
													
													const pathData = [
														`M ${x1} ${y1}`,
														`L ${x2} ${y2}`,
														`A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
														`L ${x4} ${y4}`,
														`A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
														`Z`,
													].join(" ");
													
													return (
														<Path
															key={index}
															d={pathData}
															fill={colors.ladefuchsOrange}
															stroke="#fff"
															strokeWidth={1.5}
														/>
													);
												})}
											</Svg>
											{maxPower > 0 && (
												<View style={styles.ringCenterText}>
													<Text style={styles.ringCenterTextValue}>{maxPower}</Text>
													<Text style={styles.ringCenterTextUnit}>kW</Text>
												</View>
											)}
										</View>
									)}
									<LocationToggle
										checked={true}
										onValueChange={() => handleSelectStation(station)}
										size={20}
									/>
								</View>
								<View style={styles.markerTriangle}>
									<Svg width={scale(8)} height={scale(6)} viewBox="0 0 8 6">
										<Path
											d="M 0 0 L 4 6 L 8 0 Z"
											fill="rgba(255, 255, 255, 0.9)"
										/>
									</Svg>
								</View>
							</View>
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
	markerCalloutContainer: {
		backgroundColor: "rgba(255, 255, 255, 0.9)",
		padding: scale(5),
		borderRadius: scale(4),
		alignSelf: "flex-start",
		position: "relative",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.25,
		shadowRadius: 2,
		elevation: 3,
	},
	markerTriangle: {
		position: "absolute",
		bottom: scale(-6),
		left: "50%",
		marginLeft: scale(-4),
		alignItems: "center",
		justifyContent: "center",
	},
	calloutContainer: {
		padding: scale(10),
		minWidth: scale(200),
	},
	calloutHeaderRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: scale(4),
		gap: scale(4),
	},
	calloutSingleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: scale(6),
	},
	calloutTitle: {
		fontFamily: "Roboto-Bold",
		fontSize: scale(10),
		color: colors.text,
	},
	calloutInfoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: scale(2),
	},
	calloutInfoText: {
		fontFamily: "Roboto",
		fontSize: scale(9),
		color: colors.text,
	},
	connectionsVisual: {
		flexDirection: "row",
		alignItems: "center",
		gap: scale(4),
	},
	connectionsRingContainer: {
		width: scale(28),
		height: scale(28),
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
	},
	ringCenterText: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center",
	},
	ringCenterTextValue: {
		fontFamily: "Roboto-Bold",
		fontSize: scale(7),
		color: colors.text,
		lineHeight: scale(8),
	},
	ringCenterTextUnit: {
		fontFamily: "Roboto",
		fontSize: scale(5),
		color: colors.text,
		lineHeight: scale(6),
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
	calloutSelectButton: {
		backgroundColor: colors.ladefuchsOrange,
		padding: scale(4),
		borderRadius: scale(3),
		alignItems: "center",
		justifyContent: "center",
		minWidth: scale(20),
		minHeight: scale(20),
	},
	calloutSelectButtonText: {
		color: "#fff",
		fontFamily: "Roboto-Bold",
		fontSize: scale(10),
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
		fontSize: scale(10),
		color: colors.text,
	},
});

