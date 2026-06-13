import { forwardRef, useImperativeHandle, useRef } from "react";
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
  style?: ViewStyle;
  onAnimationFinish?: (isCancelled: boolean) => void;
};

export const Lottie = forwardRef<LottieHandle, LottieProps>(function Lottie(
  { source, autoPlay = false, loop = false, speed = 1, style, onAnimationFinish },
  ref,
) {
  const inner = useRef<LottieView>(null);

  useImperativeHandle(ref, () => ({
    play: () => inner.current?.play(),
    pause: () => inner.current?.pause(),
    reset: () => inner.current?.reset(),
  }));

  return (
    <LottieView
      ref={inner}
      source={source}
      autoPlay={autoPlay}
      loop={loop}
      speed={speed}
      style={style}
      onAnimationFinish={onAnimationFinish}
    />
  );
});
