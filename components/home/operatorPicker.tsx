import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Picker } from "@react-native-picker/picker";
import { useAppStore } from "../../state/appState";
import { useShallow } from "zustand/react/shallow";
import { colors } from "@theme";
import { Platform, View, ColorSchemeName } from "react-native";
import WheelPicker from "react-native-wheely";
import { ScaledSheet, scale } from "react-native-size-matters";
import * as Haptics from "expo-haptics";
import { triggerHaptic } from "../../functions/util/haptics";

export default function OperatorPicker(){
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

	// Memoized callback for iOS picker
	const handleIOSValueChange = useCallback((operatorValue: string) => {
		setOperatorId(operatorValue);
		triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
	}, [setOperatorId]);

	if (!operators?.length || !operatorList?.length || !operatorId) {
		return null;
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
							triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
						}
					}}
				/>
			</View>
		);
	}

	return (
		<View style={styles.pickerContainer}>
			<Picker
				key={`ios-picker-${operatorId}`}
				selectedValue={
					operatorList.find((op) => op.id === operatorId)?.id ?? operatorList[0]?.id
				}
				itemStyle={styles.defaultPickerItemStyle}
				onValueChange={handleIOSValueChange}
			>
				{operatorList
					.filter((operator) => operator?.id && operator?.name)
					.map((operator) => (
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
		...Platform.select({
			ios: {
				color: "#000000",
				appearance: "light" as ColorSchemeName,
			},
		}),
	},
	pickerContainer: {
		flex: 46,
		justifyContent: "center",
		alignContent: "center",
		backgroundColor: colors.ladefuchsLightBackground,
	},
});
