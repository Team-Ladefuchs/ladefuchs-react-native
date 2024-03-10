import React from "react";
import {
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	Linking,
} from "react-native";
import { colors, fonts } from "../theme";
import { useFonts } from "expo-font";

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
		<ScrollView style={{ backgroundColor: colors.background }} bounces>
			{/* Headerview */}
			<View style={{ paddingHorizontal: 30, paddingVertical: 20 }}>
				{[
					{
						text: "TEAMFUCHS",
						style: {
							color: colors.ladefuchsOrange,
							fontSize: 20,
							fontFamily: "Roboto",
						},
					}, // Stil für die erste Zeile
					{
						text: "Wir sind schuld. Wirklich! Trotzdem alle Angaben ohne Gewähr.",
						style: {
							color: "black",
							fontFamily: "Bitter",
							fontSize: 15,
						},
					}, // Stil für die zweite Zeile
				].map((line, index) => (
					<Text key={index} style={line.style}>
						{line.text}
					</Text>
				))}
			</View>

			{/* Hier der neue Memberview*/}
			<View
				style={{
					flexDirection: "row",
					paddingHorizontal: 30,
					paddingVertical: 20,
				}}
			>
				<Image
					source={require("../assets/team_malik.jpg")} // Pfad zum Bild anpassen
					style={{
						width: 120,
						height: 120,
						borderRadius: 100,
						marginRight: 50,
					}} // Stil des Bildes anpassen, um es rund zu machen und Abstand zum Text
				/>

				{/* Text mit Zeilenumbrüchen rechts */}
				<View style={{ paddingVertical: 10 }}>
					{[
						{
							text: "MALIK",
							style: {
								color: colors.ladefuchsOrange,
								fontSize: 20,
								fontFamily: "Roboto",
								lineHeight: 20,
							},
						}, // Stil für die erste Zeile
						{
							text: "Designfuchs",
							style: {
								color: "black",
								fontFamily: "Bitter",
								fontSize: 15,
								lineHeight: 20,
							},
						}, // Stil für die zweite Zeile
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
					source={require("../assets/team_dominic.jpg")} // Pfad zum Bild anpassen
					style={{
						width: 120,
						height: 120,
						borderRadius: 100,
						marginRight: 50,
					}} // Stil des Bildes anpassen, um es rund zu machen und Abstand zum Text
				/>

				{/* Text mit Zeilenumbrüchen rechts */}
				<View style={{ paddingVertical: 10 }}>
					{[
						{
							text: "DOMINIC",
							style: {
								color: colors.ladefuchsOrange,
								fontSize: 20,
								fontFamily: "Roboto",
								lineHeight: 20,
							},
						}, // Stil für die erste Zeile
						{
							text: "APIfuchs",
							style: {
								fontFamily: "Bitter",
								fontSize: 15,
								lineHeight: 20,
							},
						}, // Stil für die zweite Zeile
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
					source={require("../assets/team_sven.jpeg")} // Pfad zum Bild anpassen
					style={{
						width: 120,
						height: 120,
						borderRadius: 100,
						marginRight: 50,
					}} // Stil des Bildes anpassen, um es rund zu machen und Abstand zum Text
				/>

				{/* Text mit Zeilenumbrüchen rechts */}
				<View style={{ paddingVertical: 10 }}>
					{[
						{
							text: "SVEN",
							style: {
								color: colors.ladefuchsOrange,
								fontSize: 20,
								fontFamily: "Roboto",
								lineHeight: 20,
							},
						}, // Stil für die erste Zeile
						{
							text: "APPfuchs",
							style: {
								fontFamily: "Bitter",
								fontSize: 15,
								lineHeight: 20,
							},
						}, // Stil für die zweite Zeile
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
			<View style={{ paddingHorizontal: 30, paddingVertical: 20 }}>
				{[
					{
						text: "DATENFUCHS",
						style: {
							color: colors.ladefuchsOrange,
							fontSize: 20,
							fontFamily: "Roboto",
						},
					}, // Stil für die erste Zeile
					{
						text: "Beste schlaue Daten kommen direkt von",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					}, // Stil für die zweite Zeile
					{ text: "", style: { color: "black" } }, // Stil für die zweite Zeile
				].map((line, index) => (
					<Text key={index} style={line.style}>
						{line.text}
					</Text>
				))}
				<TouchableOpacity
					onPress={() =>
						Linking.openURL("https://www.chargeprice.app")
					}
				>
					<Image
						source={require("../assets/chargeprice-logo.png")}
						style={{ width: 200 }} // Stil des Bildes anpassen, um es rund zu machen und Abstand zum Text
					/>
				</TouchableOpacity>
			</View>

			{/* Podcastview */}
			<View style={{ paddingHorizontal: 30, paddingVertical: 20 }}>
				{[
					{
						text: "PODCASTFUCHS",
						style: {
							color: colors.ladefuchsOrange,
							fontSize: 20,
							fontFamily: "Roboto",
						},
					}, // Stil für die erste Zeile
					{
						text: "Abonnieren Sie, sanst ist der Fuchs ganz traurig.",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					}, // Stil für die zweite Zeile
					{ text: "", style: { color: "black" } }, // Stil für die zweite Zeile
				].map((line, index) => (
					<Text key={index} style={line.style}>
						{line.text}
					</Text>
				))}
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
			<View style={{ paddingHorizontal: 30, paddingVertical: 20 }}>
				{[
					{
						text: "ILLUFÜCHSE",
						style: {
							color: colors.ladefuchsOrange,
							fontSize: 20,
							fontFamily: "Roboto",
						},
					}, // Stil für die erste Zeile
					{
						text: "Illustriert mit ❤️ von Aga und Marcel-André",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					}, // Stil für die zweite Zeile
				].map((line, index) => (
					<Text key={index} style={line.style}>
						{line.text}
					</Text>
				))}
			</View>

			{/* Impressum */}
			<View style={{ paddingHorizontal: 30, paddingVertical: 20 }}>
				{[
					{
						text: "IMPRESSUM",
						style: {
							color: colors.ladefuchsOrange,
							fontSize: 20,
							fontFamily: "Roboto",
						},
					}, // Stil für die erste Zeile
					{
						text: "",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					}, // Stil für die zweite Zeile
					{
						text: "Dipl.-Designer Malik Aziz",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					},
					{
						text: "Stephanstraße 43-45",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					},
					{
						text: "52064 Aachen",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					},
					{
						text: "",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					},
					{
						text: "ios@ladefuchs.app",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					},
					{
						text: "",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					},
					{
						text: "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					},
					{
						text: "Dipl.-Designer Malik Aziz",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					},
					{
						text: "Stephanstraße 43-45",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					},
					{
						text: "52064 Aachen ",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					},
					{
						text: "Quelle: Impressum-Generator von anwalt.de",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					},
				].map((line, index) => (
					<Text key={index} style={line.style}>
						{line.text}
					</Text>
				))}
			</View>

			{/* Lizenzview */}
			<View style={{ paddingHorizontal: 30, paddingVertical: 20 }}>
				{[
					{
						text: "DRITTLIZENZEN",
						style: {
							color: colors.ladefuchsOrange,
							fontSize: 20,
							fontFamily: "Roboto",
						},
					}, // Stil für die erste Zeile
					{
						text: "Momentan keine!",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					}, // Stil für die zweite Zeile
					{
						text: "",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					}, // Stil für die zweite Zeile
					{
						text: "Handgefertigt aus ❤️ zur Elektromobilität in 👑 Aachen, 🥨 Fürstenfeldbruck, 🏰 Ludwigsburg, ⚒️ Ahlen und 🐻 Berlin",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					}, // Stil für die zweite Zeile
					{
						text: "",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					},
					{
						text: "Ladefuch Version 2.1.0",
						style: {
							fontFamily: "Bitter",
							fontSize: 15,
						},
					},
				].map((line, index) => (
					<Text key={index} style={line.style}>
						{line.text}
					</Text>
				))}
			</View>
		</ScrollView>
	);
}
