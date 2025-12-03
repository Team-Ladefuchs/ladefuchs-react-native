import React, { JSX } from "react";
import { ScrollView, View, Text, Platform } from "react-native";
import { colors } from "@theme";
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
//import { InfoModuleButton } from "../components/settings/infoModuleButton";

export function SettingsScreen(): JSX.Element {
	return (
		<ScrollView style={[settingsStyle.scrollView]} bounces>
			<View style={settingsStyle.viewContainer}>
				<View
					style={{
						marginTop: scale(16),
						marginBottom: scale(10),
						paddingHorizontal: scale(16),
					}}
				>
					<NavigationItem
						title={appRoutes.customTariffs.title}
						iconPrefix={
							<View
								style={{
									left: scale(11),
									marginRight: scale(
										Platform.OS === "android" ? -16 : 0,
									),
								}}
							>
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
									marginRight: scale(
										Platform.OS === "android" ? -16 : -9,
									),
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
				</View>
				<View style={settingsStyle.separator}>
					<Text style={settingsStyle.separatorText}>Infos</Text>
				</View>
				<View style={settingsStyle.innerContainer}>
					<MemberView />
					<Support />
					{/* <InfoModuleButton /> */}
					<StartOnBoarding />
					<Rating />
					<PodcastView />
					<Illustration />
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
		backgroundColor: colors.ladefuchsLightBackground,
		flex: 1,
	},
	scrollView: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: colors.ladefuchsDunklerBalken,
	},
	navigationList: {
		marginTop: "16@s",
		marginBottom: "32@s",
		paddingHorizontal: "16@s",
	},
	separatorText: {
		fontSize: "15@s",
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
		paddingHorizontal: "16@s",
		paddingVertical: "16@s",
	},
	innerContainer: {
		paddingHorizontal: "20@s",
		marginTop: "14@s",
		paddingBottom: "16@s",
		gap: "3@s",
	},
});
