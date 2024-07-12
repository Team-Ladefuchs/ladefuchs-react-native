import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Arrow from "@assets/plugs/arrow.svg";
import { colors, styles } from "../theme";
import { DetailLogos } from "../components/detail/detailLogos";
import { LadefuchsButton } from "../components/detail/ladefuchsButton";
import { Tariff } from "../types/tariff";
import { ChargeMode,TariffCondition } from "../types/conditions";
import { ScaledSheet } from "react-native-size-matters";
import { useFormatNumber } from "../hooks/numberFormat";
import { FeedbackContext, FeedbackRequest } from "../types/feedback";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../state/state";
import { sendFeedback } from "../functions/api";
import CCS from "@assets/plugs/ccs.svg";
import Typ2 from "@assets/plugs/typ2.svg";
import { scale } from "react-native-size-matters";

export function FeedbackView(): JSX.Element {
  const route = useRoute();
  const navigation = useNavigation();
  const { formatNumber } = useFormatNumber();

  const { tariff, tariffCondition, operatorName, operatorImageUrl, chargeMode } = route.params as {
    tariff: Tariff;
    tariffCondition: TariffCondition;
    operatorName: string;
    operatorImageUrl: string | null;
    chargeMode: string;
  };

  const { operatorId } = useAppStore(useShallow(state => ({
    operatorId: state.operatorId,
  })));

  const [noteText, setNoteText] = useState("");
  const [currentPrice, setCurrentPrice] = useState(formatNumber(tariffCondition.pricePerKwh));
  const [formInvalid, setFormInvalid] = useState(false);
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    setFormInvalid(!currentPrice || !noteText);
  }, [currentPrice, newPrice, noteText]);

  useEffect(() => {
    console.log("chargeMode:", chargeMode); // Log chargeMode to check its value
}, [chargeMode]);

  const createRequestPayload = (): FeedbackRequest => {
    const context: FeedbackContext = {
      tariffId: tariff.identifier,
      operatorId,
    };

    if (!newPrice) {
      return {
        context,
        request: {
          type: "otherFeedback",
          attributes: { notes: noteText },
        },
      };
    }

    const displayedPrice = parseFloat(currentPrice) || 0;
    const actualPrice = parseFloat(newPrice) || 0;

    return {
      context,
      request: {
        type: "wrongPriceFeedback",
        attributes: {
          notes: noteText,
          displayedPrice,
          actualPrice,
        },
      },
    };
  };

  const handleSubmit = async () => {
    const request = createRequestPayload();
    await sendFeedback(request);
    Alert.alert("Danke für deine Meldung. Wir prüfen unsere Daten.", "", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const maxNoteTextLength = 160;
  const remainingCharacters = maxNoteTextLength - noteText.length;

  const renderPlugIcon = () => {
    const plugSize = 25;
    const plugOpacity = 0.45;

    return chargeMode === "ac" ? (
      <Typ2 width={plugSize} height={plugSize} opacity={plugOpacity} />
    ) : (
      <CCS width={plugSize} height={plugSize} opacity={plugOpacity} />
    );
  };

  const renderPriceInput = (label: string, value: string, setValue: (text: string) => void) => (
    <View style={feedbackStyles.priceContainer}>
      <View style={feedbackStyles.plugContainer}>
        <Text style={feedbackStyles.textInput}>{label} </Text>
        {renderPlugIcon()}
      </View>
      <TextInput
        style={feedbackStyles.priceInput}
        placeholder="Jetzt"
        value={currentPrice}
        maxLength={4}
        onChangeText={setCurrentPrice}
        keyboardType="numeric"
        returnKeyType="done"
      />
      <View style={feedbackStyles.arrow}>
        <Arrow width={40} height={40} opacity={0.95} />
      </View>
      <TextInput
        style={feedbackStyles.newpriceInput}
        placeholder="Neu"
        value={newPrice}
        maxLength={4}
        onChangeText={setNewPrice}
        keyboardType="numeric"
        returnKeyType="done"
      />
    </View>
  );

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.ladefuchsLightBackground, height: "100%" }}
      contentContainerStyle={styles.scrollContainer}
      enableAutomaticScroll
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled
    >
      <View>
        <View style={styles.headerView}>
          <Text style={styles.headLine}>Hast Du Futter für den Fuchs?</Text>
          <View>
            <Text style={styles.headerText}>Sag uns was nicht stimmt!</Text>
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20, marginBottom: 10 }}>
              <DetailLogos tariff={tariff} operatorName={operatorName} operatorImageUrl={operatorImageUrl} />
            </View>
          </View>
          <View style={feedbackStyles.priceBoxesContainer}>
            {renderPriceInput("AC", currentPrice, setCurrentPrice)}
            {renderPriceInput("DC", newPrice, setNewPrice)}
          </View>
          <View style={feedbackStyles.noteContainer}>
            <TextInput
              style={feedbackStyles.noteInput}
              placeholder="Willst Du dem Fuchs noch etwas flüstern? (max. 160 Zeichen)"
              maxLength={maxNoteTextLength}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={5}
            />
            <Text style={feedbackStyles.charCount}>{remainingCharacters} /160</Text>
          </View>
          <LadefuchsButton disabled={formInvalid} link={tariff.affiliateLinkUrl} onPress={handleSubmit} />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const feedbackStyles = ScaledSheet.create({
  noteContainer: {
    position: "relative",
  },
  noteInput: {
    height: "80@s",
    borderColor: colors.ladefuchsDarkGrayBackground,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: "10@s",
    padding: "10@s",
    width: "100%",
    alignSelf: "center",
    textAlignVertical: "top",
    backgroundColor: colors.ladefuchsLightGrayBackground,
    borderRadius: "10@s",
  },
  charCount: {
    position: "absolute",
    bottom: 15,
    right: 10,
    opacity: 0.3,
    fontSize: "12@s",
  },
  priceBoxesContainer: {
    flexDirection: "row",
    marginTop: 14,
    gap: "16@s",
  },
  priceContainer: {
    width: "47%",
  },
  plugContainer: {
    flexDirection: "row",
    backgroundColor: colors.ladefuchsDarkGrayBackground,
    paddingHorizontal: "60@s",
    paddingVertical: "5@s",
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
    paddingLeft: 50,
  },
  textInput: {
    alignSelf: "center",
    fontSize: "17@s",
    textAlign: "center",
    fontWeight: "800",
  },
  priceInput: {
    marginBottom: "5@s",
    paddingHorizontal: "10@s",
    paddingVertical: "8@s",
    width: "100%",
    alignSelf: "center",
    textAlignVertical: "top",
    backgroundColor: colors.ladefuchsLightGrayBackground,
    borderBottomLeftRadius: scale(12),
    borderBottomRightRadius: scale(12),
    fontSize: "32@s",
    textAlign: "center",
    fontWeight: "500",
  },
  newpriceInput: {
    borderColor: colors.ladefuchsDarkGrayBackground,
    borderWidth: 1,
    marginBottom: "5@s",
    paddingHorizontal: "10@s",
    paddingVertical: "8@s",
    width: "100%",
    alignSelf: "center",
    textAlignVertical: "top",
    backgroundColor: colors.ladefuchsLightGrayBackground,
    borderRadius: scale(12),
    fontSize: "32@s",
    textAlign: "center",
    fontWeight: "500",
  },
  arrow: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5@s",
  },
});
