import React from "react";
import { ScrollView, View, Text, Platform } from "react-native";
import { colors } from "../theme";
import { DatenView } from "../components/settings/dataView";
import { PodcastView } from "../components/settings/podcastView";
import { MemberView } from "../components/settings/memberView";
import { AppFooter } from "../components/settings/footerView";
import { Illustration } from "../components/settings/illuView";
import { NavigationItem } from "../components/settings/navigationItem";
import { ScaledSheet, scale } from "react-native-size-matters";
import { appRoutes } from "../appRoutes";
import { NavigationList } from "../components/settings/navigationList";
import { Impressum } from "./impressum";

export function SettingsScreen() {
	return (
		<ScrollView style={[settingsStyle.scrollView]} bounces>
			<View style={settingsStyle.viewContainer}>
				<NavigationList
					style={{
						marginTop: scale(16),
						marginBottom: scale(32),
						paddingHorizontal: scale(16),
					}}
				>
					<NavigationItem
						title={appRoutes.customTariffs.title}
						description={`Bei welchem Anbieter von Stromtarifen (EMP)\nbist du Kunde?`}
						screenKey={appRoutes.customTariffs.key}
					/>
					<NavigationItem
						title={appRoutes.customerOperator.title}
						description={`Für welchen Ladesäulen-Anbieter  (CPO)\nmöchtest du einen Preisvergleich sehen?`}
						screenKey={appRoutes.customerOperator.key}
					/>
				</NavigationList>
				<View style={settingsStyle.separator}>
					<Text style={settingsStyle.separatorText}>Infos</Text>
				</View>
				<View style={settingsStyle.innerContainer}>
					<MemberView />
					<DatenView />
					<Illustration />
					<PodcastView />
					<Impressum />
					<NavigationItem
						title={appRoutes.eula.title}
						screenKey={appRoutes.eula.key}
						description="Der Blick unter die Haube 🚘⚡️"
					/>
				</View>
				<AppFooter />
			</View>
		</ScrollView>
	);
}
const settingsStyle = ScaledSheet.create({
	viewContainer: {
		backgroundColor: colors.ladefuchsLightBackground,
		flex: 1,
	},
	scrollView: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: colors.ladefuchsDunklerBalken,
	},
	navigationList: {
		marginTop: "16@s",
		marginBottom: "32@s",
		paddingHorizontal: "16@s",
	},
	separatorText: {
		fontSize: "15@s",
		fontWeight: "bold",
		...Platform.select({
			android: {
				textAlign: "left",
			},
			default: {
				textAlign: "center",
			},
		}),
	},
	separator: {
		backgroundColor: colors.ladefuchsDunklerBalken,
		paddingHorizontal: "16@s",
		paddingVertical: "16@s",
	},
	innerContainer: {
		paddingHorizontal: "20@s",
		marginTop: "14@s",
		paddingBottom: "16@s",
		gap: "3@s",
	},
});
