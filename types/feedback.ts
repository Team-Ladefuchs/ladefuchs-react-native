import { ChargeMode } from "./conditions";

export interface FeedbackContext {
	operatorId: string;
	tariffId: string;
	language?: "de";
	email?: string;
}

export interface WrongPriceFeedbackAttributes {
	notes: string;
	displayedPrice: number;
	actualPrice: number;
	chargeType: ChargeMode;
}

export interface OtherFeedbackAttributes {
	notes: string;
}

export type FeedbackType = "wrongPriceFeedback" | "otherFeedback";

export type WrongPriceRequest = {
	context: FeedbackContext;
	request: {
		type: "wrongPriceFeedback";
		attributes: WrongPriceFeedbackAttributes;
	};
};

export type OtherFeedbackRequest = {
	context: FeedbackContext;
	request: {
		type: "otherFeedback";
		attributes: OtherFeedbackAttributes;
	};
};

export type FeedbackRequest = WrongPriceRequest | OtherFeedbackRequest;
