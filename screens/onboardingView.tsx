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
	page: number;
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
					page: 1,
				}),
				generatePage({
					imageSource: require("@assets/onBoarding/onboardingStep1.png"),
					overlayStyle: styles.overlaySubtitle1,
					descriptionKey: "onboardingStep1Description",
					page: 2,
				}),
				generatePage({
					imageSource: require("@assets/onBoarding/onboardingStep2.png"),
					overlayStyle: styles.overlaySubtitle2,
					descriptionKey: "onboardingStep2Description",
					page: 3,
				}),
				generatePage({
					imageSource: require("@assets/onBoarding/onboardingStep3.png"),
					overlayStyle: styles.overlaySubtitle3,
					descriptionKey: "onboardingStep3Description",
					page: 4,
				}),
				generatePage({
					imageSource: require("@assets/onBoarding/onboardingStep4.png"),
					overlayStyle: styles.overlaySubtitle4,
					descriptionKey: "onboardingStep4Description",
					page: 5,
				}),
				generatePage({
					imageSource: require("@assets/onBoarding/onboardingStep5.png"),
					overlayStyle: styles.overlaySubtitle5,
					descriptionKey: "onboardingStep3Description",
					page: 6,
				}),
				{
					backgroundColor: colors.ladefuchsLightBackground,
					image: (
						<View>
							<AppLogo size={160} />
							<Text style={styles.onboardingFinalDescription}>
								{i18n.t("onboardingStep6Description")}
							</Text>
						</View>
					),
					title: "",
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
	page,
}: OnboardingData): Page {
	return {
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		image: (
			<View>
				<Image source={imageSource} style={styles.defualtImageStyle} />
				<View style={[styles.descriptionContainer, overlayStyle]}>
					<PageNumber number={page} />
					<Text
						style={styles.subtitleText}
						allowFontScaling={false}
						numberOfLines={4}
					>
						{i18n.t(descriptionKey)}
					</Text>
				</View>
			</View>
		),
		title: "",
		subtitle: "",
	};
}

const styles = ScaledSheet.create({
	defualtImageStyle: {
		width: "280@s",
		height: "560@s",
		top: "26@s",
	},
	descriptionContainer: {
		display: "flex",
		flexDirection: "row",
		alignContent: "center",
		alignItems: "center",
		gap: "14@s",
		position: "absolute",
	},
	subtitleText: {
		color: "white",
		fontFamily: "Bitter",
		lineHeight: "19@s",
		fontSize: "14@s",
		width: "77%",
	},
	overlaySubtitle: {
		bottom: "195@s",
		left: "20@s",
		right: "15@s",
	},
	overlaySubtitle1: {
		top: "227@s",
		left: "20@s",
		right: "10@s",
	},
	overlaySubtitle2: {
		top: "227@s",
		left: "29@s",
		right: "10@s",
	},
	overlaySubtitle3: {
		top: "240@s",
		left: "29@s",
		right: "10@s",
	},
	overlaySubtitle4: {
		bottom: "120@s",
		left: "16@s",
		right: "10@s",
	},
	overlaySubtitle5: {
		bottom: "94@s",
		left: "16@s",
		right: "10@s",
	},
	onboardingFinalDescription: {
		fontSize: "16@s",
		fontFamily: "Bitter",
		textAlign: "center",
		bottom: "3@s",
	},
	finishButton: {
		position: "absolute",
		bottom: "126@s",
		width: "100%",
	},
});

function PageNumber({ number }: { number: number }): JSX.Element {
	return (
		<View style={pageNumberStyle.badge}>
			<Text style={pageNumberStyle.text}>{number}</Text>
		</View>
	);
}

const pageNumberStyle = ScaledSheet.create({
	badge: {
		backgroundColor: "red",
		width: "52@s",
		height: "52@s",
		borderRadius: "100@s",
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		color: "white",
		fontSize: "31@s",
		fontWeight: "bold",
	},
});
