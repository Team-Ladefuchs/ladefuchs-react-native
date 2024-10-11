import React from "react";
import {
	Image,
	ImageSourcePropType,
	StyleProp,
	Text,
	TextStyle,
	View,
} from "react-native";
import { appRoutes } from "../appRoutes";
import { colors } from "../theme";
import { ScaledSheet, scale } from "react-native-size-matters";
import Onboarding, { Page } from "react-native-onboarding-swiper";
import i18n from "../localization";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../state/state";

interface OnboardingData {
	imageSource: ImageSourcePropType;
	overlayStyle: StyleProp<TextStyle>;
	descriptionKey: string;
}

export function OnboardingScreen({ navigation }: any): JSX.Element {
	const [setOnboarding] = useAppStore(
		useShallow((state) => [state.setOnboarding]),
	);

	const finish = () => {
		setOnboarding("hide");
		navigation.navigate(appRoutes.home.key);
	};

	return (
		<Onboarding
			onDone={finish}
			onSkip={finish}
			pages={[
				generatePage({
					imageSource: require("@assets/onBoarding/onboardingStep0.png"),
					overlayStyle: styles.overlaySubtitle,
					descriptionKey: "onboardingStep0Description",
				}),
				generatePage({
					imageSource: require("@assets/onBoarding/onboardingStep1.png"),
					overlayStyle: styles.overlaySubtitle1,
					descriptionKey: "onboardingStep1Description",
				}),
				generatePage({
					imageSource: require("@assets/onBoarding/onboardingStep2.png"),
					overlayStyle: styles.overlaySubtitle2,
					descriptionKey: "onboardingStep2Description",
				}),
				generatePage({
					imageSource: require("@assets/onBoarding/onboardingStep3.png"),
					overlayStyle: styles.overlaySubtitle3,
					descriptionKey: "onboardingStep3Description",
				}),
				generatePage({
					imageSource: require("@assets/onBoarding/onboardingStep4.png"),
					overlayStyle: styles.overlaySubtitle4,
					descriptionKey: "onboardingStep7Description",
				}),
				generatePage({
					imageSource: require("@assets/onBoarding/onboardingStep5.png"),
					overlayStyle: styles.overlaySubtitle5,
					descriptionKey: "onboardingStep8Description",
				}),
				{
					backgroundColor: colors.ladefuchsLightBackground,
					image: (
						<Image
							source={require("@assets/fuchs/ladefuchs.png")}
							style={{ width: scale(250), height: scale(300) }}
						/>
					),
					title: i18n.t("onboardingStep6Description"),
					subtitle: "",
				},
			]}
		/>
	);
}

function generatePage({
	imageSource,
	overlayStyle,
	descriptionKey,
}: OnboardingData): Page {
	return {
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		image: (
			<View>
				<Image source={imageSource} style={styles.defualtImageStyle} />
				<Text style={overlayStyle}>{i18n.t(descriptionKey)}</Text>
			</View>
		),
		title: "",
		subtitle: "",
	};
}

const styles = ScaledSheet.create({
	viewContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		backgroundColor: colors.ladefuchsLightBackground,
	},
	defualtImageStyle: {
		width: "280@s",
		height: "560@s",
		marginBottom: -80,
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
		bottom: scale(225),
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
		top: scale(200),
		left: scale(95),
		right: scale(10),
		color: "#fff",
		fontFamily: "Bitter",
		fontSize: "12@s",
	},
	overlaySubtitle4: {
		position: "absolute",
		top: scale(340),
		left: scale(95),
		right: scale(10),
		color: "#fff",
		fontFamily: "Bitter",
		fontSize: "12@s",
	},
	overlaySubtitle5: {
		position: "absolute",
		bottom: scale(65),
		left: scale(95),
		right: scale(10),
		color: "#fff",
		fontFamily: "Bitter",
		fontSize: "12@s",
	},
});
