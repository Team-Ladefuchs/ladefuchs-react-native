import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "../theme";
import { AppLogo } from "../components/header/appLogo";

function FeedbackView() {
    const [futterAntwort, setFutterAntwort] = useState("");
    const [preisAntwort, setPreisAntwort] = useState("");
    const [tarifAntwort, setTarifAntwort] = useState("");

    const handleSubmit = () => {
        // Hier kannst du die Antworten verarbeiten oder senden
        console.log("Futter Antwort:", futterAntwort);
        console.log("Preis Antwort:", preisAntwort);
        console.log("Tarif Antwort:", tarifAntwort);
    };

    return (
        <View style={styles.headerView}>
             <Text style={styles.headLine}>Hast Du Futter für den Fuchs?</Text>
            <View style={{ height: "30%", justifyContent: "center", alignItems: "center" }}>
                <AppLogo size={110} />
            </View>
			<View style={{ height: "10%", justifyContent: "center", alignItems: "center" }}>
			<Text style={styles.headerText}>Sag uns was nicht stimmt!</Text>
            </View>



            <Picker
                selectedValue={preisAntwort}
                style={styles.picker}
                onValueChange={(itemValue) => setPreisAntwort(itemValue)}
            >
                <Picker.Item label="AC Preis" value="AC" />
                <Picker.Item label="DC Preis" value="DC" />
                <Picker.Item label="Blockiergebühr" value="Gebühr" />
            </Picker>

            <View style={styles.buttonContainer}>
                <Button title="Senden" onPress={handleSubmit} />
            </View>
        </View>
    );
}

export default FeedbackView;
