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
}

export interface OtherFeedbackAttributes {
	notes: string;
}

export type FeedbackType = "wrongPriceFeedback" | "otherFeedback";

export type FeedbackRequest =
	| {
			context: FeedbackContext;
			request: {
				type: "wrongPriceFeedback";
				attributes: WrongPriceFeedbackAttributes;
			};
	  }
	| {
			context: FeedbackContext;
			request: {
				type: "otherFeedback";
				attributes: OtherFeedbackAttributes;
			};
	  };
