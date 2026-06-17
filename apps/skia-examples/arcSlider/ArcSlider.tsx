import { useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Canvas,
  Path,
  Circle,
  Image,
  useImage,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const SIZE = 350;
const STROKE = 20;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = SIZE / 2 - STROKE; // 스트로크 두께만큼 안쪽 반지름
const START = 180; // 시작 각도(도) — 3시 방향이 0°, 시계방향 +
const SWEEP = 180; // 호의 총 각도 (아래쪽 90°가 열린 게이지)
const IMG = 84; // 중앙 이미지 크기

export function ArcSlider() {
  const progress = useSharedValue(0.3); // 0~1
  const [value, setValue] = useState(30);

  // 중앙 이미지 (arcSlider/ghost.png)
  const image = useImage(require("./ghost.png"));

  // 이미지를 progress에 연결: 드래그하면 회전
  const imageTransform = useDerivedValue(() => [
    { rotate: progress.value * Math.PI * 2 },
  ]);

  // 전체 호 path (정적): 트랙과 진행도가 공유
  const arc = useMemo(() => {
    const p = Skia.Path.Make();
    p.addArc(Skia.XYWHRect(CX - R, CY - R, 2 * R, 2 * R), START, SWEEP);
    return p;
  }, []);

  // 노브 위치: progress → 각도 → 좌표
  const knob = useDerivedValue(() => {
    const ang = ((START + progress.value * SWEEP) * Math.PI) / 180;
    return vec(CX + R * Math.cos(ang), CY + R * Math.sin(ang));
  });

  // progress → 0~100 값 텍스트 (JS 스레드로 반영)
  useAnimatedReaction(
    () => Math.round(progress.value * 100),
    (v, prev) => {
      if (v === prev) return;
      runOnJS(setValue)(v);
      // 양 끝(0 이하 / 100 이상)에선 틱 안 울림 — 그 사이에서만
      if (v > 0 && v < 100) runOnJS(Haptics.selectionAsync)();
    },
  );

  const pan = Gesture.Pan()
    .onBegin((e) => {
      "worklet";
      const angle = (Math.atan2(e.y - CY, e.x - CX) * 180) / Math.PI;
      let rel = (angle - START + 360) % 360;
      if (rel > SWEEP) rel = rel < SWEEP + (360 - SWEEP) / 2 ? SWEEP : 0;
      progress.value = rel / SWEEP;
    })
    .onChange((e) => {
      "worklet";
      const angle = (Math.atan2(e.y - CY, e.x - CX) * 180) / Math.PI;
      let rel = (angle - START + 360) % 360;
      if (rel > SWEEP) rel = rel < SWEEP + (360 - SWEEP) / 2 ? SWEEP : 0;
      progress.value = rel / SWEEP;
    });

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Canvas style={{ width: SIZE, height: SIZE }}>
        {image && (
          <Image
            image={image}
            x={CX - IMG / 2}
            y={CY - IMG / 2}
            width={IMG}
            height={IMG}
            fit="contain"
            origin={vec(CX, CY)}
            transform={imageTransform}
          />
        )}
      </Canvas>

      <View>
        <GestureDetector gesture={pan}>
          {/* 정사각형이 아니라 호가 차지하는 높이만 → 아래 빈 공간 제거 */}
          <Canvas style={{ width: SIZE, height: CY + STROKE }}>
            <Path
              path={arc}
              style="stroke"
              strokeWidth={STROKE}
              strokeCap="round"
              color="#e2e8f0"
            />
            <Path
              path={arc}
              style="stroke"
              strokeWidth={STROKE}
              strokeCap="round"
              color="#2563eb"
              start={0}
              end={progress}
            />
            <Circle c={knob} r={STROKE / 2 + 2} color="#2563eb" />
          </Canvas>
        </GestureDetector>
        <View style={styles.labels}>
          <Text style={styles.edge}>0</Text>
          <Text style={styles.edge}>30m</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end", // 채운 높이 안에서 내용을 바닥으로
    gap: 8,
    paddingBottom: 40, // 바닥 여백 (홈 인디케이터 피하려면 safe-area 사용)
  },
  value: { fontSize: 40, fontWeight: "800", color: "#0f172a" },
  hint: { fontSize: 14, color: "#64748b" },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 2 * R + 10, // 호 폭(반지름×2)에 맞춤 → 양 끝(CX±R)과 정렬
    alignSelf: "center", // SIZE 폭 안에서 가운데 → 좌우 STROKE만큼 안쪽
  },
  edge: { fontSize: 14, fontWeight: "600", color: "#94a3b8" },
});
