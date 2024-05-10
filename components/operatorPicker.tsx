import React, { useState, useContext } from "react";
import { Picker } from "@react-native-picker/picker";
import { AppDataContext } from "../contexts/appDataContext";

interface Props {
	onSelect: (value: string) => void;
}

const OperatorPicker = ({ onSelect }: Props) => {
	const [selectedValue, setSelectedValue] = useState("");
	const { operators } = useContext(AppDataContext);

	return (
		<Picker
			selectedValue={selectedValue}
			style={{ height: 50, width: "100%" }}
			itemStyle={{ fontSize: 20 }}
			onValueChange={(operatorValue, itemIndex) => {
				setSelectedValue(operatorValue);
				onSelect(operatorValue);
			}}
		>
			{operators?.map((operator) => (
				<Picker.Item
					key={operator.identifier}
					label={operator.name}
					value={operator.identifier}
				/>
			))}
		</Picker>
	);
};

export default OperatorPicker;
