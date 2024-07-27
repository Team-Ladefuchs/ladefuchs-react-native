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

export function AboutScreen() {
	return (
		<ScrollView style={styles.scrollView} bounces>
			<View>
				<NavigationItem
					title="Meine Ladetarife"
					description="Wenn Du Kunde bei einem anderen als unserem Standard-Ladekarten..."
					screenName="Meine Ladetarife"
				/>
				<View style={styles.line} />
				<NavigationItem
					title="Meine Stromanbieter"
					description="Wenn Du einen anderen Ladesäulen-Betreiber..."
					screenName="Meine Stromanbieter"
				/>
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
