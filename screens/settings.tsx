import React from "react";
import { ScrollView, View, Text, Platform } from "react-native";
import { colors, styles as themeStyles } from "@theme";
import { useAppStore } from "../state/appState";
import { DatenView } from "../components/settings/dataView";
import { PodcastView } from "../components/settings/podcastView";
import { MemberView } from "../components/settings/teamLIst";
import { Footer } from "../components/settings/footer";
import { Illustration } from "../components/settings/illuView";
import { NavigationItem } from "../components/settings/navigationItem";
import { ScaledSheet, scale } from "react-native-size-matters";
import { appRoutes } from "../appRoutes";
import { Impressum } from "../components/settings/impressum";
import { CardImage } from "../components/shared/cardImage";
import { OperatorImage } from "../components/shared/operatorImage";
import { Line } from "../components/settings/line";
import i18n from "../translations/translations";
import { Support } from "../components/settings/support";
import { StartOnBoarding } from "../components/settings/startOnboarding";
import { Rating } from "../components/storeReview/storeRating";
import { HapticSettings } from "../components/settings/hapticSettings";
import { DarkModeSettings } from "../components/settings/darkModeSettings";

export function SettingsScreen(): JSX.Element {
	const { isDarkMode } = useAppStore();

	const containerStyle = [
		settingsStyle.viewContainer,
		isDarkMode
			? themeStyles.darkModeBackground
			: themeStyles.lightModeBackground,
	];

	return (
		<ScrollView style={settingsStyle.scrollView} bounces>
			<View style={containerStyle}>
				<View style={settingsStyle.navigationList}>
					<NavigationItem
						title={appRoutes.customTariffs.title}
						iconPrefix={
							<View style={{ left: scale(11) }}>
								<CardImage
									imageUrl={require("@assets/generic/user_tariff_generic_card.jpeg")}
									width={55}
								/>
							</View>
						}
						description={i18n.t("chargingTariffstext")}
						screenKey={appRoutes.customTariffs.key}
						justifyContent="space-evenly"
					/>
					<View style={{ marginTop: scale(12) }}>
						<Line />
					</View>

					<NavigationItem
						title={appRoutes.customerOperator.title}
						justifyContent="space-evenly"
						description={i18n.t("chargingStationstext")}
						iconPrefix={
							<View
								style={{
									left: scale(7),
									bottom: scale(2),
									marginRight: scale(-9),
								}}
							>
								<OperatorImage
									imageUrl={require("@assets/generic/operator_generic_fuchs.png")}
									height={80}
									width={60}
								/>
							</View>
						}
						screenKey={appRoutes.customerOperator.key}
					/>
					<View style={{ marginTop: scale(12) }}>
						<Line />
					</View>

					<HapticSettings />
					<View style={{ marginTop: scale(12) }}>
						<Line />
					</View>
					<DarkModeSettings />
				</View>

				<View style={settingsStyle.separator}>
					<Text style={settingsStyle.separatorText}>Infos</Text>
				</View>

				<View style={settingsStyle.innerContainer}>
					<MemberView />
					<Support />
					<StartOnBoarding />
					<Rating />
					<PodcastView />
					<Illustration />
					<DatenView />
					<Impressum />
					<NavigationItem
						justifyContent="space-between"
						title={appRoutes.license.title}
						screenKey={appRoutes.license.key}
						description={i18n.t("licensetext")}
					/>
				</View>
				<Footer />
			</View>
		</ScrollView>
	);
}

const settingsStyle = ScaledSheet.create({
	viewContainer: {
		flex: 1,
		backgroundColor: colors.ladefuchsLightBackground,
	},
	scrollView: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: colors.ladefuchsDunklerBalken,
	},
	navigationList: {
		marginTop: scale(16),
		marginBottom: scale(10),
		paddingHorizontal: scale(16),
	},
	separatorText: {
		fontSize: scale(15),
		fontWeight: "bold",
		...Platform.select({
			android: {
				textAlign: "left",
			},
			default: {
				textAlign: "center",
			},
		}),
	},
	separator: {
		backgroundColor: colors.ladefuchsDunklerBalken,
		paddingHorizontal: scale(16),
		paddingVertical: scale(16),
	},
	innerContainer: {
		paddingHorizontal: scale(20),
		marginTop: scale(14),
		paddingBottom: scale(16),
		gap: scale(3),
	},
});
