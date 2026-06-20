import { useState } from "react";
import { View, StyleSheet } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import { ArcSlider } from "./ArcSlider";
import { FocusCta } from "./FocusCta";
import { useTheme } from "../context/ThemeContext";

export type TimerControlsProps = {
  progress: SharedValue<number>; // 다이얼 값 0~1 (위층 useMinuteDial 소유)
  running: boolean; // 잠금/라벨용
  onToggle: () => void; // 시작·종료 토글
};

/**
 * 설정 단계의 입력 묶음: 슬라이더로 분을 고르고, 정착하면 시작 버튼이 뜬다.
 * 진행 중에는 다이얼이 잠기고 버튼이 "종료하기"로 바뀐다(라벨은 FocusCta가 처리).
 */
export function TimerControls({
  progress,
  running,
  onToggle,
}: TimerControlsProps) {
  const { maxMinutes } = useTheme();
  const [cta, setCta] = useState<{ minutes: number } | null>(null);

  const handleSettle = (minutes: number) => {
    if (minutes <= 0) {
      setCta(null);
      return;
    }
    setCta({ minutes });
  };

  return (
    <View style={styles.container}>
      <View style={styles.ctaSlot}>
        {cta && (
          <FocusCta minutes={cta.minutes} running={running} onPress={onToggle} />
        )}
      </View>
      <ArcSlider
        progress={progress}
        steps={maxMinutes}
        locked={running}
        onStart={() => setCta(null)}
        onSettle={handleSettle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingBottom: 48 },
  ctaSlot: { height: 24, justifyContent: "center", marginBottom: 20 },
});
