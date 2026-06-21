import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import {
  activateKeepAwakeAsync,
  deactivateKeepAwake,
} from "expo-keep-awake";
import { RollingTime } from "../components/RollingTime";
import { TimerControls } from "../components/TimerControls";
import { EndModal } from "../components/EndModal";
import { overlay } from "../lib/overlay";
import { useMinuteDial } from "../hooks/useMinuteDial";
import { useCountdown } from "../hooks/useCountdown";
import { useTheme } from "../context/ThemeContext";

export default function Pomodoro() {
  const { colors, maxMinutes, addSession, hapticEnabled, keepAwakeEnabled } =
    useTheme();
  const MAX_SECONDS = maxMinutes * 60;

  const progress = useSharedValue(0);

  const { minutes } = useMinuteDial(progress, maxMinutes);

  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const remainingSeconds = useCountdown(
    isTimerRunning,
    () => Math.round(progress.value * maxMinutes) * 60,
    {
      onTick: (sec) => {
        if (hapticEnabled && sec <= 10)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        progress.value = withTiming(sec / MAX_SECONDS, {
          duration: 1000,
          easing: Easing.linear,
        });
      },
      onDone: (durationSec) => {
        progress.value = withTiming(0, { duration: 300 });
        setIsTimerRunning(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const doneMinutes = Math.round(durationSec / 60);
        overlay.open(({ isOpen, close }) => (
          <EndModal
            visible={isOpen}
            minutes={doneMinutes}
            onSave={({ title, content }) => {
              addSession({
                minutes: doneMinutes,
                title,
                content,
                completedAt: Date.now(),
              });
              close();
            }}
            onClose={close}
          />
        ));
      },
      onEmpty: () => setIsTimerRunning(false),
    },
  );

  const displaySeconds = (() => {
    if (isTimerRunning && remainingSeconds !== null) return remainingSeconds;
    return minutes * 60;
  })();

  // 실행 중에만 화면 켜둠 (설정으로 끌 수 있음)
  useEffect(() => {
    if (!(isTimerRunning && keepAwakeEnabled)) return;
    activateKeepAwakeAsync();
    return () => {
      deactivateKeepAwake();
    };
  }, [isTimerRunning, keepAwakeEnabled]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.display}>
        <RollingTime seconds={displaySeconds} />
      </View>
      <TimerControls
        progress={progress}
        running={isTimerRunning}
        onToggle={() => setIsTimerRunning((r) => !r)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  display: { flex: 1, alignItems: "center", paddingTop: 150 },
});
