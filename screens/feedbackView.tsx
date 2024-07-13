import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
	KeyboardAwareScrollView,
	KeyboardProvider,
} from "react-native-keyboard-controller";
import Arrow from "@assets/plugs/arrow.svg";
import { colors, styles } from "../theme";
import { DetailLogos } from "../components/detail/detailLogos";
import { LadefuchsButton } from "../components/detail/ladefuchsButton";
import { Tariff } from "../types/tariff";
import { ChargeMode, TariffCondition } from "../types/conditions";
import { ScaledSheet } from "react-native-size-matters";
import { FeedbackContext, FeedbackRequest } from "../types/feedback";
import { sendFeedback } from "../functions/api";
import { scale } from "react-native-size-matters";
import { PriceBox } from "../components/detail/priceBox";
import { Operator } from "../types/operator";

export function FeedbackView(): JSX.Element {
	const route = useRoute();
	const navigation = useNavigation();

	const { tariff, acTariffCondition, dcTariffCondition, operator } =
		route.params as {
			tariff: Tariff;
			acTariffCondition: TariffCondition;
			dcTariffCondition: TariffCondition;
			operator: Operator;
		};

	const [noteText, setNoteText] = useState("");

	const [formInvalid, setFormInvalid] = useState(false);
	const [acNewPrice, setAcNewPrice] = useState("");
	const [dcNewPrice, setDcNewPrice] = useState("");

	useEffect(() => {
		setFormInvalid(!noteText);
	}, [noteText]);

	const createRequestPayload = (): FeedbackRequest[] => {
		const context: FeedbackContext = {
			tariffId: tariff.identifier,
			operatorId: operator.identifier,
		};

		if (!acNewPrice) {
			return [
				{
					context,
					request: {
						type: "otherFeedback",
						attributes: { notes: noteText },
					},
				},
			];
		}

		const wrongPriceRequest = ({
			displayedPrice,
			actualPrice,
		}: {
			displayedPrice: number;
			actualPrice: number;
		}) => {
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

		const requests = [];

		const actualAcPrice = parseFloat(acNewPrice || "0");
		if (actualAcPrice) {
			requests.push(
				wrongPriceRequest({
					displayedPrice: acTariffCondition.pricePerKwh,
					actualPrice: actualAcPrice,
				})
			);
		}

		const actualDcPrice = parseFloat(dcNewPrice || "0");
		if (actualDcPrice) {
			wrongPriceRequest({
				displayedPrice: dcTariffCondition.pricePerKwh,
				actualPrice: actualDcPrice,
			});
		}
		return requests;
	};

	const handleSubmit = async () => {
		for (const request of createRequestPayload()) {
			await sendFeedback(request);
		}
		Alert.alert("Danke für deine Meldung", "Wir prüfen unsere Daten.", [
			{
				text: "OK",
				onPress: () => navigation.goBack(),
			},
		]);
	};

	const maxNoteTextLength = 200;
	const remainingCharacters = maxNoteTextLength - noteText.length;

	const renderPriceInput = ({
		chargeMode,
		currentPrice,
		newValue,
		setNewValue,
	}: {
		chargeMode: ChargeMode;
		currentPrice: number;
		newValue: string;
		setNewValue: (text: string) => void;
	}) => (
		<View style={feedbackStyles.priceContainer}>
			<PriceBox
				chargeMode={chargeMode}
				price={currentPrice}
				rounded={true}
			/>
			<View style={feedbackStyles.arrow}>
				<Arrow width={scale(27)} height={scale(27)} opacity={0.95} />
			</View>
			<TextInput
				style={feedbackStyles.newPriceInput}
				placeholder="Neu"
				value={newValue}
				maxLength={4}
				onChangeText={setNewValue}
				keyboardType="numeric"
				// returnKeyType="done"
			/>
		</View>
	);

	return (
		<KeyboardProvider>
			<KeyboardAwareScrollView
				bottomOffset={scale(52)}
				enabled={true}
				style={{
					backgroundColor: colors.ladefuchsLightBackground,
					height: "100%",
				}}
			>
				<View>
					<View style={styles.headerView}>
						<Text style={styles.headLine}>
							Hast Du Futter für den Fuchs?
						</Text>
						<View>
							<Text style={styles.headerText}>
								Sag uns was nicht stimmt!
							</Text>
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
									operatorName={operator.name}
									operatorImageUrl={operator.imageUrl}
								/>
							</View>
						</View>
						<View style={feedbackStyles.priceBoxesContainer}>
							{renderPriceInput({
								chargeMode: "ac",
								currentPrice: acTariffCondition.pricePerKwh,
								newValue: acNewPrice,
								setNewValue: setAcNewPrice,
							})}
							{renderPriceInput({
								chargeMode: "dc",
								currentPrice: dcTariffCondition.pricePerKwh,
								newValue: dcNewPrice,
								setNewValue: setDcNewPrice,
							})}
						</View>
						<View style={feedbackStyles.noteContainer}>
							<TextInput
								style={feedbackStyles.noteInput}
								placeholder={`Willst Du dem Fuchs noch etwas flüstern?`}
								maxLength={maxNoteTextLength}
								value={noteText}
								onChangeText={setNoteText}
								multiline
								numberOfLines={6}
							/>
							<Text style={feedbackStyles.charCount}>
								{remainingCharacters} / {maxNoteTextLength}
							</Text>
						</View>
						<LadefuchsButton
							disabled={formInvalid}
							link={tariff.affiliateLinkUrl}
							onPress={handleSubmit}
						/>
					</View>
				</View>
			</KeyboardAwareScrollView>
		</KeyboardProvider>
	);
}

const feedbackStyles = ScaledSheet.create({
	noteContainer: {
		position: "relative",
	},
	noteInput: {
		height: "90@s",
		borderColor: colors.ladefuchsDarkGrayBackground,
		borderWidth: "2@s",
		marginTop: 5,
		marginBottom: "10@s",
		paddingVertical: "8@s",
		paddingHorizontal: "10@s",
		fontSize: "13@s",
		width: "100%",
		alignSelf: "center",
		textAlignVertical: "top",
		backgroundColor: colors.ladefuchsLightGrayBackground,
		borderRadius: "10@s",
	},
	charCount: {
		position: "absolute",
		bottom: "14@s",
		right: "8@s",
		opacity: 0.3,
		fontSize: "11@s",
	},
	priceBoxesContainer: {
		flexDirection: "row",
		marginTop: "6@s",
		gap: "16@s",
	},
	priceContainer: {
		width: "47%",
	},
	newPriceInput: {
		borderColor: colors.ladefuchsDarkGrayBackground,
		borderWidth: "2@s",
		marginBottom: "6@s",
		paddingHorizontal: "10@s",
		paddingVertical: "6@s",
		width: "100%",
		alignSelf: "center",
		textAlignVertical: "top",
		backgroundColor: colors.ladefuchsLightGrayBackground,
		borderRadius: scale(12),
		fontSize: "34@s",
		textAlign: "center",
		fontWeight: "500",
	},
	arrow: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: "5@s",
		marginBottom: "1@s",
	},
});
