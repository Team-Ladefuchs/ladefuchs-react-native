import React from "react";
import {
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	Linking,
} from "react-native";
import { colors, fonts, styles } from "../theme";
import { useFonts } from "expo-font";
import Chargeprice from "../assets/chargeprice_logo.svg";

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
			{/* Headerview */}
			<View style={styles.headerView}>
				<Text style={styles.headLine}>TEAMFUCHS</Text>
				<Text style={styles.headerText}>
					Wir sind schuld. Wirklich! Trotzdem alle Angaben ohne
					Gewähr.
				</Text>
			</View>

			{/* Hier der neue Memberview*/}
			<View style={styles.memberView}>
				<Image
					style={styles.memberImage}
					source={require("../assets/team_malik.jpg")}
				/>

				{/* Text mit Zeilenumbrüchen rechts */}
				<View style={{ paddingVertical: 10 }}>
					<Text style={styles.headLine}>MALIK</Text>
					<Text style={styles.memberText}>Designfuchs</Text>
					{[
						{
							text: "@malik",
							style: {
								fontFamily: "Bitter",
								fontSize: 15,
								lineHeight: 30,
							},
							onPress: () =>
								Linking.openURL(
									"https://mastodon.social/@malik"
								),
							imageSource: require("../assets/icon_masto.png"), // Pfad zum Bild
						}, // Stil für die dritte Zeile mit der onPress-Funktion für den Link zur Website
						{
							text: "malik@ladefuchs.app",
							style: {
								fontFamily: "Bitter",
								fontSize: 15,
								lineHeight: 20,
							},
							onPress: () =>
								Linking.openURL("mailto:malik@ladefuchs.app"),
							imageSource: require("../assets/icon_mail.png"), // Pfad zum Bild
						}, // Stil für die dritte Zeile mit der onPress-Funktion für den Link zur E-Mail
					].map((line, index) => (
						<TouchableOpacity key={index} onPress={line.onPress}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								{line.imageSource && ( // Überprüfen, ob ein Bild vorhanden ist
									<Image
										source={line.imageSource}
										style={{
											width: 20, // Breite des Bildes anpassen
											height: 20, // Höhe des Bildes anpassen
											marginRight: 5, // Abstand zwischen Bild und Text anpassen
										}}
									/>
								)}
								<Text style={line.style}>{line.text}</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>
			</View>

			{/* next Memberview*/}
			<View
				style={{
					flexDirection: "row",
					paddingHorizontal: 30,
					paddingVertical: 20,
				}}
			>
				<Image
					style={styles.memberImage}
					source={require("../assets/team_dominic.jpg")} // Pfad zum Bild anpassen
				/>

				{/* Text mit Zeilenumbrüchen rechts */}
				<View style={{ paddingVertical: 10 }}>
					<Text style={styles.headLine}>DOMINIC</Text>
					<Text style={styles.memberText}>APIfuchs</Text>
					{[
						{
							text: "@dominic",
							style: {
								fontFamily: "Bitter",
								fontSize: 15,
								lineHeight: 30,
							},
							onPress: () =>
								Linking.openURL(
									"https://social.linux.pizza/@dominicwrege"
								),
							imageSource: require("../assets/icon_mail.png"), // Pfad zum Bild
						}, // Stil für die dritte Zeile mit der onPress-Funktion für den Link zur Website
						{
							text: "api@ladefuchs.app",
							style: {
								fontFamily: "Bitter",
								fontSize: 15,
								lineHeight: 20,
							},
							onPress: () =>
								Linking.openURL("mailto:api@ladefuchs.app"),
							imageSource: require("../assets/icon_masto.png"), // Pfad zum Bild
						}, // Stil für die dritte Zeile mit der onPress-Funktion für den Link zur E-Mail
					].map((line, index) => (
						<TouchableOpacity key={index} onPress={line.onPress}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								{line.imageSource && ( // Überprüfen, ob ein Bild vorhanden ist
									<Image
										source={line.imageSource}
										style={{
											width: 20, // Breite des Bildes anpassen
											height: 20, // Höhe des Bildes anpassen
											marginRight: 5, // Abstand zwischen Bild und Text anpassen
										}}
									/>
								)}
								<Text style={line.style}>{line.text}</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>
			</View>

			{/* next Memberview*/}

			<View
				style={{
					flexDirection: "row",
					paddingHorizontal: 30,
					paddingVertical: 20,
				}}
			>
				<Image
					style={styles.memberImage}
					source={require("../assets/team_sven.jpeg")} // Pfad zum Bild anpassen
				/>

				{/* Text mit Zeilenumbrüchen rechts */}
				<View style={{ paddingVertical: 10 }}>
					<Text style={styles.headLine}>SVEN</Text>
					<Text style={styles.memberText}>APPfuchs</Text>
					{[
						{
							text: "@hexer",
							style: {
								fontFamily: "Bitter",
								fontSize: 15,
								lineHeight: 30,
							},
							onPress: () =>
								Linking.openURL(
									"https://chaos.social/@svenraskin"
								),
							imageSource: require("../assets/icon_masto.png"), // Pfad zum Bild
						}, // Stil für die dritte Zeile mit der onPress-Funktion für den Link zur Website
						{
							text: "sven@ladefuchs.app",
							style: {
								fontFamily: "Bitter",
								fontSize: 15,
								lineHeight: 20,
							},
							onPress: () =>
								Linking.openURL("mailto:sven@ladefuchs.app"),
							imageSource: require("../assets/icon_mail.png"), // Pfad zum Bild
						}, // Stil für die vierte Zeile mit der onPress-Funktion für den Link zur E-Mail
					].map((line, index) => (
						<TouchableOpacity key={index} onPress={line.onPress}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								{line.imageSource && ( // Überprüfen, ob ein Bild vorhanden ist
									<Image
										source={line.imageSource}
										style={{
											width: 15, // Breite des Bildes anpassen
											height: 15, // Höhe des Bildes anpassen
											marginRight: 5, // Abstand zwischen Bild und Text anpassen
										}}
									/>
								)}
								<Text style={line.style}>{line.text}</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>
			</View>

			{/* Datenview */}
			<View style={styles.headerView}>
				<Text style={styles.headLine}>DATENFUCHS</Text>
				<Text style={styles.sponsorText}>
					Beste schlaue Daten kommen direkt von
				</Text>

				<TouchableOpacity
					onPress={() =>
						Linking.openURL("https://www.chargeprice.app")
					}
				>
					<Chargeprice height={35} width={230} />
				</TouchableOpacity>
			</View>

			{/* Podcastview */}
			<View style={styles.headerView}>
				<Text style={styles.headLine}>PODCASTFUCHS</Text>
				<Text style={styles.sponsorText}>
					Abonnieren Sie, sanst ist der Fuchs ganz traurig.
				</Text>

				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						onPress={() => Linking.openURL("https://audiodump.de")}
					>
						<Image
							source={require("../assets/podcast_audiodump-600.jpg")}
							style={{ width: 100, height: 100, marginRight: 10 }}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => Linking.openURL("https://malik.fm")}
					>
						<Image
							source={require("../assets/podcast_malik-fm_500x500.jpg")}
							style={{ width: 100, height: 100, marginRight: 10 }}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => Linking.openURL("https://bitsundso.de")}
					>
						<Image
							source={require("../assets/podcast_bitsundso-600.jpg")}
							style={{ width: 100, height: 100 }}
						/>
					</TouchableOpacity>
				</View>
			</View>

			{/* <Illuview */}
			<View style={styles.headerView}>
				<Text style={styles.headLine}>ILLUFÜCHSE</Text>
				<Text style={styles.sponsorText}>
					Illustriert mit ❤️ von Aga und Marcel-André
				</Text>
			</View>

			{/* Impressum */}
			<View style={styles.headerView}>
				<Text style={styles.headLine}>IMPRESSUM</Text>
				<Text style={styles.sponsorText}>
					{"\n"}Dipl.-Designer Malik Aziz{"\n"}Stephanstraße 43-45
					{"\n"}52064 Aachen
				</Text>
				<TouchableOpacity
					onPress={() => Linking.openURL("mailto:ios@ladefuchs.app")}
				>
					<Text style={styles.sponsorTextLink}>
						ios@ladefuchs.app
					</Text>
				</TouchableOpacity>
				<Text style={styles.sponsorText}>
					Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
				</Text>
				<Text style={styles.sponsorText}>
					{"\n"}Dipl.-Designer Malik Aziz{"\n"}Stephanstraße 43-45
					{"\n"}52064 Aachen{"\n"}Quelle: Impressum-Generator von
					anwalt.de
				</Text>
			</View>

			{/* Lizenzview */}
			<View style={styles.headerView}>
				<Text style={styles.headLine}>DRITTLIZENZEN</Text>
				<Text style={styles.sponsorText}>Momentan keine!</Text>
				<Text style={styles.sponsorText}>
					Handgefertigt aus ❤️ zur Elektromobilität in 👑 Aachen, 🥨
					Fürstenfeldbruck, 🏰 Ludwigsburg, ⚒️ Ahlen und 🐻 Berlin
				</Text>
				<Text style={styles.sponsorText}>Ladefuch Version 2.1.0</Text>
			</View>
		</ScrollView>
	);
}
