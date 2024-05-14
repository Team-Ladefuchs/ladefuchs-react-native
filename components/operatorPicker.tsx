import React, { useState, useContext } from "react";
import { Picker } from "@react-native-picker/picker";
import { AppStateContext } from "../contexts/appStateContext";
import { colors } from "../theme";

interface Props {
	onSelect: (value: string) => void;
}

const OperatorPicker = ({ onSelect }: Props) => {
	const [selectedValue, setSelectedValue] = useState("");
	const { operators } = useContext(AppStateContext);

	return (
		<Picker
			selectedValue={selectedValue}
			style={{
				width: "100%",
				height: "50%",
				justifyContent: "center",
				backgroundColor: colors.ladefuchsLightBackground,
			}}
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
