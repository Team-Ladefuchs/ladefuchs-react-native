import { useMemo, useState, useEffect } from "react";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { triggerHaptic } from "../functions/util/haptics";
import type { OperatorItem } from "./useStablePickerIOS";
import { useIOSPickerStabilizer } from "./useStablePickerIOS";
import type { Operator } from "../types/operator";

type UseOperatorPickerReturn = {
  platform: "android" | "ios";
  operatorList: OperatorItem[];
  optionLabels: string[];
} & (
  | {
      platform: "android";
      wheelPickerKey: string;
      selectedIndex: number;
      onChange: (index: number) => void;
    }
  | {
      platform: "ios";
      containerProps: Record<string, unknown>;
      items: OperatorItem[];
      selectedValue: string;
      onValueChange: (value: string) => void;
    }
);

export function useOperatorPicker(
  operators: Operator[] | undefined,
  operatorId: string,
  setOperatorId: (id: string) => void,
): UseOperatorPickerReturn {
  const [operatorIndex, setOperatorIndex] = useState(0);

  // Create operator list with stable references
  const operatorList = useMemo<OperatorItem[]>(() => {
    if (!operators?.length) return [];
    return operators.map((item) => ({ name: item.name, id: item.identifier }));
  }, [operators]);

  // Memoize labels for Android WheelPicker
  const optionLabels = useMemo(() => operatorList.map((item) => item.name), [operatorList]);

  // Create a stable key for Android WheelPicker to force remount when operators change
  const wheelPickerKey = useMemo(() => {
    if (!operatorList.length) return "empty";
    return `${operatorList.length}-${operatorList.map((op) => op.id).join(",")}`;
  }, [operatorList]);

  // Calculate the current selected index based on operatorId
  const currentSelectedIndex = useMemo(() => {
    if (!operators?.length) return 0;
    if (!operatorId) return 0;
    const index = operators.findIndex((op) => op.identifier === operatorId);
    // If the current operatorId is not found (e.g., operator was removed), return 0
    return index !== -1 ? index : 0;
  }, [operators, operatorId]);

  // Sync the local operatorIndex state with the calculated index
  useEffect(() => {
    setOperatorIndex(currentSelectedIndex);
  }, [currentSelectedIndex]);

  // If the current operatorId is not in the list anymore, select the first one
  useEffect(() => {
    if (!operators?.length) return;
    if (!operatorId) {
      // No operator selected, select the first one
      setOperatorId(operators[0].identifier);
      return;
    }
    // Check if current operatorId still exists
    const exists = operators.some((op) => op.identifier === operatorId);
    if (!exists) {
      // Current operator was removed, select the first available one
      setOperatorId(operators[0].identifier);
    }
  }, [operators, operatorId, setOperatorId]);

  // Ensure selected index is always within bounds when options change
  useEffect(() => {
    if (!optionLabels.length) return;
    const maxIndex = optionLabels.length - 1;
    if (operatorIndex > maxIndex) {
      setOperatorIndex(maxIndex);
    } else if (operatorIndex < 0) {
      setOperatorIndex(0);
    }
  }, [optionLabels, operatorIndex]);

  // iOS Picker Stabilizer Hook
  const { containerProps, items, selectedValue, onValueChange } = useIOSPickerStabilizer(
    operatorList,
    operatorId,
    setOperatorId,
  );

  if (Platform.OS === "android") {
    const safeSelectedIndex = Math.min(
      Math.max(currentSelectedIndex, 0),
      Math.max(optionLabels.length - 1, 0),
    );

    const handleChange = (index: number) => {
      if (operators?.[index]) {
        setOperatorId(operators[index].identifier);
        setOperatorIndex(index);
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      }
    };

    return {
      platform: "android",
      operatorList,
      optionLabels,
      wheelPickerKey,
      selectedIndex: safeSelectedIndex,
      onChange: handleChange,
    };
  }

  // iOS
  return {
    platform: "ios",
    operatorList,
    optionLabels,
    containerProps,
    items,
    selectedValue,
    onValueChange,
  };
}

