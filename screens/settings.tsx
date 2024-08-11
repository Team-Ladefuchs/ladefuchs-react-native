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

export function SettingsScreen() {
	return (
		<ScrollView
			style={[styles.scrollView, settingsStyle.container]}
			bounces
		>
			<View style={{ marginTop: scale(14), marginBottom: scale(2) }}>
				<NavigationItem
					title="Meine Ladetarife"
					description="Bei welchem Anbieter von Stromtarifen (EMP) bist du Kunde?"
					screenKey="customTariffs"
				/>
				<View style={styles.line} />
				<NavigationItem
					title="Meine Stromanbieter"
					description="Für welchen Ladesäulen-Anbieter (CPO) möchtest du einen Preisvergleich sehen?"
					screenKey="customOperators"
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
					title="Drittlizenzen"
					screenKey="Drittlizenzen"
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
