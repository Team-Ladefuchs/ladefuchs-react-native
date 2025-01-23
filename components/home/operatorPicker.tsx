import React, { useMemo, useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { useAppStore } from "../../state/appState";
import { useShallow } from "zustand/react/shallow";
import { colors } from "@theme";
import { Platform, View, StyleSheet } from "react-native";
import WheelPicker from "react-native-wheely";
import { ScaledSheet, scale } from "react-native-size-matters";
import * as Haptics from "expo-haptics";

export default function OperatorPicker(): JSX.Element {
	const { operators, operatorId, setOperatorId } = useAppStore(
		useShallow((state) => ({
			operators: state.operators,
			operatorId: state.operatorId,
			setOperatorId: state.setOperatorId,
		})),
	);

	const [operatorIndex, setOperatorIndex] = useState(0);
	// Transform operators data for picker
	const operatorList = useMemo(() => {
		if (!operators?.length) return [];
		return operators.map((item) => ({
			name: item.name,
			id: item.identifier,
		}));
	}, [operators]);

	// Update operatorIndex when operatorId changes
	useEffect(() => {
		if (operators?.length && operatorId) {
			const newIndex = operators.findIndex(
				(op) => op.identifier === operatorId,
			);
			if (newIndex !== -1) {
				setOperatorIndex(newIndex);
			}
		}
	}, [operatorId, operators]);

	if (!operators?.length || !operatorList?.length) {
		return <View style={styles.pickerContainer} />;
	}

	if (Platform.OS === "android") {
		const optionLabels = operatorList.map((item) => item.name);
		return (
			<View style={[styles.pickerContainer, { marginBottom: scale(4) }]}>
				<WheelPicker
					options={optionLabels}
					selectedIndicatorStyle={{ backgroundColor: "#e9e4da" }}
					selectedIndex={operatorIndex}
					itemTextStyle={{ fontSize: scale(19) }}
					itemHeight={scale(37)}
					key={`wheel-picker-${operatorId}`}
					decelerationRate={"fast"}
					onChange={(index) => {
						if (operators[index]) {
							setOperatorId(operators[index].identifier);
							setOperatorIndex(index);
							Haptics.impactAsync(
								Haptics.ImpactFeedbackStyle.Medium,
							);
						}
					}}
				/>
			</View>
		);
	}

	return (
		<View style={styles.pickerContainer}>
			<Picker
				selectedValue={operatorId}
				itemStyle={styles.defaultPickerItemStyle}
				onValueChange={(operatorValue) => {
					setOperatorId(operatorValue);
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
				}}
			>
				{operatorList.map((operator) => (
					<Picker.Item
						key={operator.id}
						label={operator.name}
						value={operator.id}
					/>
				))}
			</Picker>
		</View>
	);
}

const styles = ScaledSheet.create({
	defaultPickerItemStyle: {
		fontWeight: "400",
		backgroundColor: colors.ladefuchsLightBackground,
		width: "100%",
		height: "100%",
	},
	pickerContainer: {
		flex: 46,
		justifyContent: "center",
		alignContent: "center",
		backgroundColor: colors.ladefuchsLightBackground,
	},
});
