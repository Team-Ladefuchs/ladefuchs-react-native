import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { Platform, type ViewProps } from "react-native";
import * as Haptics from "expo-haptics";
import { triggerHaptic } from "../functions/util/haptics";

export type OperatorItem = { id: string; name: string };

const THROTTLE_MS = 120;

export function useIOSPickerStabilizer(
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

  const containerProps: Pick<ViewProps, "onStartShouldSetResponderCapture" | "onResponderRelease"> =
    Platform.OS === "ios"
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


