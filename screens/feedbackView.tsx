import React, { useState } from "react";
import { View, Text, TextInput, Alert, Switch } from "react-native";
import { colors, styles } from "../theme";
import { DetailLogos } from "../components/detail/detailLogos";
import { Tariff } from "../types/tariff";
import { TariffCondition } from "../types/conditions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LadefuchsButton } from "../components/detail/ladefuchsButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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

    const [freitext, setFreitext] = useState('');
    const [isFalscherPreis, setIsFalscherPreis] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(tariffCondition.pricePerKwh.toString());
    const [newPrice, setNewPrice] = useState('');

    const handleSubmit = () => {
        console.log('CPO:', operatorName);
        console.log('Tarif:', tariff.name);
        console.log(
            'Hinweis auf:',
            isFalscherPreis ? 'Falscher Preis' : 'Anderes'
        );
        if (isFalscherPreis) {
            console.log('Aktueller Preis:', currentPrice);
            console.log('Neuer Preis:', newPrice);
        }
        console.log('Freitext:', freitext);
        console.log('AC Preis:', tariffCondition.pricePerKwh);

        // API call here if needed
        Alert.alert("Danke für deine Meldung. Wir prüfen unsere Daten.", "", [
            {
                text: "OK",
                onPress: () => navigation.navigate("Home"),
            },
        ]);
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

    return (
        <KeyboardAwareScrollView
            style={{
                backgroundColor: colors.ladefuchsLightBackground,
                height: '100%',
            }}
            contentContainerStyle={styles.scrollContainer}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled
        >
            <View>
                <View style={styles.headerView}>
                    <Text style={styles.headLine}>
                        Hast Du Futter für den Fuchs?
                    </Text>
                    <View>
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 20,
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
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 20,
                            }}
                        >
                            <Text style={styles.headerText}>
                                Sag uns was nicht stimmt!
                            </Text>
                        </View>
                    </View>

                    <View style={feedbackstyle.toggleContainer}>

                        <Switch
                            value={isFalscherPreis}
                            onValueChange={setIsFalscherPreis}
                        />
                        <Text style={styles.headerText}>Falscher Preis</Text>
                    </View>

                    {isFalscherPreis && (
                        <View style={feedbackstyle.priceContainer}>
                            <TextInput
                                style={feedbackstyle.priceInput}
                                placeholder="Aktueller Preis"
                                value={currentPrice}
                                onChangeText={setCurrentPrice}
                            />
                            <TextInput
                                style={feedbackstyle.priceInput}
                                placeholder="Neuer Preis"
                                value={newPrice}
                                onChangeText={setNewPrice}
                            />
                        </View>
                    )}

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
                    <View>
                        <LadefuchsButton
                            link={tariff.affiliateLinkUrl}
                            onPress={handleSubmit}
                        />
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}

export default FeedbackView;

const feedbackstyle = {
    textInput: {
        height: 60,
        borderColor: "grey",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: "100%",
        alignSelf: "center",
        textAlignVertical: "top",
        backgroundColor: colors.ladefuchsLightGrayBackground,
        borderRadius: 12,
    },
    toggleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "45%",
        marginVertical: 20,
        alignSelf: "center",
    },
    priceContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    priceInput: {
        height: 40,
        borderColor: "grey",
        borderWidth: 1,
        marginBottom: 5,
        paddingHorizontal: 10,
        width: "40%",
        alignSelf: "center",
        textAlignVertical: "top",
        backgroundColor: colors.ladefuchsLightGrayBackground,
        borderRadius: 12,
    },
};

export default FeedbackView;
