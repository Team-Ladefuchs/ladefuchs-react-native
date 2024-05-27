import React from "react";
import { ScrollView } from "react-native";
import { styles } from "../theme";
import { Datenview } from "../components/about/dataView";
import { PodcastView } from "../components/about/podcastView";
import { Impressum } from "../components/about/impressum";
import { Memberview } from "../components/about/memberView";
import { AppFooter } from "../components/about/licenseView";
import { Illustration } from "../components/about/illuView";
import { Teamfuchs } from "../components/about/headerView";

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
