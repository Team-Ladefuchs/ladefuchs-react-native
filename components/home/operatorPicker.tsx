import React from "react";
import { Picker } from "@react-native-picker/picker";
import { Picker as AndroidPicker } from "react-native-wheel-pick";
import { useAppStore } from "../../state/state";
import { useShallow } from "zustand/react/shallow";
import { colors } from "../../theme";
import { Platform } from "react-native";

const OperatorPicker = () => {
	const { operators, operatorId, setOperatorId } = useAppStore(
		useShallow((state) => ({
			operators: state.operators,
			operatorId: state.operatorId,
			setOperatorId: state.setOperatorId,
		}))
	);

	if (!operatorId) {
		return <></>;
	}

	if (Platform.OS === "android") {
		const selectedOperatorName =
			operators.find((item) => item.identifier === operatorId) ??
			operators[0] ??
			null;
		return (
			<AndroidPicker
				style={{
					backgroundColor: colors.ladefuchsLightBackground,
					width: "100%",
					height: "130%",
				}}
				selectedValue={selectedOperatorName.name}
				// textSize={21}
				selectBackgroundColor="#8080801A" // support HEXA color Style (#rrggbbaa)
				pickerData={operators.map((item) => item.name)}
				onValueChange={(newOperatorName) => {
					const foundOperator = operators.find(
						(item) => item.name === newOperatorName
					);
					setOperatorId(foundOperator.identifier);
				}}
			/>
		);
	}
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
