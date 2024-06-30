import React, { useState } from "react";
import {
	View,
	Text,
	Button,
	TextInput,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "../theme";
import { AppLogo } from "../components/header/appLogo";

function FeedbackView() {
	const [preisAntwort, setPreisAntwort] = useState("AC");
	const [freitext, setFreitext] = useState("");

	const handleSubmit = () => {
		console.log("Freitext:", freitext);
		console.log("Preis Antwort:", preisAntwort);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<View contentContainerStyle={styles.scrollContainer}>
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
						<AppLogo size={110} />
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
								value="Gebühr"
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
						<Button title="Senden" onPress={handleSubmit} />
					</View>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}

export default FeedbackView;
