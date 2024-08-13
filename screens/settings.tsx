import React from "react";
import { ScrollView, View } from "react-native";
import { styles } from "../theme";
import { DatenView } from "../components/settings/dataView";
import { PodcastView } from "../components/settings/podcastView";
import { MemberView } from "../components/settings/memberView";
import { AppFooter } from "../components/settings/footerView";
import { Illustration } from "../components/settings/illuView";
import { NavigationItem } from "../components/settings/navigationItem";
import { ScaledSheet, scale } from "react-native-size-matters";
import { appRoutes } from "../appRoutes";
import NavigationList from "../components/settings/navigationList";

export function SettingsScreen() {
	return (
		<ScrollView
			style={[styles.scrollView, settingsStyle.container]}
			bounces
		>
			<NavigationList style={{ marginTop: scale(14) }}>
				<NavigationItem
					title={appRoutes.customTariffs.title}
					description="Bei welchem Anbieter von Stromtarifen (EMP) bist du Kunde?"
					screenKey={appRoutes.customTariffs.key}
				/>
				<NavigationItem
					title={appRoutes.customerOperator.title}
					description="Für welchen Ladesäulen-Anbieter (CPO) möchtest du einen Preisvergleich sehen?"
					screenKey={appRoutes.customerOperator.key}
				/>
			</NavigationList>
			<View style={settingsStyle.innerContainer}>
				<MemberView />
				<Illustration />
				<DatenView />
				<PodcastView />

				<NavigationList>
					<NavigationItem
						title={appRoutes.impressum.title}
						screenKey={appRoutes.impressum.key}
						description="🦊💼"
					/>
					<NavigationItem
						title={appRoutes.eula.title}
						screenKey={appRoutes.eula.key}
						description="Der Blick unter die Haube 🚗"
					/>
				</NavigationList>
				<AppFooter />
			</View>
		</ScrollView>
	);
}
const settingsStyle = ScaledSheet.create({
	container: {
		display: "flex",
		flexDirection: "column",
	},
	innerContainer: {
		marginTop: "14@s",
		paddingBottom: "14@s",
		gap: "20@s",
	},
});
