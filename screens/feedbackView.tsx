import React, { useState } from "react";
import {
	View,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { colors, styles } from "../theme";
import { DetailLogos } from "../components/detail/detailLogos";
import { Tariff } from "../types/tariff";
import { TariffCondition } from "../types/conditions";
import { useRoute } from "@react-navigation/native";

function FeedbackView() {
	const route = useRoute();
	const { tariff, tariffCondition } = route.params as {
		tariff: Tariff;
		tariffCondition: TariffCondition;
	};

	const [preisAntwort, setPreisAntwort] = useState("AC");
	const [freitext, setFreitext] = useState("");

	const handleSubmit = () => {
		console.log("Freitext:", freitext);
		console.log("Hinweis auf:", preisAntwort);
		console.log("Tarif:", tariff.name);
		console.log("url:", operatorImageUrl);
	};

	if (!tariff || !tariffCondition) {
		return (
			<View style={styles.container}>
				<Text style={styles.headLine}>
					Fehler: Tarif oder Tarifbedingung nicht gefunden
				</Text>
			</View>
		);
	}

	const operatorImageUrl =
		tariff.imageUrl || "https://via.placeholder.com/125x180.png"; // Fallback für CPO-Bild

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View
					style={{
						backgroundColor: colors.ladefuchsLightBackground,
						height: "100%",
					}}
				>
					<View style={styles.headerView}>
						<Text style={styles.headLine}>
							Hast Du Futter für den Fuchs?
						</Text>
						<View
							style={{
								height: "25%",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<DetailLogos
								tariff={tariff}
								operatorName={tariff}
								operatorImageUrl={operatorImageUrl}
							/>
						</View>
						<View
							style={{
								height: "5%",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text style={styles.headerText}>
								Sag uns was nicht stimmt!
							</Text>
						</View>

						<View>
							<Picker
								selectedValue={preisAntwort}
								style={styles.picker}
								onValueChange={(itemValue) =>
									setPreisAntwort(itemValue)
								}
							>
								<Picker.Item label="AC Preis" value="AC" />
								<Picker.Item label="DC Preis" value="DC" />
								<Picker.Item
									label="Blockiergebühr"
									value="Blockiergebühr"
								/>
								<Picker.Item
									label="Monatliche Gebühr"
									value="Monatliche Gebühr"
								/>
							</Picker>
						</View>
						<View>
							<TextInput
								style={styles.textInput}
								placeholder="Willst Du dem Fuchs noch etwas flüstern? (max. 160 Zeichen)"
								maxLength={160}
								value={freitext}
								onChangeText={setFreitext}
								multiline
								numberOfLines={4}
							/>
						</View>
						<View style={styles.buttonContainer}>
							<TouchableOpacity
								style={styles.button}
								onPress={handleSubmit}
							>
								<Text style={styles.buttonText}>Senden</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

export default FeedbackView;
