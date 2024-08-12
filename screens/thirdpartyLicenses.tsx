import React, { useCallback } from "react";
import { View, Text, FlatList, Linking, TouchableOpacity } from "react-native";

import licenses from "@assets/licenses.json";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../theme";

interface LicenseInfo {
	repository: string;
	licenses: string;
}

export function ThirdPartyLicenses(): JSX.Element {
	const renderItem = ({ item }: { item: [string, LicenseInfo] }) => {
		const [packageName, licenseInfo] = item;

		const slugName = () => {
			const parts = packageName.split("@");
			if (packageName.startsWith("@")) {
				return parts[1];
			}
			return parts[0];
		};
		return (
			<View style={styles.item}>
				{licenseInfo.repository && (
					<View>
						<Text style={styles.name}>{slugName()}</Text>
						<Text style={styles.license}>
							License: {licenseInfo.licenses}
						</Text>

						<TouchableOpacity
							activeOpacity={0.75}
							onPress={() =>
								Linking.openURL(licenseInfo.repository)
							}
						>
							<Text style={styles.repo}>
								{licenseInfo.repository}
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		);
	};

	return (
		<View style={styles.screen}>
			<FlatList
				style={styles.list}
				data={Object.entries(licenses)}
				keyExtractor={(item) => item[0]}
				renderItem={renderItem}
				contentContainerStyle={styles.itemContainer}
			/>
		</View>
	);
}

const styles = ScaledSheet.create({
	screen: {
		backgroundColor: colors.ladefuchsLightBackground,
	},
	list: {
		paddingTop: "16@s",
		marginBottom: "24@s",
	},
	itemContainer: {
		gap: 2,
	},
	item: {
		paddingVertical: "4@s",
		paddingHorizontal: "14@s",
		marginHorizontal: 6,
	},
	name: {
		fontSize: "16@s",
		fontWeight: "bold",
		fontFamily: "Roboto",
		color: "#F2642D",
	},
	version: {
		fontSize: "14@s",
		fontFamily: "Bitter",
	},
	license: {
		fontSize: "14@s",
		fontFamily: "Bitter",
	},
	repo: {
		textDecorationLine: "underline",
		color: "#716B61",
		fontFamily: "Bitter",
		fontStyle: "italic",
	},
});
