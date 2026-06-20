import { useEffect, useRef, useState } from "react";
import type { SharedValue } from "react-native-reanimated";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";

/**
 * 주어진 다이얼 위치(progress 0~1)에서 보존된 분을 파생한다.
 * - progress: 호/노브 위치 (소유는 호출부 — 카운트다운이 직접 쓰기도 함)
 * - minutes: 현재 설정된 분 (다이얼은 분 단위로만 스냅된다)
 * 최대 분이 바뀌면 설정한 분을 새 범위로 클램프하고 progress를 다시 스케일링한다.
 */
export function useMinuteDial(
  progress: SharedValue<number>,
  maxMinutes: number,
) {
  const [minutes, setMinutes] = useState(0);
  const prevMax = useRef(maxMinutes); // 바뀌기 직전의 최대 분

  // progress → 분(반올림)
  useAnimatedReaction(
    () => Math.round(progress.value * maxMinutes),
    (min, prev) => {
      if (min !== prev) runOnJS(setMinutes)(min);
    },
    [maxMinutes],
  );

  // 최대 분 변경: 옛 max로 현재 분 복원 → 클램프 → 새 max로 progress 재계산
  useEffect(() => {
    const curMin = Math.round(progress.value * prevMax.current);
    const newMin = Math.min(curMin, maxMinutes);
    progress.value = newMin / maxMinutes;
    setMinutes(newMin);
    prevMax.current = maxMinutes;
  }, [maxMinutes, progress]);

  return { minutes };
}
