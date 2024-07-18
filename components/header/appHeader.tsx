import React from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Linking,
	SafeAreaView,
	StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppLogo } from "./appLogo";
import { colors } from "../../theme";
import Zahnrad from "@assets/gearshape.svg";
import ChargepriceButton from "@assets/chargepriceButton.svg";
import { useAppStore } from "../../state/state";
import { scale } from "react-native-size-matters";

export function AppHeader(): JSX.Element {
	const navigation = useNavigation();
	const reloadBanner = useAppStore((state) => state.reloadBanner);

	const handleLongPress = () => {
		console.log("handleLongPress reloadBanner");
		reloadBanner();
	};

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
				style={styles.headerWrapperChargepriceIcon}
			>
				<ChargepriceButton
					width={scale(95)}
					height={scale(50)}
					style={styles.chargepriceIcon}
				/>
			</TouchableOpacity>
			<View style={{ marginBottom: -scale(10) }}>
				<TouchableOpacity
					activeOpacity={1}
					onLongPress={handleLongPress}
				>
					<AppLogo size={85} />
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				activeOpacity={0.6}
				onPress={() => {
					//@ts-ignore
					navigation.navigate("Einstellungen");
				}}
				style={styles.headerSettingsIcon}
			>
				<View style={{ padding: 3 }}>
					<Zahnrad width={scale(30)} height={scale(30)} />
				</View>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const dropShadow = {
	shadowColor: "rgb(70, 130, 180)",
	shadowOffset: {
		width: 0,
		height: 1,
	},
	shadowOpacity: 0.3,
	shadowRadius: 2,
	elevation: 4,
};

const styles = StyleSheet.create({
	headerContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.ladefuchsLightBackground,
		width: "100%",
	},
	headerSettingsIcon: {
		position: "absolute",
		right: scale(15),
		bottom: scale(15),
	},
	headerWrapperChargepriceIcon: {
		position: "absolute",
		left: scale(15),
		bottom: scale(8),
	},
	chargepriceIcon: {
		...dropShadow,
	},
	headerTitle: {
		color: colors.ladefuchsOrange,
		fontSize: scale(18),
	},
});
