export interface Operator {
	identifier: string;
	name: string;
}

export interface OperatorsResponse {
	lastUpdatedDate: string;
	operators: Operator[];
}

// operatorID
let selectedValue = "";

export const setSelectedValue = (value) => {
  selectedValue = String(value); // Konvertiere den Wert in einen String
};

export const getSelectedValue = () => {
  return selectedValue;
};
