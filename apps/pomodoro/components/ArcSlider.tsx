import { useMemo } from "react";
import { Canvas, Path, Circle, Skia, vec } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  type SharedValue,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTheme } from "../context/ThemeContext";

const SIZE = 350;
const STROKE = 25;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = SIZE / 2 - STROKE;
const START = 180; // 9시 방향
const SWEEP = 180; // 위쪽 반원

export type ArcSliderProps = {
  progress: SharedValue<number>; // 0~1 (외부에서 소유)
  steps: number; // 분 단위 스냅 칸 수 (= 최대 분)
  locked?: boolean; // true면 터치 잠금 + 노브 숨김
  onStart?: () => void; // 드래그 시작
  onSettle?: (minutes: number) => void; // 드래그 끝 (분)
};

export function ArcSlider({
  progress,
  steps,
  locked = false,
  onStart,
  onSettle,
}: ArcSliderProps) {
  const { colors, trackColor } = useTheme();
  const color = colors.slider;
  const arc = useMemo(() => {
    const p = Skia.Path.Make();
    p.addArc(Skia.XYWHRect(CX - R, CY - R, 2 * R, 2 * R), START, SWEEP);
    return p;
  }, []);

  const knob = useDerivedValue(() => {
    const ang = ((START + progress.value * SWEEP) * Math.PI) / 180;
    return vec(CX + R * Math.cos(ang), CY + R * Math.sin(ang));
  });

  // 분 단위(0~60)로 틱 — 끝(0/60) 제외
  useAnimatedReaction(
    () => Math.round(progress.value * steps),
    (m, prev) => {
      if (m === prev) return;
      if (m > 0 && m < steps) runOnJS(Haptics.selectionAsync)();
    },
  );

  // 터치 각도 → 1/STEPS(=1분) 단위로 스냅
  const snap = (e: { x: number; y: number }) => {
    "worklet";
    const angle = (Math.atan2(e.y - CY, e.x - CX) * 180) / Math.PI;
    let rel = (angle - START + 360) % 360;
    if (rel > SWEEP) rel = rel < SWEEP + (360 - SWEEP) / 2 ? SWEEP : 0;
    progress.value = Math.round((rel / SWEEP) * steps) / steps;
  };

  const settle = () => {
    "worklet";
    if (onSettle) runOnJS(onSettle)(Math.round(progress.value * steps));
  };

  // 드래그
  const pan = Gesture.Pan()
    .onBegin((e) => {
      "worklet";
      snap(e);
      if (onStart) runOnJS(onStart)();
    })
    .onChange(snap)
    .onEnd(settle)
    .enabled(!locked);

  // 탭(움직임 없이 터치)도 값 변경 + 문구 표시
  const tap = Gesture.Tap()
    .onBegin(() => {
      "worklet";
      if (onStart) runOnJS(onStart)();
    })
    .onEnd((e) => {
      "worklet";
      snap(e);
      settle();
    })
    .enabled(!locked);

  const gesture = Gesture.Race(pan, tap);

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{ width: SIZE, height: CY + STROKE }}>
        <Path
          path={arc}
          style="stroke"
          strokeWidth={STROKE}
          strokeCap="round"
          color={trackColor}
        />
        <Path
          path={arc}
          style="stroke"
          strokeWidth={STROKE}
          strokeCap="round"
          color={color}
          start={0}
          end={progress}
        />
        {!locked && <Circle c={knob} r={STROKE / 2 + 2} color={color} />}
      </Canvas>
    </GestureDetector>
  );
}
