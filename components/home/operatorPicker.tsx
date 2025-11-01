import React from "react";
import { Picker } from "@react-native-picker/picker";
import { useAppStore } from "../../state/appState";
import { useShallow } from "zustand/react/shallow";
import { colors } from "@theme";
import { Platform, View } from "react-native";
import WheelPicker from "react-native-wheely";
import { ScaledSheet, scale } from "react-native-size-matters";
import { useOperatorPicker } from "../../hooks/useOperatorPicker";

export default function OperatorPicker(): React.JSX.Element {
  const { operators, operatorId, setOperatorId } = useAppStore(
    useShallow((state) => ({
      operators: state.operators,
      operatorId: state.operatorId,
      setOperatorId: state.setOperatorId,
    })),
  );

  const pickerData = useOperatorPicker(operators, operatorId, setOperatorId);

  if (!operators?.length || !pickerData.operatorList?.length) {
    return <View style={styles.pickerContainer} />;
  }

  if (pickerData.platform === "android") {
    return (
      <View style={[styles.pickerContainer, { marginBottom: scale(4) }]}>
        <WheelPicker
          key={pickerData.wheelPickerKey}
          options={pickerData.optionLabels}
          selectedIndicatorStyle={{ backgroundColor: "#e9e4da" }}
          selectedIndex={pickerData.selectedIndex}
          itemTextStyle={{ fontSize: scale(19) }}
          itemHeight={scale(37)}
          decelerationRate={"fast"}
          onChange={pickerData.onChange}
        />
      </View>
    );
  }

  // iOS
  return (
    <View style={styles.pickerContainer} {...pickerData.containerProps}>
      <Picker
        selectedValue={pickerData.selectedValue}
        itemStyle={styles.defaultPickerItemStyle}
        onValueChange={pickerData.onValueChange}
        enabled={pickerData.items.length > 0}
      >
        {pickerData.items
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
