import { View } from "react-native";
import { Lottie, checkDraw } from "@repo/lottie";
import { CHECK_DRAW_DELAY } from "./todoMotion";

const CHECK_SIZE = 18; // 체크 Lottie 크기(px)

export type CheckboxProps = {
  checked: boolean;
  /** 위치가 바뀐 토글일 때만 안착(슬라이드)을 기다렸다 체크를 그림 */
  delayed: boolean;
};

export function Checkbox({ checked, delayed }: CheckboxProps) {
  return (
    <View
      className={`h-7 w-7 items-center justify-center overflow-hidden rounded-lg border-2 ${
        checked ? "border-[#023ec1] bg-[#111ec8]" : "border-[#cedcea]"
      }`}
    >
      {checked && (
        <Lottie
          source={checkDraw}
          autoPlay
          loop={false}
          delay={delayed ? CHECK_DRAW_DELAY : 0}
          style={{ width: CHECK_SIZE, height: CHECK_SIZE }}
        />
      )}
    </View>
  );
}
