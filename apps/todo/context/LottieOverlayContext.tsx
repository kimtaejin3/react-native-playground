import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { View } from "react-native";
import { Lottie, type LottieProps } from "@repo/lottie";

type LottieSource = LottieProps["source"];

type Overlay = {
  source: LottieSource;
  size: number;
  // 같은 source로 다시 호출해도 재생되도록 강제 remount용 키
  key: number;
};

type LottieOverlayValue = {
  /** 화면 정중앙에 Lottie를 한 번 재생 */
  play: (source: LottieSource, opts?: { size?: number }) => void;
};

const LottieOverlayContext = createContext<LottieOverlayValue | null>(null);

export function LottieOverlayProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const counter = useRef(0);

  const play = useCallback((source: LottieSource, opts?: { size?: number }) => {
    counter.current += 1;
    setOverlay({ source, size: opts?.size ?? 200, key: counter.current });
  }, []);

  return (
    <LottieOverlayContext.Provider value={{ play }}>
      {children}
      {overlay && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.7)",
          }}
        >
          <Lottie
            key={overlay.key}
            source={overlay.source}
            autoPlay
            loop={false}
            onAnimationFinish={() => setOverlay(null)}
            style={{ width: overlay.size, height: overlay.size }}
          />
        </View>
      )}
    </LottieOverlayContext.Provider>
  );
}

export function useLottieOverlay() {
  const ctx = useContext(LottieOverlayContext);
  if (!ctx) {
    throw new Error(
      "useLottieOverlay must be used within a LottieOverlayProvider",
    );
  }
  return ctx;
}
