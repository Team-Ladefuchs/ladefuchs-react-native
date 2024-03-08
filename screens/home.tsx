import React from "react";
import { View, Text, Button, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from '../theme';


export function HomeScreen(props) {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
      {/* Anstatt des Textes wird hier das runde Bild eingefügt */}
      <Image
        source={require("../assets/LFfake.jpg")} // Pfad zum Bild anpassen
        style={{ width: 380, height: 735 }} // Stil des Bildes anpassen, um es rund zu machen
      />
      <Text style={{ color: colors.ladefuchsOrange }}>Hier steht der Ladefuchs</Text>

      {/*<Text>Props: {JSON.stringify(props)}</Text>*/}
    </View>
  );
}
