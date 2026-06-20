import { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ArcSlider } from "../components/ArcSlider";
import { RollingTime } from "../components/RollingTime";
import { FocusCta } from "../components/FocusCta";
import { EndModal } from "../components/EndModal";
import { useTheme } from "../context/ThemeContext";

export default function Pomodoro() {
  const { colors, trackColor, maxMinutes, addSession } = useTheme();
  const MAX_SECONDS = maxMinutes * 60;

  // 기본 25분 (단, 최대 분 이내로 클램프)
  const progress = useSharedValue(Math.min(25, maxMinutes) / maxMinutes);
  const [totalSeconds, setTotalSeconds] = useState(
    Math.min(25, maxMinutes) * 60,
  );
  const [cta, setCta] = useState<{ id: number; minutes: number } | null>(null);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [endModal, setEndModal] = useState<{ minutes: number } | null>(null);
  const ctaId = useRef(0);
  const prevMax = useRef(maxMinutes);

  // progress → 분 단위 시간(초) 반영
  useAnimatedReaction(
    () => Math.round(progress.value * maxMinutes),
    (min, prev) => {
      if (min !== prev) runOnJS(setTotalSeconds)(min * 60);
    },
    [maxMinutes],
  );

  // 최대 분이 바뀌면 현재 설정 분을 새 최대로 클램프
  useEffect(() => {
    const curMin = Math.round(progress.value * prevMax.current);
    const newMin = Math.min(curMin, maxMinutes);
    progress.value = newMin / maxMinutes;
    setTotalSeconds(newMin * 60);
    prevMax.current = maxMinutes;
  }, [maxMinutes, progress]);

  // running이면 카운트다운: 매초 ↓, progress(호) ↓, 마지막 10초 진동, 종료 시 모달
  useEffect(() => {
    if (!running) {
      setRemaining(null);
      return;
    }
    const setSeconds = Math.round(progress.value * maxMinutes) * 60;
    if (setSeconds <= 0) {
      setRunning(false);
      return;
    }
    const endTime = Date.now() + setSeconds * 1000;
    setRemaining(setSeconds);
    const id = setInterval(() => {
      const remMs = endTime - Date.now();
      if (remMs <= 0) {
        progress.value = withTiming(0, { duration: 300 });
        setRemaining(0);
        setRunning(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setEndModal({ minutes: Math.round(setSeconds / 60) });
        return;
      }
      const remSec = Math.ceil(remMs / 1000);
      setRemaining(remSec);
      if (remSec <= 10) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      progress.value = withTiming(remMs / 1000 / MAX_SECONDS, {
        duration: 1000,
        easing: Easing.linear,
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, progress, maxMinutes, MAX_SECONDS]);

  const displaySeconds =
    running && remaining !== null ? remaining : totalSeconds;

  const handleSettle = (minutes: number) => {
    if (minutes <= 0) {
      setCta(null);
      return;
    }
    ctaId.current += 1;
    setCta({ id: ctaId.current, minutes });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.display}>
        <RollingTime totalSeconds={displaySeconds} color={colors.number} />
      </View>
      <View style={styles.slider}>
        <View style={styles.ctaSlot}>
          {cta && (
            <FocusCta
              key={`${cta.id}-${running}`}
              minutes={cta.minutes}
              color={colors.slider}
              running={running}
              onPress={() => setRunning((r) => !r)}
            />
          )}
        </View>
        <ArcSlider
          progress={progress}
          color={colors.slider}
          trackColor={trackColor}
          steps={maxMinutes}
          locked={running}
          onStart={() => setCta(null)}
          onSettle={handleSettle}
        />
      </View>

      <EndModal
        visible={endModal !== null}
        minutes={endModal?.minutes ?? 0}
        color={colors.slider}
        onSave={(activity) => {
          if (endModal) {
            addSession({
              minutes: endModal.minutes,
              activity,
              completedAt: Date.now(),
            });
          }
          setEndModal(null);
        }}
        onClose={() => setEndModal(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  display: { flex: 1, alignItems: "center", paddingTop: 150 },
  slider: { alignItems: "center", paddingBottom: 48 },
  ctaSlot: { height: 24, justifyContent: "center", marginBottom: 20 },
});
