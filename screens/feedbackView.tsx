import React, { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
	KeyboardAwareScrollView,
	KeyboardProvider,
} from "react-native-keyboard-controller";

import { colors, styles as themeStyle } from "../theme";
import { DetailLogos } from "../components/detail/detailLogos";
import { LadefuchsButton } from "../components/detail/ladefuchsButton";
import { Tariff } from "../types/tariff";
import { TariffCondition } from "../types/conditions";
import { ScaledSheet } from "react-native-size-matters";
import { FeedbackContext, FeedbackRequest } from "../types/feedback";

import { scale } from "react-native-size-matters";
import { PriceBox } from "../components/detail/priceBox";
import { Operator } from "../types/operator";
import { useCounter } from "../hooks/useCounter";

export function FeedbackView(): JSX.Element {
	const route = useRoute();
	const navigation = useNavigation();

	const { tariff, acTariffCondition, dcTariffCondition, operator } =
		route.params as {
			tariff: Tariff;
			acTariffCondition: TariffCondition | null;
			dcTariffCondition: TariffCondition | null;
			operator: Operator;
		};

	const [noteText, setNoteText] = useState("");
	const [disableSendButton, setDisableSendButton] = useState(false);
	const [sendButtonText, setSendButtonText] = useState("Senden");

	const acPriceCounter = useCounter({
		initialValue: acTariffCondition?.pricePerKwh ?? 0,
	});
	const dcPriceCounter = useCounter({
		initialValue: dcTariffCondition?.pricePerKwh ?? 0,
	});

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

		const requests = [];

		const acPriceRequest = checkPriceAndPushRequest({
			displayedPrice: acTariffCondition.pricePerKwh,
			actualPrice: acPriceCounter.value,
			context,
			noteText,
		});

		if (acPriceRequest) {
			requests.push(acPriceCounter);
		}

		const dcPriceRequest = checkPriceAndPushRequest({
			displayedPrice: dcTariffCondition.pricePerKwh,
			actualPrice: dcPriceCounter.value,
			context,
			noteText,
		});
		if (dcPriceRequest) {
			requests.push(dcPriceRequest);
		}

		if (!requests.length) {
			requests.push({
				context,
				request: {
					type: "otherFeedback",
					attributes: { notes: noteText },
				},
			});
		}
		return requests;
	};

	const handleSubmit = async () => {
		const wait = (ms: number) =>
			new Promise((resolve) => setTimeout(resolve, ms));
		try {
			setDisableSendButton(true);
			setSendButtonText("Momentchen …");

			for (const request of createRequestPayload()) {
				console.log("request", request);
				// await sendFeedback(request);
			}

			await wait(300);
			navigation.goBack();
			setTimeout(() => {
				Toast.show({
					type: "success",
					text1: "⚡️ Vielen Dank für dein Feedback!",
					visibilityTime: 2000,
				});
			}, 500);
		} catch (error) {
			setSendButtonText("Senden");
			setDisableSendButton(false);
			Toast.show({
				type: "error",
				text1: "🚧 Ups, ein Fehler ist aufgetreten.",
				visibilityTime: 2400,
			});
		}
	};

	return (
		<KeyboardProvider>
			<KeyboardAwareScrollView
				bottomOffset={scale(14)}
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
							<View style={feedbackthemeStyle.priceContainer}>
								<PriceBox
									editMode={true}
									chargeMode={"ac"}
									onIncrement={acPriceCounter.increment}
									onDecrease={acPriceCounter.decrement}
									price={acPriceCounter.value}
									rounded={true}
								/>
							</View>
							<View style={feedbackthemeStyle.priceContainer}>
								<PriceBox
									editMode={true}
									onIncrement={dcPriceCounter.increment}
									onDecrease={dcPriceCounter.decrement}
									chargeMode={"dc"}
									price={dcPriceCounter.value}
									rounded={true}
								/>
							</View>
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
		</KeyboardProvider>
	);
}

const feedbackthemeStyle = ScaledSheet.create({
	logosContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginVertical: "10@s",
	},
	noteContainer: {
		marginVertical: "16@s",
		position: "relative",
	},
	noteInput: {
		height: "90@s",
		borderColor: colors.ladefuchsDarkGrayBackground,
		borderWidth: "2@s",
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
		bottom: "4@s",
		right: "8@s",
		opacity: 0.3,
		fontSize: "11@s",
	},
	priceBoxesContainer: {
		flexDirection: "row",
		marginTop: "8@s",
		gap: "14@s",
	},
	priceContainer: {
		flex: 1,
		width: "auto",
	},
	newPriceInput: {
		borderColor: colors.ladefuchsDarkGrayBackground,
		borderWidth: "2@s",
		paddingHorizontal: "10@s",
		paddingVertical: "6@s",
		width: "100%",
		backgroundColor: colors.ladefuchsLightGrayBackground,
		borderRadius: scale(12),
		textAlign: "left",
		fontWeight: "500",
	},
});

function checkPriceAndPushRequest({
	displayedPrice,
	actualPrice,
	context,
	noteText,
}: {
	displayedPrice: number | null;
	actualPrice: number;
	context;
	noteText;
}) {
	if (
		displayedPrice &&
		displayedPrice.toFixed(2) !== actualPrice.toFixed(2)
	) {
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

	return null;
}
