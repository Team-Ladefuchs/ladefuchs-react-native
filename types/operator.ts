export interface Operator {
	identifier: string;
	name: string;
}

export interface OperatorsResponse {
	lastUpdatedDate: string;
	operators: Operator[];
}
