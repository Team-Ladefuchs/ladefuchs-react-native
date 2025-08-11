import React, { useMemo, useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { useAppStore } from "../../state/appState";
import { useShallow } from "zustand/react/shallow";
import { colors } from "@theme";
import { Platform, View } from "react-native";
import WheelPicker from "react-native-wheely";
import { ScaledSheet, scale } from "react-native-size-matters";
import * as Haptics from "expo-haptics";
import { triggerHaptic } from "../../functions/util/haptics";
import type { OperatorItem } from "../../hooks/useStablePickerIOS";
import { useIOSPickerStabilizer } from "../../hooks/useStablePickerIOS";

export default function OperatorPicker(): React.JSX.Element {
  const { operators, operatorId, setOperatorId } = useAppStore(
    useShallow((state) => ({
      operators: state.operators,
      operatorId: state.operatorId,
      setOperatorId: state.setOperatorId,
    })),
  );

  const [operatorIndex, setOperatorIndex] = useState(0);

  const operatorList = useMemo<OperatorItem[]>(() => {
    if (!operators?.length) return [];
    return operators.map((item) => ({ name: item.name, id: item.identifier }));
  }, [operators]);

  // Hook immer aufrufen, um die Hook-Reihenfolge stabil zu halten
  const { containerProps, items, selectedValue, onValueChange } = useIOSPickerStabilizer(
    operatorList,
    operatorId,
    setOperatorId,
  );

  useEffect(() => {
    if (operators?.length && operatorId) {
      const newIndex = operators.findIndex((op) => op.identifier === operatorId);
      if (newIndex !== -1) setOperatorIndex(newIndex);
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
              triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            }
          }}
        />
      </View>
    );
  }

  // iOS-Props/Items kommen aus dem Hook; auf Android sind diese no-ops

  return (
    <View style={styles.pickerContainer} {...containerProps}>
      <Picker
        selectedValue={selectedValue}
        itemStyle={styles.defaultPickerItemStyle}
        onValueChange={onValueChange}
        enabled={items.length > 0}
      >
        {items
          .filter((operator) => operator?.id && operator?.name)
          .map((operator) => (
            <Picker.Item
              key={operator.id}
              label={operator.name || ""}
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
