import React from "react";
import { ScrollView, View, Text, Platform } from "react-native";
import { colors } from "../theme";
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
import { genericOperatorImage, userTariffImage } from "../functions/shared";
import { Line } from "../components/settings/line";

export function SettingsScreen() {
	return (
		<ScrollView style={[settingsStyle.scrollView]} bounces>
			<View style={settingsStyle.viewContainer}>
				<View
					style={{
						marginTop: scale(16),
						marginBottom: scale(32),
						paddingHorizontal: scale(16),
					}}
				>
					<NavigationItem
						title={appRoutes.customTariffs.title}
						iconPrefix={
							<View
								style={{
									left: scale(11),
								}}
							>
								<CardImage
									imageUrl={userTariffImage}
									width={55}
								/>
							</View>
						}
						description={`Bei welchem Stromtarif-Anbieter\n(EMP) bist du Kunde?`}
						screenKey={appRoutes.customTariffs.key}
						justifyContent="space-evenly"
					/>
					<View style={{ marginTop: scale(12) }}>
						<Line />
					</View>

					<NavigationItem
						title={appRoutes.customerOperator.title}
						justifyContent="space-evenly"
						description={`Welche Ladesäulen-Anbieter\n(CPO) möchtest du vergleichen?`}
						iconPrefix={
							<View
								style={{
									left: scale(7),
									bottom: scale(2),
									marginRight: scale(-9),
								}}
							>
								<OperatorImage
									imageUrl={genericOperatorImage}
									height={80}
									width={60}
								/>
							</View>
						}
						screenKey={appRoutes.customerOperator.key}
					/>
				</View>
				<View style={settingsStyle.separator}>
					<Text style={settingsStyle.separatorText}>Infos</Text>
				</View>
				<View style={settingsStyle.innerContainer}>
					<MemberView />
					<DatenView />
					<Illustration />
					<PodcastView />
					<Impressum />
					<NavigationItem
						justifyContent="space-between"
						title={appRoutes.license.title}
						screenKey={appRoutes.license.key}
						description="Der Blick unter die Haube 🚘⚡️"
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
