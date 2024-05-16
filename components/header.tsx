import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LogoAnimation } from "./logo";
import { colors } from "../theme";
import Zahnrad from "../assets/gearshape.svg";

export function AppHeader() {
	const navigation = useNavigation();
	return (
		<View style={styles.headerContainer}>
			<View style={styles.headerLogoContainer}>
				<LogoAnimation />
			</View>

			<TouchableOpacity
				onPress={() => {
					//@ts-ignore
					navigation.navigate("Einstellungen");
				}}
				style={styles.headerSettingsIcon}
			>
				<Zahnrad width={35} height={35} />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 45,
		paddingBottom: 0,
		backgroundColor: colors.ladefuchsLightBackground,
		width: "100%",
		height: 110,
	},
	headerLogoContainer: {
		marginBottom: -7,
	},
	headerSettingsIcon: {
		position: "absolute",
		right: 8,
		bottom: 15,
		paddingRight: 16,
	},
	headerTitle: {
		color: colors.ladefuchsOrange,
		fontSize: 18,
	},
});
