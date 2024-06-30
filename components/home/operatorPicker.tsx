import React from "react";
import { Picker } from "@react-native-picker/picker";
import { useAppStore } from "../../state/state";
import { useShallow } from "zustand/react/shallow";
import { colors } from "../../theme";
import { Platform, View } from "react-native";
import WheelPicker from "react-native-wheely";
import { scale } from "react-native-size-matters";

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
					display: "flex",
					paddingHorizontal: scale(16),
					marginBottom: 5,
					justifyContent: "center",
				}}
			>
				<WheelPicker
					options={operators.map((item) => item.name)}
					itemTextStyle={{
						fontSize: scale(21),
					}}
					selectedIndicatorStyle={{ backgroundColor: "#e9e4da" }}
					selectedIndex={0}
					// scaleFunction={(x: number) => 0.8 ** x}
					rotationFunction={(x: number) => 1 - Math.pow(1 / 4, x)}
					visibleRest={4}
					decelerationRate={"fast"}
					onChange={(index) => {
						setOperatorId(operators[index].identifier);
					}}
				/>
			</View>
		);
	}
	return (
		<Picker
			selectedValue={operatorId}
			itemStyle={{
				fontSize: scale(20),
				fontWeight: "400",
				backgroundColor: colors.ladefuchsLightBackground,
				width: "100%",
				height: "100%",
			}}
			onValueChange={(operatorValue) => {
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
