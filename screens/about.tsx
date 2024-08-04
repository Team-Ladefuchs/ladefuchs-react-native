import React from "react";
import { ScrollView, View } from "react-native";
import { styles } from "../theme";
import { DatenView } from "../components/about/dataView";
import { PodcastView } from "../components/about/podcastView";
import { Impressum } from "../components/about/impressum";
import { MemberView } from "../components/about/memberView";
import { AppFooter } from "../components/about/footerView";
import { Illustration } from "../components/about/illuView";
import { Teamfuchs } from "../components/about/headerView";
import { LicenseView } from "../components/about/licenses";
import { NavigationItem } from "../components/about/navigationItem";
import { scale } from "react-native-size-matters";

export function AboutScreen() {
	return (
		<ScrollView style={styles.scrollView} bounces>
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
			<Teamfuchs />
			<MemberView />
			<DatenView />
			<PodcastView />
			<Illustration />
			<Impressum />
			<LicenseView />
			<AppFooter />
		</ScrollView>
	);
}
