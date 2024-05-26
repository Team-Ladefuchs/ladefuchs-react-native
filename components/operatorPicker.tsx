import React from "react";
import { Picker } from "@react-native-picker/picker";
import { useAppStore } from "../state/state";
import { useShallow } from "zustand/react/shallow";

const OperatorPicker = () => {
	const { operators, operatorId, setOperatorId } = useAppStore(
		useShallow((state) => ({
			operators: state.operators,
			operatorId: state.operatorId,
			setOperatorId: state.setOperatorId,
		}))
	);

	return (
		<Picker
			selectedValue={operatorId}
			itemStyle={{
				fontSize: 21,
			}}
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
