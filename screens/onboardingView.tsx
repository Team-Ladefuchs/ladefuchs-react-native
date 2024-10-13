import React from "react";
import {
	Image,
	ImageSourcePropType,
	SafeAreaView,
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
import { useAppStore } from "../state/appState";
import { AppLogo } from "../components/header/appLogo";
import { LadefuchsButton } from "../components/detail/ladefuchsButton";

interface OnboardingData {
	imageSource: ImageSourcePropType;
	overlayStyle: StyleProp<TextStyle>;
	descriptionKey: string;
}

export function OnboardingView({ navigation }: any): JSX.Element {
	const [setOnboarding] = useAppStore(
		useShallow((state) => [state.setOnboarding]),
	);

	const finishOnboarding = () => {
		setOnboarding("hide");
		navigation.navigate(appRoutes.home.key);
	};

	return (
		<Onboarding
			showDone={false}
			onDone={finishOnboarding}
			skipLabel={i18n.t("skip")}
			nextLabel={i18n.t("next")}
			onSkip={finishOnboarding}
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
					image: <AppLogo size={160} />,
					title: (
						<Text style={styles.onboardingStep6Description}>
							{i18n.t("onboardingStep6Description")}
						</Text>
					),
					subtitle: (
						<SafeAreaView style={styles.finishButton}>
							<View style={{ marginHorizontal: scale(26) }}>
								<LadefuchsButton
									text={i18n.t("onboardingLetsGo")}
									onPress={finishOnboarding}
								/>
							</View>
						</SafeAreaView>
					),
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
				<Text
					style={[overlayStyle, styles.subtitleText]}
					allowFontScaling={false}
				>
					{i18n.t(descriptionKey)}
				</Text>
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
	subtitleText: {
		position: "absolute",
		color: "white",
		fontFamily: "Bitter",
		lineHeight: "19@s",
		fontSize: "14@s",
	},
	overlaySubtitle: {
		bottom: "116@s",
		left: "80@s",
		right: "18@s",
	},
	overlaySubtitle1: {
		bottom: "232@s",
		left: "90@s",
		right: "10@s",
	},
	overlaySubtitle2: {
		bottom: "317@s",
		left: "95@s",
		right: "10@s",
	},
	overlaySubtitle3: {
		top: "203@s",
		left: "95@s",
		right: "10@s",
	},
	overlaySubtitle4: {
		top: "334@s",
		left: "86@s",
		width: "200@s",
		right: "10@s",
	},
	overlaySubtitle5: {
		bottom: "55@s",
		left: "86@s",
		right: "10@s",
	},
	onboardingStep6Description: {
		fontSize: "16@s",
		marginRight: "6@s",
		fontFamily: "Bitter",
		bottom: "50@s",
	},
	finishButton: {
		position: "absolute",
		bottom: "126@s",
		width: "100%",
	},
});
