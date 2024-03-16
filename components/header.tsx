import {
	Button,
	Image,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LogoAnimation } from "./logo";
import { colors } from "../theme";

export function AppHeader() {
	const navigation = useNavigation();
	return (
		<View style={styles.headerContainer}>
			<View style={styles.headerLogoContainer}>
				<LogoAnimation />
			</View>

			<TouchableOpacity
				onPress={() => navigation.navigate("About")}
				style={styles.headerSettingsIcon}
			>
				<Image
					source={require("../assets/zahnrad.png")}
					style={{ width: 32, height: 32 }}
				/>
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
		backgroundColor: colors.background,
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
