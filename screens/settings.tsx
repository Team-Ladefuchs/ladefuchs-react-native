import React from "react";
import { ScrollView, View } from "react-native";
import { styles } from "../theme";
import { DatenView } from "../components/about/dataView";
import { PodcastView } from "../components/about/podcastView";
import { Impressum } from "../components/about/impressum";
import { MemberView } from "../components/about/memberView";
import { AppFooter } from "../components/about/footerView";
import { Illustration } from "../components/about/illuView";
import { NavigationItem } from "../components/about/navigationItem";
import { ScaledSheet, scale } from "react-native-size-matters";
import { appRoutes } from "../appRoutes";

export function SettingsScreen() {
	return (
		<ScrollView
			style={[styles.scrollView, settingsStyle.container]}
			bounces
		>
			<View style={{ marginTop: scale(14) }}>
				<NavigationItem
					title={appRoutes.customTariffs.title}
					description="Bei welchem Anbieter von Stromtarifen (EMP) bist du Kunde?"
					screenKey={appRoutes.customTariffs.key}
				/>
				<View style={styles.line} />
				<NavigationItem
					title={appRoutes.customerOperator.title}
					description="Für welchen Ladesäulen-Anbieter (CPO) möchtest du einen Preisvergleich sehen?"
					screenKey={appRoutes.customerOperator.key}
				/>
				<View style={styles.line} />
			</View>
			<View style={settingsStyle.innerContainer}>
				<MemberView />
				<DatenView />
				<PodcastView />
				<Illustration />
				<Impressum />
				<NavigationItem
					title={appRoutes.eula.title}
					screenKey={appRoutes.eula.key}
					description="Der Blick unter die Haube 🚗"
				/>
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
