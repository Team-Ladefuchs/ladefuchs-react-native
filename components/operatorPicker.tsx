import React from "react";
import { Picker } from "@react-native-picker/picker";
import { useAppStore } from "../state/state";

const OperatorPicker = () => {
	const { operators, operatorId, setOperatorId } = useAppStore((state) => ({
		operators: state.operators,
		operatorId: state.operatorId,
		setOperatorId: state.setOperatorId,
	}));

	return (
		<Picker
			selectedValue={operatorId}
			itemStyle={{ fontSize: 20 }}
			onValueChange={(operatorValue, _i) => {
				setOperatorId(operatorValue);
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
