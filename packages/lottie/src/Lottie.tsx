import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import LottieView, { type AnimationObject } from "lottie-react-native";
import type { ViewStyle } from "react-native";

export type LottieHandle = {
  play: () => void;
  pause: () => void;
  reset: () => void;
};

export type LottieProps = {
  source: AnimationObject | { uri: string };
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  /** autoPlay 시작을 지연시킬 시간(ms). LottieView 자체에는 없어 타이머로 구현 */
  delay?: number;
  style?: ViewStyle;
  onAnimationFinish?: (isCancelled: boolean) => void;
};

export const Lottie = forwardRef<LottieHandle, LottieProps>(function Lottie(
  {
    source,
    autoPlay = false,
    loop = false,
    speed = 1,
    delay = 0,
    style,
    onAnimationFinish,
  },
  ref,
) {
  const inner = useRef<LottieView>(null);

  useImperativeHandle(ref, () => ({
    play: () => inner.current?.play(),
    pause: () => inner.current?.pause(),
    reset: () => inner.current?.reset(),
  }));

  // delay가 있으면 LottieView의 autoPlay 대신 타이머로 play() 호출
  useEffect(() => {
    if (!autoPlay || delay <= 0) return;
    const id = setTimeout(() => inner.current?.play(), delay);
    return () => clearTimeout(id);
  }, [autoPlay, delay]);

  return (
    <LottieView
      ref={inner}
      source={source}
      autoPlay={autoPlay && delay <= 0}
      loop={loop}
      speed={speed}
      style={style}
      onAnimationFinish={onAnimationFinish}
    />
  );
});
