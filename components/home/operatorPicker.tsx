import React from "react";
import { Picker } from "@react-native-picker/picker";
import { useAppStore } from "../../state/state";
import { useShallow } from "zustand/react/shallow";
import { colors } from "../../theme";
import { Platform, View, Text } from "react-native";
import { AndroidPicker } from "./androidPicker";

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
		return (
			<View
				style={{
					flex: 1,
					marginHorizontal: "auto",
					marginTop: -20, // Adjust this value to move the picker upwards
				}}
			>
				<AndroidPicker
					items={operators.map((item) => ({
						label: item.name,
						value: item.identifier,
					}))}
					onChange={(operatorValue) => {
						setOperatorId(operatorValue);
					}}
					width={320}
				/>
			</View>
		);
	}
	return (
		<Picker
			selectedValue={operatorId}
			itemStyle={{
				fontSize: 22,
				fontWeight: "500",
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
