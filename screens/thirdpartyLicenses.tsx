import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	Linking,
	TouchableOpacity,
} from "react-native";

// Importiere die Lizenzdatei direkt
import licenses from "@assets/licenses.json";

export function LicenseView(): JSX.Element {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadLicenses = async () => {
			try {
				// Simuliere eine Verzögerung, um den Ladevorgang zu demonstrieren
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} catch (error) {
				console.error("Error loading licenses:", error);
			} finally {
				setLoading(false);
			}
		};

		loadLicenses();
	}, []);

	const renderItem = ({ item }) => {
		const [packageName, licenseInfo] = item;
		const [name, version] = packageName.split("@");
		return (
			<View style={styles.item}>
				{licenseInfo.repository && (
					<TouchableOpacity
						onPress={() => Linking.openURL(licenseInfo.repository)}
					>
						<Text style={styles.name}>{name}</Text>
						<Text style={styles.version}>Version: {version}</Text>
						<Text style={styles.license}>
							License: {licenseInfo.licenses}
						</Text>

						<Text style={styles.repo}>
							{licenseInfo.repository}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	if (loading) {
		return <ActivityIndicator size="large" color="#0000ff" />;
	}

	return (
		<FlatList
			data={Object.entries(licenses)}
			keyExtractor={(item) => item[0]}
			renderItem={renderItem}
			contentContainerStyle={styles.container}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		backgroundColor: "#F3EEE2",
	},
	item: {
		marginBottom: 2,
		backgroundColor: "rgba(194,180,156, 0.4)",
		padding: 5,
		marginVertical: 2,
		marginHorizontal: 6,
		borderRadius: 12,
	},
	name: {
		fontSize: 16,
		fontWeight: "bold",
		fontFamily: "Roboto",
		color: "#F2642D",
	},
	version: {
		fontSize: 14,
		fontFamily: "Bitter",
	},
	license: {
		fontSize: 14,
		fontFamily: "Bitter",
	},
	repo: {
		textDecorationLine: "underline",
		color: "#716B61",
		fontFamily: "Bitter",
		fontStyle: "italic",
	},
});
