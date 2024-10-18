import React from "react";
import {
	View,
	TouchableOpacity,
	Linking,
	SafeAreaView,
	StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppLogo } from "./appLogo";
import { colors } from "@theme";
import Zahnrad from "@assets/gearshape.svg";
import ChargepriceButton from "@assets/chargepriceButton.svg";
import { useAppStore } from "../../state/appState";
import { ScaledSheet, scale } from "react-native-size-matters";
import { SettingsScreenNavigationProp, appRoutes } from "../../appRoutes";
import { FavoriteCheckbox } from "../shared/favoriteCheckbox";

export function AppHeader(): JSX.Element {
	const navigation = useNavigation<SettingsScreenNavigationProp>();
	const [reloadBanner, isFavoriteTariffOnly, setisFavoriteTariffOnly] =
		useAppStore((state) => [
			state.reloadBanner,
			state.isFavoriteTariffOnly,
			state.setisFavoriteTariffOnly,
		]);

	return (
		<SafeAreaView style={styles.headerContainer}>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={colors.ladefuchsLightBackground}
			/>
			<TouchableOpacity
				onPress={async () =>
					await Linking.openURL("https://chargeprice.app")
				}
				activeOpacity={0.6}
				hitSlop={scale(5)}
				style={[styles.headerWrapperChargepriceIcon]}
			>
				<View style={styles.chargepriceIcon}>
					<ChargepriceButton width={scale(95)} height={scale(50)} />
				</View>
			</TouchableOpacity>
			<View style={{ marginBottom: -scale(10) }}>
				<TouchableOpacity
					activeOpacity={1}
					onLongPress={() => reloadBanner()}
				>
					<AppLogo size={81} />
				</TouchableOpacity>
			</View>
			<View style={styles.headerSettingsIcon}>
				<FavoriteCheckbox
					size={34}
					style={{ bottom: scale(0.5) }}
					checked={isFavoriteTariffOnly}
					onValueChange={setisFavoriteTariffOnly}
				/>
				<TouchableOpacity
					activeOpacity={0.6}
					hitSlop={scale(12)}
					onPress={() => {
						navigation.navigate(appRoutes.settingsStack.key);
					}}
				>
					<Zahnrad width={scale(29)} height={scale(29)} />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const dropShadow = {
	elevation: 4,
	shadowColor: "rgb(70, 130, 180)",
	shadowOffset: {
		width: 0,
		height: 1,
	},
	shadowOpacity: 0.3,
	shadowRadius: 2,
};

const styles = ScaledSheet.create({
	headerContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.ladefuchsLightBackground,
		width: "100%",
	},
	headerSettingsIcon: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: "14@s",
		position: "absolute",
		right: "15@s",
		bottom: "15@s",
	},
	headerWrapperChargepriceIcon: {
		position: "absolute",
		left: "15@s",
		bottom: "8@s",
	},
	chargepriceIcon: {
		...dropShadow,
	},
	headerTitle: {
		color: colors.ladefuchsOrange,
		fontSize: "18@s",
	},
});
