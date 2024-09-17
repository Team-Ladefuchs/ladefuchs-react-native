import React, { useState } from "react";
import { Image, Text, Button, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appRoutes } from "../appRoutes";
import { colors } from "../theme";
import { ScaledSheet, scale } from "react-native-size-matters";
import Onboarding from "react-native-onboarding-swiper";
import i18n from "../localization";

// Funktion, um das Onboarding zu wiederholen
const resetOnboarding = async () => {
	try {
		await AsyncStorage.removeItem("alreadyLaunched"); // Löscht die Markierung
		alert(i18n.t("onboardingAlert"));
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
					backgroundColor: "rgba(0, 0, 0, 0.8)",
					image: (
						<View>
							<Image
								source={require("@assets/generic/onboardingStep0.png")}
								style={{
									width: scale(280),
									height: scale(560),
									marginBottom: -80,
								}}
							/>
							{/* Subtitle als Overlay auf dem Bild */}

							<Text style={styles.overlaySubtitle}>
								{i18n.t("onboardingStep0Description")}
							</Text>
						</View>
					),
					title: "",
					subtitle: "",
				},
				{
					backgroundColor: "rgba(0, 0, 0, 0.8)",
					image: (
						<View>
							<Image
								source={require("@assets/generic/onboardingStep1.png")}
								style={{
									width: scale(280),
									height: scale(560),
									marginBottom: -80,
								}}
							/>
							{/* Subtitle als Overlay auf dem Bild */}

							<Text style={styles.overlaySubtitle1}>
								{i18n.t("onboardingStep1Description")}
							</Text>
						</View>
					),
					title: "",
					subtitle: "",
				},
				{
					backgroundColor: "rgba(0, 0, 0, 0.8)",
					image: (
						<View>
							<Image
								source={require("@assets/generic/onboardingStep2.png")}
								style={{
									width: scale(280),
									height: scale(560),
									marginBottom: -80,
								}}
							/>
							{/* Subtitle als Overlay auf dem Bild */}

							<Text style={styles.overlaySubtitle2}>
								{i18n.t("onboardingStep2Description")}
							</Text>
						</View>
					),
					title: "",
					subtitle: "",
				},
				{
					backgroundColor: "rgba(0, 0, 0, 0.8)",
					image: (
						<View>
							<Image
								source={require("@assets/generic/onboardingStep3.png")}
								style={{
									width: scale(280),
									height: scale(560),
									marginBottom: -80,
								}}
							/>
							{/* Subtitle als Overlay auf dem Bild */}

							<Text style={styles.overlaySubtitle3}>
								{i18n.t("onboardingStep3Description")}
							</Text>
						</View>
					),
					title: "",
					subtitle: "",
				},
				{
					backgroundColor: colors.ladefuchsLightBackground,
					image: (
						<Image
							source={require("@assets/fuchs/ladefuchs.png")}
							style={{ width: scale(250), height: scale(300) }}
						/>
					),
					title: i18n.t("onboardingStep6Description"),
					subtitle: (
						<View>
							<Text>{i18n.t("onboardingStep4Description")}</Text>
							{/* Button zum Zurücksetzen des Onboardings */}
							<Button
								title={i18n.t("onboardingStep5Description")}
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
		width: "30%",
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
	subtitle: {
		color: "white",
		fontFamily: "Bitter",
		fontSize: "13@s",
		lineHeight: "20@s",
		marginBottom: 120,
		position: "static",
	},
	overlaySubtitle: {
		position: "absolute",
		bottom: scale(120),
		left: scale(80),
		right: scale(10),
		color: "#fff",
		fontFamily: "Bitter",
		fontSize: "12@s",
	},
	overlaySubtitle1: {
		position: "absolute",
		bottom: scale(235),
		left: scale(90),
		right: scale(10),
		color: "#fff",
		fontFamily: "Bitter",
		fontSize: "12@s",
	},
	overlaySubtitle2: {
		position: "absolute",
		bottom: scale(330),
		left: scale(95),
		right: scale(10),
		color: "#fff",
		fontFamily: "Bitter",
		fontSize: "12@s",
	},
	overlaySubtitle3: {
		position: "absolute",
		bottom: scale(230),
		left: scale(95),
		right: scale(10),
		color: "#fff",
		fontFamily: "Bitter",
		fontSize: "12@s",
	},
});
