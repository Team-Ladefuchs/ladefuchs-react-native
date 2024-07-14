import React, { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
	KeyboardAwareScrollView,
	KeyboardProvider,
} from "react-native-keyboard-controller";

import Arrow from "@assets/plugs/arrow.svg";
import { colors, styles as themeStyle } from "../theme";
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
import { parseDecimal } from "../functions/util";
import { ToastNotification } from "../components/detail/feedbackView/toastNotification";

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
	const [disableSendButton, setDisableSendButton] = useState(false);
	const [sendButtonText, setSendButtonText] = useState("Senden");

	const [acNewPrice, setAcNewPrice] = useState("");
	const [dcNewPrice, setDcNewPrice] = useState("");
	const maxNoteTextLength = 200;
	const [remainingCharacters, setRemainingCharacters] =
		useState(maxNoteTextLength);

	useEffect(() => {
		setRemainingCharacters(maxNoteTextLength - noteText.length);
	}, [setRemainingCharacters, noteText]);

	useEffect(() => {
		setDisableSendButton(!noteText);
	}, [setDisableSendButton, noteText]);

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

		const requests = [];
		const actualAcPrice = parseDecimal(acNewPrice);

		if (actualAcPrice) {
			requests.push(
				wrongPriceRequest({
					displayedPrice: acTariffCondition.pricePerKwh,
					actualPrice: actualAcPrice,
					context,
					noteText,
				})
			);
		}

		const actualDcPrice = parseDecimal(dcNewPrice);
		if (actualDcPrice) {
			requests.push(
				wrongPriceRequest({
					displayedPrice: dcTariffCondition.pricePerKwh,
					actualPrice: actualDcPrice,
					context,
					noteText,
				})
			);
		}
		return requests;
	};

	const handleSubmit = async () => {
		try {
			setDisableSendButton(true);
			setSendButtonText("Momentchen …");

			for (const request of createRequestPayload()) {
				await sendFeedback(request);
			}

			Toast.show({
				onHide: () => navigation.goBack(),
				type: "error",
				text1: "⚡️ Vielen Dank für dein Feedback!",
				visibilityTime: 1100,
			});
		} catch (error) {
			Toast.show({
				onHide: () => navigation.goBack(),
				type: "error",
				text1: "🚧 Ups, ein Fehler ist aufgetreten.",
				visibilityTime: 1200,
			});
		} finally {
			setSendButtonText("Senden");
			setDisableSendButton(false);
		}
	};

	return (
		<KeyboardProvider>
			<KeyboardAwareScrollView
				bottomOffset={scale(9)}
				enabled={true}
				style={{
					backgroundColor: colors.ladefuchsLightBackground,
					height: "100%",
				}}
			>
				<View>
					<View style={themeStyle.headerView}>
						<Text style={themeStyle.headLine}>
							Hast Du Futter für den Fuchs?
						</Text>
						<View>
							<Text style={themeStyle.headerText}>
								Sag uns was nicht stimmt!
							</Text>
							<View style={feedbackthemeStyle.logosContainer}>
								<DetailLogos
									tariff={tariff}
									operatorName={operator.name}
									operatorImageUrl={operator?.imageUrl}
								/>
							</View>
						</View>
						<View style={feedbackthemeStyle.priceBoxesContainer}>
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
						<View style={feedbackthemeStyle.noteContainer}>
							<TextInput
								style={feedbackthemeStyle.noteInput}
								placeholder={`Willst Du dem Fuchs noch etwas flüstern?`}
								maxLength={maxNoteTextLength}
								value={noteText}
								placeholderTextColor={
									colors.ladefuchsGrayTextColor
								}
								onChangeText={setNoteText}
								multiline
								numberOfLines={6}
							/>
							<Text style={feedbackthemeStyle.charCount}>
								{remainingCharacters} / {maxNoteTextLength}
							</Text>
						</View>

						<LadefuchsButton
							text={sendButtonText}
							disabled={disableSendButton}
							onPress={handleSubmit}
						/>
					</View>
				</View>
			</KeyboardAwareScrollView>
			<ToastNotification />
		</KeyboardProvider>
	);
}

const feedbackthemeStyle = ScaledSheet.create({
	logosContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginVertical: "6@s",
	},
	noteContainer: {
		position: "relative",
	},
	noteInput: {
		height: "90@s",
		borderColor: colors.ladefuchsDarkGrayBackground,
		borderWidth: "2@s",
		marginTop: "3@s",
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
		marginTop: "2@s",
		gap: "14@s",
	},
	priceContainer: {
		flex: 1,
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

function renderPriceInput({
	chargeMode,
	currentPrice,
	newValue,
	setNewValue,
}: {
	chargeMode: ChargeMode;
	currentPrice: number;
	newValue: string;
	setNewValue: (text: string) => void;
}) {
	return (
		<View style={feedbackthemeStyle.priceContainer}>
			<PriceBox
				chargeMode={chargeMode}
				price={currentPrice}
				rounded={true}
			/>
			<View style={feedbackthemeStyle.arrow}>
				<Arrow width={scale(27)} height={scale(27)} opacity={0.95} />
			</View>
			<TextInput
				style={feedbackthemeStyle.newPriceInput}
				placeholder="Neu"
				value={newValue}
				maxLength={4}
				placeholderTextColor={colors.ladefuchsGrayTextColor}
				onChangeText={setNewValue}
				inputMode="decimal"
				keyboardType="decimal-pad"
				returnKeyType="done"
			/>
		</View>
	);
}

function wrongPriceRequest({
	displayedPrice,
	actualPrice,
	noteText,
	context,
}: {
	displayedPrice: number;
	actualPrice: number;
	noteText: string;
	context: FeedbackContext;
}) {
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
}
