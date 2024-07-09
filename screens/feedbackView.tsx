import React, { useState } from "react";
import { View, Text, TextInput, Alert, Switch } from "react-native";
import { colors, styles } from "../theme";
import { DetailLogos } from "../components/detail/detailLogos";
import { Tariff } from "../types/tariff";
import { TariffCondition } from "../types/conditions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LadefuchsButton } from "../components/detail/ladefuchsButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { scale } from "react-native-size-matters";
import { ChargeMode } from "../types/conditions";
import Arrow from "@assets/plugs/arrow.svg";

function FeedbackView({
	chargeMode,
	price,
}: {
	chargeMode: ChargeMode;
	price: number | null | undefined;
}) {
	const route = useRoute();
	const navigation = useNavigation();
	const { tariff, tariffCondition, operatorName, operatorImageUrl } =
		route.params as {
			tariff: Tariff;
			tariffCondition: TariffCondition;
			operatorName: string;
			operatorImageUrl: string | null;
		};
	const formatPrice = (price: number) => price.toFixed(2);
	const [freitext, setFreitext] = useState("");
	const [isFalscherPreis, setIsFalscherPreis] = useState(true);
	const [currentPrice, setCurrentPrice] = useState(
		formatPrice(tariffCondition.pricePerKwh)
	);
	const [newPrice, setNewPrice] = useState("");

	const handleSubmit = () => {
		console.log("CPO:", operatorName);
		console.log("Tarif:", tariff.name);
		console.log("Aktueller Preis:", currentPrice);
		console.log("Neuer Preis:", newPrice);

		console.log("Freitext:", freitext);

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

	const fallbackImageUrl = require("@assets/cpo_generic.png");
	const displayedImageUrl = operatorImageUrl || fallbackImageUrl;
	const OperatorName = operatorName || fallbackImageUrl;
	const plugSize = 40;
	const plugOpacity = 0.95;
	const arrow = (
		<Arrow width={plugSize} height={plugSize} opacity={plugOpacity} />
	);

	return (
		<KeyboardAwareScrollView
			style={{
				backgroundColor: colors.ladefuchsLightBackground,
				height: "100%",
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
						<View>
							<Text style={styles.headerText}>
								Sag uns was nicht stimmt!
							</Text>
						</View>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								marginTop: 20,
								marginBottom: 10,
							}}
						>
							<DetailLogos
								tariff={tariff}
								operatorName={OperatorName}
								operatorImageUrl={displayedImageUrl}
							/>
						</View>
					</View>

					<View style={feedbackstyle.priceContainer}>
						<TextInput
							style={feedbackstyle.priceInput}
							placeholder="Aktueller Preis"
							value={currentPrice}
							onChangeText={setCurrentPrice}
							keyboardType="numeric"
						/>
						<View style={feedbackstyle.arrow}>{arrow}</View>
						<TextInput
							style={feedbackstyle.priceInput}
							placeholder="Neu"
							value={newPrice}
							onChangeText={setNewPrice}
							keyboardType="numeric"
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
		marginTop: 5,
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
	priceText: {
		textAlign: "center",
		fontWeight: "500",
		fontSize: scale(40),
	},

	priceHeaderText: {
		fontSize: scale(24),
		fontWeight: "700",
		textAlign: "center",
		marginRight: scale(4),
	},
	priceHeaderContainer: {
		display: "flex",
		borderTopLeftRadius: scale(12),
		borderTopRightRadius: scale(12),
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",
		flexDirection: "row",
		paddingHorizontal: scale(12),
		paddingVertical: scale(11),
		backgroundColor: colors.ladefuchsDarkGrayBackground,
	},
	placeholderText: {
		position: "absolute",
		left: 10,
		top: 10,
		fontSize: 20, // Set your desired placeholder font size
		color: "#888", // Set the placeholder text color
	},
	arrow: {
		justifyContent: "center",
	},
};

export default FeedbackView;
