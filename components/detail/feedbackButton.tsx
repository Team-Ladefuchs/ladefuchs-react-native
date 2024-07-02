import React from "react";
import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Tariff } from "../../../types/tariff";
import { TariffCondition } from "../../../types/conditions";

interface FeedbackButtonProps {
    link: string | null | undefined;
    tariff: Tariff | null | undefined;
    tariffCondition: TariffCondition | null;
    operatorName: string; // Füge den Operatornamen hinzu
}

export function FeedbackButton({
    link,
    tariff,
    tariffCondition,
    operatorName,
}: FeedbackButtonProps): JSX.Element {
    const navigation = useNavigation();

    if (!link) {
        return <></>;
    }

    const onPress = () => {
        navigation.navigate("Feedback", { tariff, tariffCondition, operatorName });
    };

    return (
        <SafeAreaView style={{ marginTop: 10, marginHorizontal: 0 }}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={onPress}
            >
                <Text style={[styles.headerText, styles.underlinedText]}>
                    {"Preise falsch? Dann sag dem Fuchs Bescheid!"}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        // Add your button styles here
    },
    underlinedText: {
        textDecorationLine: "underline",
        color: "grey",
        fontFamily: "Bitter",
        fontSize: 15,
        lineHeight: 20,
    },
});
