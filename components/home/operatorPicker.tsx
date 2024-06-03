import React from "react";
import { Picker } from "@react-native-picker/picker";
import { Picker as AndroidPicker } from "react-native-wheel-pick";
import { useAppStore } from "../../state/state";
import { useShallow } from "zustand/react/shallow";
import { colors } from "../../theme";
import { Platform, View, StyleSheet } from "react-native";

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
			<View style={styles.container}>
				<AndroidPicker
					style={{
						backgroundColor: colors.ladefuchsLightBackground,
					}}
					selectedValue={selectedOperatorName.name}
					textSize={20}
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
				fontSize: 20,
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
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: -20, // Adjust this value to move the picker upwards
	},
	picker: {
		width: "80%", // Adjust as needed
		backgroundColor: "#8080801A", // Example background color
		height: "40%",
	},
	item: {
		height: 10, // Adjust this height as needed
		fontSize: 21, // Adjust text size if needed
	},
});

export default OperatorPicker;
