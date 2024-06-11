import React from "react";
import { Picker } from "@react-native-picker/picker";
import { Picker as AndroidPicker } from "react-native-wheel-pick";
import { useAppStore } from "../../state/state";
import { useShallow } from "zustand/react/shallow";
import { colors } from "../../theme";
import { Platform, View } from "react-native";

export default function OperatorPicker(): JSX.Element {
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
			<View
				style={{
					flex: 1,
					marginTop: -20, // Adjust this value to move the picker upwards
				}}
			>
				<AndroidPicker
					style={{
						backgroundColor: colors.ladefuchsLightBackground,
					}}
					selectedValue={selectedOperatorName.name}
					textSize={23}
					
					selectBackgroundColor="#8080801A" // support HEXA color Style (#rrggbbaa)
					pickerData={operators.map((item) => item.name)}
					onValueChange={(newOperatorName) => {
						const foundOperator = operators.find(
							(item) => item.name === newOperatorName
						);
						setOperatorId(foundOperator.identifier);
					}}
				/>
			</View>
		);
	}
	return (
		<Picker
			selectedValue={operatorId}
			itemStyle={{
				fontSize: 22,
				fontWeight: '500',
				backgroundColor: colors.ladefuchsLightBackground,
				width: "100%",
				height: "100%",
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
}
