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
import { colors,styles } from "../theme";
import { DetailLogos } from "../components/detail/detailLogos";
import { Tariff } from "../types/tariff";
import { TariffCondition } from "../types/conditions";
import { useNavigation,useRoute } from "@react-navigation/native";
import { CheckboxComponent } from "../components/detail/feedbackView/checkbox";

function FeedbackView() {
    const route = useRoute();
    const navigation = useNavigation();
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
            "Danke für deine Meldung. Wir prüfen unsere Daten.",
            "",
            [
                {
                    text: "OK",
                    onPress: () => navigation.navigate('Home'),
                },
            ]
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
                                height: '35%',
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
                                style={feedbackstyle.textInput}
                                placeholder="Willst Du dem Fuchs noch etwas flüstern? (max. 160 Zeichen)"
                                maxLength={160}
                                value={freitext}
                                onChangeText={setFreitext}
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                        <View style={feedbackstyle.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleSubmit}
                            >
                                <Text style={feedbackstyle.buttonText}>Senden</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const feedbackstyle = {
	textInput: {
        height: 60, // Erhöhte Höhe für mehrere Zeilen
        borderColor: 'grey',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
        alignSelf: 'center',
        textAlignVertical: 'top', // Text beginnt oben
		backgroundColor: "white",
		borderRadius: 12,
    },

    buttonContainer: {
        marginTop: 2,
        width: '100%',
        alignSelf: 'center',
		backgroundColor: colors.ladefuchsOrange,
		borderRadius: 12,
    },
	buttonText: {
        color: '#fff', // Schriftfarbe des Buttons
        fontSize: 24,
        fontWeight: 'bold',
		textAlign: 'center',
		marginTop:12,
		marginBottom: 12,
    },
};

export default FeedbackView;
