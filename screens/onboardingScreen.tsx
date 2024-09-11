import React, { useState } from "react";
import {
	View,
	Text,
	Button,
	FlatList,
	SafeAreaView,
	Image,
	StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appRoutes } from "../appRoutes";
import { colors } from "../theme";
import { ScaledSheet, scale } from "react-native-size-matters";

const onboardingData = [
	{
		id: "1",
		backgroundColor: "#000",

		title: "Wirf einen Blick in die Settings!",
		description:
			"Du findest dort die Möglichkeit Ladesäulen und Tarife hinzuzufügen.",
		image: require("@assets/generic/settings.png"), // Local image
	},
	{
		id: "2",
		title: "Such dir den passenden Anbieter",
		description:
			"Du findest alle relevanten Anbieter und Tarife in den entsprechenden Reitern.",
		image: require("@assets/generic/tariffs.png"), // Local image
	},
	{
		id: "3",
		title: "Ein paar Kleinigkeiten gibt es bestimmt noch zu erledigen…",
		description: "Malik darf gern kreativ werden 🤘",
		image: require("@assets/generic/blitz.png"), // Local image
	},
];

export function OnboardingScreen({ navigation }: any): JSX.Element {
	const [currentStep, setCurrentStep] = useState(0);

	const handleNext = async () => {
		if (currentStep < onboardingData.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			// Onboarding abgeschlossen, flag in AsyncStorage setzen
			await AsyncStorage.setItem("onboardingComplete", "true");
			navigation.navigate(appRoutes.home.key); // Zur HomeScreen navigieren
		}
	};

	return (
		<SafeAreaView style={styles.viewContainer}>
<Text style={styles.title}>
				{onboardingData[currentStep].title}
			</Text>
			{/* Display the image */}
			<Image
				source={onboardingData[currentStep].image}
				style={styles.image}
				resizeMode="contain" // Adjust the image aspect ratio to fit the container
			/>

			<Text style={styles.description}>
				{onboardingData[currentStep].description}
			</Text>
			<Button title="Weiter" onPress={handleNext} />
		</SafeAreaView>
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
