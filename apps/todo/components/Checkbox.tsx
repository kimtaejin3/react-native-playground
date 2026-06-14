import { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { Lottie, checkDraw } from "@repo/lottie";
import { CHECK_DRAW_DELAY } from "./todoMotion";

const CHECK_SIZE = 18; // 체크 크기(px)

// check-draw.json과 동일한 기하: 80x80 캔버스, 흰 선 두께 11, 라운드 캡
// 꼭짓점 (18,42) → (34,60) → (66,22) → Lottie 마지막 프레임과 픽셀 동일
function StaticCheck() {
  return (
    <Svg width={CHECK_SIZE} height={CHECK_SIZE} viewBox="0 0 80 80">
      <Polyline
        points="18,42 34,60 66,22"
        fill="none"
        stroke="#fff"
        strokeWidth={11}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// idle: 미완료 / waiting: 슬라이드 대기 / playing: 그리는 중 / done: 정적 체크
type Phase = "idle" | "waiting" | "playing" | "done";

export type CheckboxProps = {
  checked: boolean;
  /** 위치가 바뀐 토글일 때만 안착(슬라이드)을 기다렸다 체크를 그림 */
  delayed: boolean;
};

export function Checkbox({ checked, delayed }: CheckboxProps) {
  const [phase, setPhase] = useState<Phase>(checked ? "playing" : "idle");

  useEffect(() => {
    if (!checked) {
      setPhase("idle");
      return;
    }
    if (!delayed) {
      setPhase("playing");
      return;
    }
    // 이동한 경우: 슬라이드가 끝날 때까지 기다렸다가 그리기 시작
    setPhase("waiting");
    const id = setTimeout(() => setPhase("playing"), CHECK_DRAW_DELAY);
    return () => clearTimeout(id);
  }, [checked, delayed]);

  return (
    <View
      className={`h-7 w-7 items-center justify-center overflow-hidden rounded-lg border-2 ${
        checked ? "border-[#023ec1] bg-[#111ec8]" : "border-[#cedcea]"
      }`}
    >
      {phase === "done" && <StaticCheck />}
      {phase === "playing" && (
        <Lottie
          source={checkDraw}
          autoPlay
          loop={false}
          onAnimationFinish={() => setPhase("done")}
          style={{ width: CHECK_SIZE, height: CHECK_SIZE }}
        />
      )}
    </View>
  );
}
