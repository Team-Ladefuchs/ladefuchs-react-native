import * as Haptics from 'expo-haptics';
import { useAppStore } from '../../state/appState';

export async function triggerHaptic(
  type: Haptics.NotificationFeedbackType | Haptics.ImpactFeedbackStyle,
) {
  const isHapticEnabled = useAppStore.getState().isHapticEnabled;
  
  if (!isHapticEnabled) {
    return;
  }

  if (Object.values(Haptics.NotificationFeedbackType).includes(type as Haptics.NotificationFeedbackType)) {
    await Haptics.notificationAsync(type as Haptics.NotificationFeedbackType);
  } else {
    await Haptics.impactAsync(type as Haptics.ImpactFeedbackStyle);
  }
} 