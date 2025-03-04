import React, { useCallback } from "react";
import {
	View,
	TouchableOpacity,
	Linking,
	StatusBar,
	Platform,
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
import { SafeAreaView } from "react-native-safe-area-context";

export function AppHeader(): JSX.Element {
	const navigation = useNavigation<SettingsScreenNavigationProp>();

	// Separate selectors to prevent unnecessary re-renders
	const reloadBanner = useAppStore((state) => state.reloadBanner);
	const isFavoriteTariffOnly = useAppStore(
		(state) => state.isFavoriteTariffOnly,
	);
	const setisFavoriteTariffOnly = useAppStore(
		(state) => state.setisFavoriteTariffOnly,
	);

	// Memoize callbacks
	const handleChargepricePress = useCallback(async () => {
		await Linking.openURL("https://chargeprice.app");
	}, []);

	const handleSettingsPress = useCallback(() => {
		navigation.navigate(appRoutes.settingsStack.key);
	}, [navigation]);

	return (
		<SafeAreaView style={styles.headerContainer}>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={colors.ladefuchsLightBackground}
			/>
			<TouchableOpacity
				onPress={handleChargepricePress}
				activeOpacity={0.6}
				hitSlop={scale(5)}
				style={[styles.headerWrapperChargepriceIcon]}
			>
				<View style={styles.chargepriceIcon}>
					<ChargepriceButton width={scale(95)} height={scale(50)} />
				</View>
			</TouchableOpacity>
			<View style={{ position: "relative" }}>
				<TouchableOpacity
					activeOpacity={1}
					style={styles.appLogoContainer}
					onLongPress={() => reloadBanner()}
				>
					<AppLogo size={81} />
				</TouchableOpacity>
			</View>
			<View style={styles.headerSettingsIcon}>
				<FavoriteCheckbox
					size={32}
					style={{ bottom: scale(0.5) }}
					checked={isFavoriteTariffOnly}
					onValueChange={setisFavoriteTariffOnly}
				/>
				<TouchableOpacity
					activeOpacity={0.6}
					hitSlop={scale(12)}
					onPress={handleSettingsPress}
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
	shadowOffset: { width: 0, height: 1 },
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
		height: "100@s",
		...Platform.select({
			ios: { marginTop: scale(14) },
			android: { marginTop: scale(-30) },
		}),
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
	appLogoContainer: {
		left: "50%",
		transform: [{ translateX: scale(-38) }],
		...Platform.select({
			ios: { bottom: "-8@s" },
			android: { bottom: "-19@s" },
		}),
	},
	headerWrapperChargepriceIcon: {
		position: "absolute",
		left: "15@s",
		bottom: "8@s",
	},
	chargepriceIcon: { ...dropShadow },
	headerTitle: { color: colors.ladefuchsOrange, fontSize: "18@s" },
});
