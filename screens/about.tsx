import React from "react";
import {
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	Linking,
} from "react-native";
import { styles } from "../theme";
import { useFonts } from "expo-font";
import { Datenview } from "../components/aboutScreen/dataView";
import { Podcastview } from "../components/aboutScreen/podcastView";
import { Impressum } from "../components/aboutScreen/impressum";
import { Memberview } from "../components/aboutScreen/memberView";
import { Lizenzen } from "../components/aboutScreen/lizenzView";
import { Illustration } from "../components/aboutScreen/illuView";
import { Teamfuchs } from "../components/aboutScreen/headerView";

export function AboutScreen() {
	const [fontsLoaded] = useFonts({
		Bitter: require("../assets/fonts/Bitter-Italic.ttf"),
		// Fügen Sie hier weitere Schriftarten hinzu, falls erforderlich

		Roboto: require("../assets/fonts/Roboto-Bold.ttf"),
	});

	if (!fontsLoaded) {
		return <View></View>;
	}
	return (
		<ScrollView style={styles.scrollView} bounces>
			<Teamfuchs />

			<Memberview />

			<Datenview />

			<Podcastview />

			<Illustration />

			<Impressum />

			<Lizenzen />
		</ScrollView>
	);
}
