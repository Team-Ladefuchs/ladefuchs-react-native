import React from "react";
import { ScrollView } from "react-native";
import { styles } from "../theme";
import { DatenView } from "../components/about/dataView";
import { PodcastView } from "../components/about/podcastView";
import { Impressum } from "../components/about/impressum";
import { MemberView } from "../components/about/memberView";
import { AppFooter } from "../components/about/footerView";
import { Illustration } from "../components/about/illuView";
import { Teamfuchs } from "../components/about/headerView";
import {MyMSP} from "../components/about/myMSP";
import { MyCPO } from "../components/about/myCPO";
import { LicenseView } from "../components/about/licenses";


export function AboutScreen() {

	return (
		<ScrollView style={styles.scrollView} bounces>

			<MyMSP/>

			<MyCPO/>

			<Teamfuchs />

			<MemberView />

			<DatenView />

			<PodcastView />

			<Illustration />

			<Impressum />

			<LicenseView/>

			<AppFooter />
		</ScrollView>
	);
}
