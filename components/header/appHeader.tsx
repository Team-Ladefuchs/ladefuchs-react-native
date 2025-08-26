import React, { JSX, useCallback } from "react";
import { View, TouchableOpacity, StatusBar, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppLogo } from "./appLogo";
import { colors } from "@theme";
import Zahnrad from "@assets/gearshape.svg";
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

	const handleSettingsPress = useCallback(() => {
		navigation.navigate(appRoutes.settingsStack.key);
	}, [navigation]);

	return (
		<SafeAreaView style={styles.headerContainer} edges={Platform.OS === 'android' ? ['top', 'left', 'right'] : undefined}>
			{Platform.OS === 'ios' && (
				<StatusBar
					barStyle="dark-content"
					backgroundColor={colors.ladefuchsLightBackground}
				/>
			)}

			<View style={{ position: "absolute", top: scale(21) }}>
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
			android: { paddingTop: scale(14) },
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
			android: { bottom: "-9@s" },
		}),
	},
});
