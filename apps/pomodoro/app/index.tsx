import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { RollingTime } from "../components/RollingTime";
import { TimerControls } from "../components/TimerControls";
import { EndModal } from "../components/EndModal";
import { overlay } from "../lib/overlay";
import { useMinuteDial } from "../hooks/useMinuteDial";
import { useCountdown } from "../hooks/useCountdown";
import { useTheme } from "../context/ThemeContext";

export default function Pomodoro() {
  const { colors, maxMinutes, addSession } = useTheme();
  const MAX_SECONDS = maxMinutes * 60;

  const progress = useSharedValue(0);

  const { minutes } = useMinuteDial(progress, maxMinutes);

  const [running, setRunning] = useState(false);

  const remainingSeconds = useCountdown(
    running,
    () => Math.round(progress.value * maxMinutes) * 60,
    {
      onTick: (sec) => {
        if (sec <= 10) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        progress.value = withTiming(sec / MAX_SECONDS, {
          duration: 1000,
          easing: Easing.linear,
        });
      },
      onDone: (durationSec) => {
        progress.value = withTiming(0, { duration: 300 });
        setRunning(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const doneMinutes = Math.round(durationSec / 60);
        overlay.open(({ isOpen, close }) => (
          <EndModal
            visible={isOpen}
            minutes={doneMinutes}
            onSave={(activity) => {
              addSession({
                minutes: doneMinutes,
                activity,
                completedAt: Date.now(),
              });
              close();
            }}
            onClose={close}
          />
        ));
      },
      onEmpty: () => setRunning(false),
    },
  );

  const displaySeconds = (() => {
    if (running && remainingSeconds !== null) return remainingSeconds;
    return minutes * 60;
  })();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.display}>
        <RollingTime seconds={displaySeconds} />
      </View>
      <TimerControls
        progress={progress}
        running={running}
        onToggle={() => setRunning((r) => !r)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  display: { flex: 1, alignItems: "center", paddingTop: 150 },
});
