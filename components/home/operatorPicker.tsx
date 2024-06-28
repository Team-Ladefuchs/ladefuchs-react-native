import React from "react";
import { Picker } from "@react-native-picker/picker";
import { useAppStore } from "../../state/state";
import { useShallow } from "zustand/react/shallow";
import { colors } from "../../theme";
import { Platform, View } from "react-native";
import WheelPicker from "@quidone/react-native-wheel-picker";
import { scale } from "react-native-size-matters";
import { useDebounce } from "../../hooks/debounce";

export default function OperatorPicker(): JSX.Element {
	const { operators, operatorId, setOperatorId } = useAppStore(
		useShallow((state) => ({
			operators: state.operators,
			operatorId: state.operatorId,
			setOperatorId: state.setOperatorId,
		}))
	);

	const debouncedChangeHandler = useDebounce((operatorId: string) => {
		setOperatorId(operatorId);
	}, 210);

	if (!operatorId) {
		return <></>;
	}

	if (Platform.OS === "android") {
		return (
			<View
				style={{
					flex: 1,
					paddingHorizontal: scale(16),
					marginBottom: 5,
					justifyContent: "center",
				}}
			>
				<WheelPicker
					data={operators.map((item) => ({
						label: item.name,
						value: item.identifier,
					}))}
					itemTextStyle={{
						fontSize: scale(21),
					}}
					itemHeight={scale(40)}
					onValueChanging={({ item }) => {
						debouncedChangeHandler(item.value);
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
