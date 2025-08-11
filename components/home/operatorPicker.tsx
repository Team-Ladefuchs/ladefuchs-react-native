import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { Picker } from "@react-native-picker/picker";
import { useAppStore } from "../../state/appState";
import { useShallow } from "zustand/react/shallow";
import { colors } from "@theme";
import { Platform, View } from "react-native";
import WheelPicker from "react-native-wheely";
import { ScaledSheet, scale } from "react-native-size-matters";
import * as Haptics from "expo-haptics";
import { triggerHaptic } from "../../functions/util/haptics";

const THROTTLE_MS = 120;

type OperatorItem = { id: string; name: string };

function useIOSPickerStabilizer(
  operatorList: OperatorItem[],
  operatorId: string,
  setOperatorId: (id: string) => void,
) {
  const [iosSelectedId, setIosSelectedId] = useState<string | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [frozenList, setFrozenList] = useState(operatorList);

  useEffect(() => {
    const validId = operatorId && operatorList.some(o => o.id === operatorId)
      ? operatorId
      : operatorList[0]?.id ?? null;
    setIosSelectedId(validId);
  }, [operatorId, operatorList]);

  useEffect(() => {
    if (!isInteracting) setFrozenList(operatorList);
  }, [operatorList, isInteracting]);

  const unfreezeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleUnfreeze = useCallback((delayMs: number = THROTTLE_MS) => {
    if (unfreezeTimerRef.current) clearTimeout(unfreezeTimerRef.current);
    unfreezeTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
      setFrozenList(operatorList);
      unfreezeTimerRef.current = null;
    }, delayMs);
  }, [operatorList]);

  const lastInvokeRef = useRef(0);
  const pendingValueRef = useRef<string | null>(null);
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushPending = useCallback(() => {
    if (pendingValueRef.current == null) return;
    const value = pendingValueRef.current;
    pendingValueRef.current = null;
    lastInvokeRef.current = Date.now();
    setOperatorId(value);
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
  }, [setOperatorId]);

  useEffect(() => {
    return () => {
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
      if (unfreezeTimerRef.current) clearTimeout(unfreezeTimerRef.current);
      throttleTimerRef.current = null;
      unfreezeTimerRef.current = null;
      pendingValueRef.current = null;
    };
  }, []);

  const onValueChange = useCallback((value: string) => {
    if (!value || !operatorList.some(op => op.id === value)) return;
    setIosSelectedId(value);
    const now = Date.now();
    if (now - lastInvokeRef.current >= THROTTLE_MS) {
      lastInvokeRef.current = now;
      setOperatorId(value);
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }
    pendingValueRef.current = value;
    if (!throttleTimerRef.current) {
      const delay = Math.max(0, THROTTLE_MS - (now - lastInvokeRef.current));
      throttleTimerRef.current = setTimeout(() => {
        throttleTimerRef.current = null;
        flushPending();
      }, delay);
    }
  }, [operatorList, setOperatorId, flushPending]);

  const selectedValue = useMemo(() => {
    if (iosSelectedId && frozenList.some(op => op.id === iosSelectedId)) return iosSelectedId;
    if (operatorId && frozenList.some(op => op.id === operatorId)) return operatorId;
    return frozenList[0]?.id || "";
  }, [iosSelectedId, operatorId, frozenList]);

  const containerProps = Platform.OS === "ios"
    ? {
        onStartShouldSetResponderCapture: () => {
          setIsInteracting(true);
          scheduleUnfreeze();
          return false;
        },
        onResponderRelease: () => scheduleUnfreeze(300),
      }
    : {};

  return { containerProps, items: frozenList, selectedValue, onValueChange } as const;
}

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
