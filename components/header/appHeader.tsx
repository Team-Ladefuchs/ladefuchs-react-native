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
				onPress={() => Linking.openURL("https://chargeprice.app")}
				activeOpacity={0.6}
				style={styles.headerChargepriceIcon}
			>
				<ChargepriceButton
					width={110}
					height={50}
					style={styles.headerChargepriceIcon}
				/>
			</TouchableOpacity>
			<View style={{ marginBottom: -10 }}>
				<TouchableOpacity
					activeOpacity={1}
					onLongPress={handleLongPress}
				>
					<AppLogo size={90} />
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
				<Zahnrad width={35} height={35} />
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
		right: 8,
		bottom: 15,
		paddingRight: 16,
	},
	headerChargepriceIcon: {
		...dropShadow,
		position: "absolute",
		left: 8,
		bottom: 5,
	},
	headerTitle: {
		color: colors.ladefuchsOrange,
		fontSize: 18,
	},
});