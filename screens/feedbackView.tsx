import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
	ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";

import { colors, styles as themeStyle } from "@theme";
import { DetailLogos } from "../components/detail/detailLogos";
import { LadefuchsButton } from "../components/detail/ladefuchsButton";
import { ChargeMode } from "../types/conditions";
import { ScaledSheet, scale } from "react-native-size-matters";
import {
	FeedbackContext,
	FeedbackRequest,
	OtherFeedbackRequest,
	WrongPriceRequest,
} from "../types/feedback";

import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSequence,
	interpolateColor,
} from "react-native-reanimated";

import { PriceBox } from "../components/detail/priceBox";

import { useCounter } from "../hooks/useCounter";
import { sendFeedback } from "../functions/api/feedback";
import i18n from "../translations/translations";
import { FeedbackScreenRouteParams } from "../appRoutes";
import {
	retrieveFromStorage,
	saveToStorage,
} from "../functions/storage/storage";
import { triggerHaptic } from "../functions/util/haptics";

const notePlaceholderText = i18n.t("food2");

const minNotesLength = 15;

async function inUnderFeedbackDebounce(): Promise<boolean> {
	const lastReviewDate = await retrieveFromStorage<number | null>(
		"lastFeedBackSend",
	);

	const threeminutes = 60 * 1000; // 3minutes
	return Date.now() - Number(lastReviewDate ?? 0) > threeminutes;
}

export function FeedbackView(): JSX.Element {
	const route = useRoute<FeedbackScreenRouteParams>();
	const navigation = useNavigation();

	const { tariff, acTariffCondition, dcTariffCondition, operator } =
		route.params;

	const [notePlaceholder, setNotePlaceholder] =
		useState<string>(notePlaceholderText);

	const [feedBackButtonStatus, setfeedBackButtonStatus] = useState(false);

	const [noteText, setNoteText] = useState("");
	const [sendButtonText, setSendButtonText] = useState(i18n.t("send"));

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
		inUnderFeedbackDebounce().then(setfeedBackButtonStatus);
	}, []);

	useEffect(() => {
		setRemainingCharacters(maxNoteTextLength - noteText.length);
	}, [setRemainingCharacters, noteText]);

	const createRequestPayload = (): FeedbackRequest[] => {
		const context: FeedbackContext = {
			tariffId: tariff.identifier,
			operatorId: operator.identifier,
		};

		const requests: FeedbackRequest[] = [];

		const acWrongPrice = buildWrongPriceRequest({
			displayedPrice: acTariffCondition?.pricePerKwh,
			actualPrice: acPriceCounter.value,
			context,
			noteText,
			chargeType: "ac",
		});

		if (acWrongPrice) {
			requests.push(acWrongPrice);
		}

		const dcWrongPrice = buildWrongPriceRequest({
			displayedPrice: dcTariffCondition?.pricePerKwh,
			actualPrice: dcPriceCounter.value,
			context,
			noteText,
			chargeType: "dc",
		});
		if (dcWrongPrice) {
			requests.push(dcWrongPrice);
		}

		if (!requests.length) {
			requests.push({
				context,
				request: {
					type: "otherFeedback",
					attributes: { notes: noteText },
				},
			} satisfies OtherFeedbackRequest);
		}
		return requests;
	};

	const handleSubmit = async () => {
		try {
			const animationDuration = 1000;
			if (noteText.length < minNotesLength) {
				borderColorState.value = withSequence(
					withTiming(1, { duration: animationDuration / 2 }),
					withTiming(0, { duration: animationDuration }),
				);
				return;
			}
			setSendButtonText(i18n.t("moment"));

			for (const request of createRequestPayload()) {
				await sendFeedback(request);
			}

			navigation.goBack();
			saveToStorage("lastFeedBackSend", Date.now());
			setTimeout(() => {
				Toast.show({
					type: "success",
					text1: i18n.t("thxfeedback"),
					visibilityTime: 2000,
				});
			}, 500);
		} catch (error) {
			await triggerHaptic(Haptics.NotificationFeedbackType.Error);
			setSendButtonText("send");
			console.log("sending feedback", error);
			Toast.show({
				type: "error",
				text1: i18n.t("ups"),
				visibilityTime: 2400,
			});
		}
	};

	const borderColorState = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => ({
		borderColor: interpolateColor(
			borderColorState.value,
			[0, 1],
			[colors.ladefuchsDarkGrayBackground, "red"],
		),
	}));

	const renderNoteInput = () => {
		return (
			<View style={{ position: "relative", marginHorizontal: scale(16) }}>
				<Animated.View
					style={[
						animatedStyle,
						{
							borderWidth: scale(3),
							borderRadius: scale(10),
						},
					]}
				>
					<TextInput
						style={[feedbackStyle.noteInput]}
						placeholder={notePlaceholder}
						onFocus={() => setNotePlaceholder("")}
						maxLength={maxNoteTextLength}
						value={noteText}
						placeholderTextColor={colors.ladefuchsGrayTextColor}
						onBlur={() => {
							if (noteText) {
								setNotePlaceholder(notePlaceholderText);
							}
						}}
						onChangeText={setNoteText}
						multiline
						numberOfLines={6}
					/>
				</Animated.View>
			</View>
		);
	};

	return (
		<KeyboardAvoidingView
			style={feedbackStyle.keyboardView}
			behavior={Platform.OS === "ios" ? "position" : "padding"}
			keyboardVerticalOffset={scale(Platform.OS === "ios" ? -22 : 0)}
		>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<ScrollView keyboardShouldPersistTaps="handled" bounces>
					<View style={{ marginHorizontal: scale(16) }}>
						<Text
							style={[
								themeStyle.headLine,
								{
									marginTop: scale(16),
								},
							]}
						>
							{i18n.t("food")}
						</Text>
						<View>
							<Text style={themeStyle.headerText}>
								{i18n.t("food1")}
							</Text>
							<View style={feedbackStyle.logosContainer}>
								<DetailLogos
									tariff={tariff}
									operator={operator}
								/>
							</View>
						</View>
					</View>
					<View style={feedbackStyle.priceBoxesContainer}>
						<View style={feedbackStyle.priceContainer}>
							<PriceBox
								editMode={true}
								chargeMode={"ac"}
								onIncrement={acPriceCounter.increment}
								onDecrement={acPriceCounter.decrement}
								price={acPriceCounter.value}
								rounded={true}
							/>
						</View>
						<View style={feedbackStyle.priceContainer}>
							<PriceBox
								editMode={true}
								onIncrement={dcPriceCounter.increment}
								onDecrement={dcPriceCounter.decrement}
								chargeMode={"dc"}
								price={dcPriceCounter.value}
								rounded={true}
							/>
						</View>
					</View>
					<View style={feedbackStyle.noteContainer}>
						{renderNoteInput()}
						<Text style={feedbackStyle.charCount}>
						{`${i18n.t("minChar")}  ${remainingCharacters}/${maxNoteTextLength}`}
						</Text>
					</View>
					<View style={{ marginHorizontal: scale(16) }}>
						{feedBackButtonStatus ? (
							<LadefuchsButton
								text={sendButtonText}
								onPress={handleSubmit}
							/>
						) : (
							<LadefuchsButton
								text={i18n.t("feedbackDebounceText")}
								disabled={true}
								onPress={handleSubmit}
							/>
						)}
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}

const feedbackStyle = ScaledSheet.create({
	keyboardView: {
		backgroundColor: colors.ladefuchsLightBackground,
		height: "100%",
	},
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
		height: "92@s",
		paddingVertical: "8@s",
		paddingHorizontal: "10@s",
		fontSize: "13@s",
		width: "100%",
		alignSelf: "center",
		textAlignVertical: "top",
		borderRadius: "7@s",
		backgroundColor: colors.ladefuchsLightGrayBackground,
	},
	charCount: {
		position: "absolute",
		bottom: "4@s",
		right: "24@s",
		opacity: 0.3,
		fontSize: "11@s",
	},
	priceBoxesContainer: {
		flexDirection: "row",
		marginTop: "8@s",
		gap: "12@s",
		marginHorizontal: "16@s",
	},
	priceContainer: {
		flex: 1,
		width: "auto",
	},
	grandient: {
		borderRadius: "10@s",
	},
});

function buildWrongPriceRequest({
	displayedPrice,
	actualPrice,
	context,
	noteText,
	chargeType,
}: {
	displayedPrice?: number | null;
	actualPrice: number;
	context: FeedbackContext;
	noteText: string;
	chargeType: ChargeMode;
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
					notes: noteText.trim(),
					displayedPrice,
					actualPrice,
					chargeType,
				},
			},
		} satisfies WrongPriceRequest;
	}

	return null;
}
