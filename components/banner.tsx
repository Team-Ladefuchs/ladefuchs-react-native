import { TouchableOpacity, View, Image, Linking } from "react-native";
import { colors } from "../theme";

export function Banner() {
	return (
		<View
			style={{
				flex: 10,
				backgroundColor: colors.ladefuchsDarkBackground,
				alignItems: "center",
				height: 65,
				overflow: "visible", // Damit das Bild über den View hinausragt
			}}
		>
			{/* Fügen Sie hier die gewünschten Komponenten für den neuen View ein*/}
			<TouchableOpacity
				onPress={() => Linking.openURL("https://shop.ladefuchs.app")}
			>
				<Image
					source={require("../assets/Footershop.png")} // Pfad zum Bild für AC anpassen
					style={{
						width: 250,
						height: 89,
						marginTop: -10,
					}} // Stil des Bildes anpassen
				/>
			</TouchableOpacity>
		</View>
	);
}
