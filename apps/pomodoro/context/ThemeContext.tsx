import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

const STORAGE_KEY = "pomodoro:v1";

export type ThemeColors = {
  number: string;
  slider: string;
  background: string;
};

export type Session = {
  id: string;
  minutes: number; // 집중 길이(분)
  activity: string; // 무엇을 했는지
  completedAt: number; // 완료 시각(ms)
};

const DEFAULT: ThemeColors = {
  number: "#0f172a",
  slider: "#0f172a", // 처음엔 숫자·슬라이더 모두 검은색
  background: "#f1f5f9",
};

const toRgb = (hex: string) => {
  const c = hex.replace("#", "");
  return {
    r: parseInt(c.slice(0, 2), 16),
    g: parseInt(c.slice(2, 4), 16),
    b: parseInt(c.slice(4, 6), 16),
  };
};

function isDarkBg(hex: string) {
  if (hex.replace("#", "").length < 6) return false;
  const { r, g, b } = toRgb(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
}

function mix(a: string, b: string, t: number) {
  const ca = toRgb(a);
  const cb = toRgb(b);
  const ch = (x: number, y: number) =>
    Math.round(x + (y - x) * t)
      .toString(16)
      .padStart(2, "0");
  return `#${ch(ca.r, cb.r)}${ch(ca.g, cb.g)}${ch(ca.b, cb.b)}`;
}

type AppContextValue = {
  colors: ThemeColors;
  setColor: (key: keyof ThemeColors, value: string) => void;
  iconColor: string;
  maxMinutes: number;
  setMaxMinutes: (m: number) => void;
  sessions: Session[];
  addSession: (s: Omit<Session, "id">) => void;
  colorRef: RefObject<BottomSheetModal | null>;
  settingsRef: RefObject<BottomSheetModal | null>;
  historyRef: RefObject<BottomSheetModal | null>;
  openColor: () => void;
  openSettings: () => void;
  openHistory: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(DEFAULT);
  const [maxMinutes, setMaxMinutes] = useState(60);
  const [sessions, setSessions] = useState<Session[]>([]);
  const idRef = useRef(0);

  const colorRef = useRef<BottomSheetModal>(null);
  const settingsRef = useRef<BottomSheetModal>(null);
  const historyRef = useRef<BottomSheetModal>(null);
  const loaded = useRef(false);

  // 폰에서 불러오기 (1회)
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const s = JSON.parse(raw);
          if (s.colors) setColors(s.colors);
          if (s.maxMinutes) setMaxMinutes(s.maxMinutes);
          if (Array.isArray(s.sessions)) {
            setSessions(s.sessions);
            idRef.current = s.sessions.reduce(
              (m: number, x: Session) => Math.max(m, Number(x.id) || 0),
              0,
            );
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
      });
  }, []);

  // 변경 시 폰에 저장 (불러오기 완료 후부터)
  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ colors, maxMinutes, sessions }),
    ).catch(() => {});
  }, [colors, maxMinutes, sessions]);

  const setColor = (key: keyof ThemeColors, value: string) =>
    setColors((c) => ({ ...c, [key]: value }));

  const addSession = (s: Omit<Session, "id">) => {
    idRef.current += 1;
    setSessions((prev) => [{ id: String(idRef.current), ...s }, ...prev]);
  };

  const iconColor = isDarkBg(colors.background)
    ? mix(colors.slider, "#ffffff", 0.55)
    : mix(colors.slider, "#0f172a", 0.45);

  return (
    <AppContext.Provider
      value={{
        colors,
        setColor,
        iconColor,
        maxMinutes,
        setMaxMinutes,
        sessions,
        addSession,
        colorRef,
        settingsRef,
        historyRef,
        openColor: () => colorRef.current?.present(),
        openSettings: () => settingsRef.current?.present(),
        openHistory: () => historyRef.current?.present(),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
