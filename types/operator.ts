export interface Operator {
	identifier: string;
	name: string;
	imageUrl: string | null;
	isStandard: boolean;
}

export interface OperatorsResponse {
	lastUpdatedDate: string;
	operators: Operator[];
}
