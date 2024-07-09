import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Arrow from "@assets/plugs/arrow.svg";
import { colors, styles } from "../theme";
import { DetailLogos } from "../components/detail/detailLogos";
import { LadefuchsButton } from "../components/detail/ladefuchsButton";
import { Tariff } from "../types/tariff";
import { TariffCondition, ChargeMode } from "../types/conditions";
import { scale } from "react-native-size-matters";

const FeedbackView = ({ chargeMode, price }: { chargeMode: ChargeMode; price: number | null | undefined; }) => {
	const route = useRoute();
	const navigation = useNavigation();
	const { tariff, tariffCondition, operatorName, operatorImageUrl } = route.params as {
		tariff: Tariff;
		tariffCondition: TariffCondition;
		operatorName: string;
		operatorImageUrl: string | null;
	};
	const [freitext, setFreitext] = useState("");
	const [currentPrice, setCurrentPrice] = useState(tariffCondition.pricePerKwh.toFixed(2));
	const [newPrice, setNewPrice] = useState("");

	const handleSubmit = () => {
		console.log("CPO:", operatorName);
		console.log("Tarif:", tariff.name);
		console.log("Aktueller Preis:", currentPrice);
		console.log("Neuer Preis:", newPrice);
		console.log("Freitext:", freitext);

		// API call here if needed
		Alert.alert("Danke für deine Meldung. Wir prüfen unsere Daten.", "", [{
			text: "OK",
			onPress: () => navigation.navigate("Home"),
		}]);
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

	const fallbackImageUrl = require("@assets/cpo_generic.png");
	const displayedImageUrl = operatorImageUrl || fallbackImageUrl;
	const arrowIcon = <Arrow width={40} height={40} opacity={0.95} />;

	return (
		<KeyboardAwareScrollView
			style={{ backgroundColor: colors.ladefuchsLightBackground, height: "100%" }}
			contentContainerStyle={styles.scrollContainer}
			resetScrollToCoords={{ x: 0, y: 0 }}
			scrollEnabled
		>
			<View>
				<View style={styles.headerView}>
					<Text style={styles.headLine}>Hast Du Futter für den Fuchs?</Text>
					<View>
						<Text style={styles.headerText}>Sag uns was nicht stimmt!</Text>
						<View style={{ justifyContent: "center", alignItems: "center", marginTop: 20, marginBottom: 10 }}>
							<DetailLogos tariff={tariff} operatorName={operatorName} operatorImageUrl={displayedImageUrl} />
						</View>
					</View>

					<View style={feedbackStyles.priceContainer}>
						<TextInput
							style={feedbackStyles.priceInput}
							placeholder="Jetzt"
							value={currentPrice}
							onChangeText={setCurrentPrice}
							keyboardType="numeric"
						/>
						<View style={feedbackStyles.arrow}>{arrowIcon}</View>
						<TextInput
							style={feedbackStyles.priceInput}
							placeholder="Neu"
							value={newPrice}
							onChangeText={setNewPrice}
							keyboardType="numeric"
						/>
					</View>

					<TextInput
						style={feedbackStyles.textInput}
						placeholder="Willst Du dem Fuchs noch etwas flüstern? (max. 160 Zeichen)"
						maxLength={160}
						value={freitext}
						onChangeText={setFreitext}
						multiline
						numberOfLines={4}
					/>

					<LadefuchsButton link={tariff.affiliateLinkUrl} onPress={handleSubmit} />
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default FeedbackView;

const feedbackStyles = {
	textInput: {
		height: 60,
		borderColor: "grey",
		borderWidth: 1,
		marginTop: 5,
		marginBottom: 10,
		paddingHorizontal: 10,
		width: "100%",
		alignSelf: "center",
		textAlignVertical: "top",
		backgroundColor: colors.ladefuchsLightGrayBackground,
		borderRadius: 12,
	},
	priceContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginBottom: 5,
	},
	priceInput: {
		height: 100,
		borderColor: "grey",
		borderWidth: 1,
		marginBottom: 5,
		paddingHorizontal: 10,
		width: "40%",
		alignSelf: "center",
		textAlignVertical: "top",
		backgroundColor: colors.ladefuchsLightGrayBackground,
		borderRadius: 12,
		fontSize: scale(40),
		textAlign: "center",
		fontWeight: "500",
	},
	arrow: {
		justifyContent: "center",
	},
};
