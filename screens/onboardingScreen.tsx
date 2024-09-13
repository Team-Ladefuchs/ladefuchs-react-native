import React, { useState } from "react";
import { Image, Text, Button, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appRoutes } from "../appRoutes";
import { colors } from "../theme";
import { ScaledSheet, scale } from "react-native-size-matters";
import Onboarding from "react-native-onboarding-swiper";

// Funktion, um das Onboarding zu wiederholen
const resetOnboarding = async () => {
	try {
		await AsyncStorage.removeItem("alreadyLaunched"); // Löscht die Markierung
		alert("Onboarding wird beim nächsten Start wieder angezeigt.");
	} catch (error) {
		console.error("Fehler beim Zurücksetzen des Onboardings", error);
	}
};

export function OnboardingScreen({ navigation }: any): JSX.Element {
	const [currentStep, setCurrentStep] = useState(0);

	const handleNext = async () => {
		if (currentStep < onboardingData.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			// Onboarding abgeschlossen, flag in AsyncStorage setzen
			await AsyncStorage.setItem("onboardingComplete", "true");
			navigation.navigate("appRoutes.home.key"); // Zur HomeScreen navigieren
		}
	};

	return (
		<Onboarding
			onDone={() => navigation.navigate(appRoutes.home.key)}
			onSkip={() => navigation.navigate(appRoutes.home.key)}
			pages={[
				{
					backgroundColor: "#a6e4d0",
					image: (
						<Image
							source={require("@assets/generic/onboard1.png")}
						/>
					),
					title: "Wähle den Anbieter der Ladesäule, an der Du stehst.",
					subtitle:
						"Der kleine Fuchs läuft durch den Wald läuft und sammelt Nüsse, ich meine Daten, für dich ein…",
				},
				{
					backgroundColor: colors.ladefuchsLightBackground,
					image: (
						<Image source={require("@assets/generic/onboard2.png")} />
					),
					title: "Die günstigsten Ladekarten findest Du oben in der Liste.",
					subtitle:
						"Nu holen wir die Preisinformationen für den passenden Ladesäulenbetreiber…",
				},
				{
					backgroundColor: "#a6e4d0",
					image: (
						<Image source={require("@assets/generic/onboard3.png")} />
					),

					title: "Wirf einen Blick in die Settings!",
					subtitle:
						"Hier kannst Du Deine persönlichen Ladetarife und weitere Ladesäulen-Betreiber hinzufügen.",
				},
				{
					backgroundColor: colors.ladefuchsLightBackground,
					image: (
						<Image source={require("@assets/generic/onboard5.png")} />
					),
					title: "Such dir den passenden Anbieter",
					subtitle:
						"Du findest alle relevanten Anbieter und Tarife in den entsprechenden Reitern.",
				},
				{
					backgroundColor: "#fff",
					image: (
						<Image source={require("@assets/generic/onboard4.png")} />
					),
					title: "Und deinen eigenen Tarif.",
					subtitle: (
						<View>
							<Text>Du bist jetzt ein Fuchs …es kann losgehen…</Text>
							{/* Button zum Zurücksetzen des Onboardings */}
							<Button
								title="Onboarding wiederholen"
								onPress={resetOnboarding}
								color={colors.ladefuchsOrange} // Farbe für den Button
							/>
						</View>
					),
				},
			]}
		/>
	);
}

const styles = ScaledSheet.create({
	viewContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		backgroundColor: colors.ladefuchsLightBackground,
	},
	image: {
		width: "80%",
		height: "70%", // Adjust the height as needed
		marginBottom: 20,
		marginHorizontal: "auto",
	},
	title: {
		color: colors.ladefuchsOrange,
		fontFamily: "Roboto",
		fontSize: "18@s",
		textAlign: "center",
		marginBottom: 20,
	},
	description: {
		color: "black",
		fontFamily: "Bitter",
		fontSize: "13@s",
		lineHeight: "20@s",
	},
});
