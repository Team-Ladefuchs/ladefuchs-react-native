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
import { LinearGradient } from "expo-linear-gradient";

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
} from "react-native-reanimated";

import { PriceBox } from "../components/detail/priceBox";

import { useCounter } from "../hooks/useCounter";
import { sendFeedback } from "../functions/api/feedback";
import i18n from "../translations/translations";
import { FeedbackScreenRouteParams } from "../appRoutes";

const notePlaceholderText = i18n.t("futter2");

export function FeedbackView(): JSX.Element {
	const route = useRoute<FeedbackScreenRouteParams>();
	const navigation = useNavigation();

	const { tariff, acTariffCondition, dcTariffCondition, operator } =
		route.params;

	const [notePlaceholder, setNotePlaceholder] =
		useState<string>(notePlaceholderText);
	const [noteText, setNoteText] = useState("");
	const [disableSendButton, setDisableSendButton] = useState(false);
	const [sendButtonText, setSendButtonText] = useState(i18n.t("senden"));
	const [hasError, setHasError] = useState(false);

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
			setDisableSendButton(true);
			setSendButtonText(i18n.t("momentchen"));

			for (const request of createRequestPayload()) {
				await sendFeedback(request);
			}

			navigation.goBack();
			setTimeout(() => {
				Toast.show({
					type: "success",
					text1: i18n.t("thxfeedback"),
					visibilityTime: 2000,
				});
			}, 500);
		} catch (error) {
			await Haptics.notificationAsync(
				Haptics.NotificationFeedbackType.Error,
			);
			setSendButtonText("Senden");
			console.log("sending feedback", error);
			setDisableSendButton(false);
			Toast.show({
				type: "error",
				text1: i18n.t("ups"),
				visibilityTime: 2400,
			});
		}
	};

	const opacity = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));
	const renderNoteInput = () => {
		return (
			<View style={{ position: "relative", marginHorizontal: scale(16) }}>
				<Animated.View
					style={[animatedStyle, feedbackStyle.animateContainer]}
				>
					<LinearGradient
						colors={["#e30f08", "#a33902"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 0, y: 1 }}
						style={[feedbackStyle.grandient]}
					>
						<View
							style={{
								backgroundColor: "#F3EEE2",
								borderRadius: scale(11),
							}}
						>
							<TextInput
								style={[
									feedbackStyle.noteInput,
									{
										borderColor: "transparent",
										borderWidth: 0,
									},
								]}
								value={noteText}
								multiline
								numberOfLines={6}
							/>
						</View>
					</LinearGradient>
				</Animated.View>

				<TextInput
					style={[
						feedbackStyle.noteInput,
						{
							zIndex: 2,
						},
					]}
					placeholder={notePlaceholder}
					onFocus={() => setNotePlaceholder("")}
					maxLength={maxNoteTextLength}
					value={noteText}
					placeholderTextColor={colors.ladefuchsGrayTextColor}
					onBlur={() => {
						if (!noteText) {
							setNotePlaceholder(notePlaceholderText);
						}
					}}
					onChangeText={(text) => {
						setNoteText(text);
						if (text) setHasError(false);
					}}
					multiline
					numberOfLines={6}
				/>
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
					<Text
						style={[themeStyle.headLine, { marginTop: scale(16) }]}
					>
						{i18n.t("futter")}
					</Text>
					<View>
						<Text style={themeStyle.headerText}>
							{i18n.t("futter1")}
						</Text>
						<View style={feedbackStyle.logosContainer}>
							<DetailLogos tariff={tariff} operator={operator} />
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
							{remainingCharacters} / {maxNoteTextLength}
						</Text>
					</View>

					<TouchableWithoutFeedback
						onPress={() => {
							if (disableSendButton) {
								opacity.value = withTiming(1, {
									duration: 360,
								});
								setTimeout(() => {
									opacity.value = withTiming(0, {
										duration: 360,
									});
								}, 1600);
							}
						}}
					>
						<View style={{ marginHorizontal: scale(16) }}>
							<LadefuchsButton
								text={sendButtonText}
								disabled={disableSendButton}
								onPress={handleSubmit}
							/>
						</View>
					</TouchableWithoutFeedback>
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
		borderColor: colors.ladefuchsDarkGrayBackground,
		paddingVertical: "8@s",
		borderWidth: "2@s",
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
	animateContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		shadowColor: "#b80600",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 1,
		shadowRadius: "10@s",
		elevation: 4,
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
