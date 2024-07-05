import React, { useState } from "react";
import {
	View,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from "react-native";
import { colors, styles } from "../theme";
import { DetailLogos } from "../components/detail/detailLogos";
import { Tariff } from "../types/tariff";
import { TariffCondition } from "../types/conditions";
import { useRoute } from "@react-navigation/native";
import { CheckboxComponent } from "../components/detail/feedbackView/checkbox";

function FeedbackView() {
    const route = useRoute();
    const { tariff, tariffCondition, operatorName, operatorImageUrl } =
        route.params as {
            tariff: Tariff;
            tariffCondition: TariffCondition;
            operatorName: string;
            operatorImageUrl: string | null;
        };

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [freitext, setFreitext] = useState('');

    const handleSubmit = () => {
        console.log('Freitext:', freitext);
        console.log('Hinweis auf:', selectedOptions.join(', '));
        console.log('Tarif:', tariff.name);
        console.log('CPO:', operatorName);

        Alert.alert(
            "Danke für deine Meldung",
            "",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
    };

    if (!tariff || !tariffCondition || !operatorName) {
        return (
            <View style={styles.container}>
                <Text style={styles.headLine}>
                    Fehler: Tarif, Tarifbedingung oder Operator nicht gefunden
                </Text>
            </View>
        );
    }

    const fallbackImageUrl = require('@assets/cpo_generic.png');
    const displayedImageUrl = operatorImageUrl || fallbackImageUrl;
    const OperatorName = operatorName || fallbackImageUrl;

    const checkboxOptions = [
        { label: 'AC Preis', value: 'AC' },
        { label: 'DC Preis', value: 'DC' },
        { label: 'Blockiergebühr', value: 'Blockiergebühr' },
        { label: 'Monatliche Gebühr', value: 'Monatliche Gebühr' },
    ];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View
                    style={{
                        backgroundColor: colors.ladefuchsLightBackground,
                        height: '100%',
                    }}
                >
                    <View style={styles.headerView}>
                        <Text style={styles.headLine}>
                            Hast Du Futter für den Fuchs?
                        </Text>
                        <View
                            style={{
                                height: '25%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <DetailLogos
                                tariff={tariff}
                                operatorName={OperatorName}
                                operatorImageUrl={displayedImageUrl}
                            />
                        </View>
                        <View
                            style={{
                                height: '5%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={styles.headerText}>
                                Sag uns was nicht stimmt!
                            </Text>
                        </View>

                        <View>
                            <CheckboxComponent
                                options={checkboxOptions}
                                selectedOptions={selectedOptions}
                                onValueChange={setSelectedOptions}
                            />
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
