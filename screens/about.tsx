import React from "react";
import { ScrollView } from "react-native";
import { styles } from "../theme";
import { Datenview } from "../components/aboutScreen/dataView";
import { PodcastView } from "../components/aboutScreen/podcastView";
import { Impressum } from "../components/aboutScreen/impressum";
import { Memberview } from "../components/aboutScreen/memberView";
import { AppFooter } from "../components/aboutScreen/licenseView";
import { Illustration } from "../components/aboutScreen/illuView";
import { Teamfuchs } from "../components/aboutScreen/headerView";

export function AboutScreen() {
	return (
		<ScrollView style={styles.scrollView} bounces>
			<Teamfuchs />

			<Memberview />

			<Datenview />

			<PodcastView />

			<Illustration />

			<Impressum />

			<AppFooter />
		</ScrollView>
	);
}
