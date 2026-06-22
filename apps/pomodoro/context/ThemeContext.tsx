import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "es-toolkit";
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
  title: string; // 무엇을 했는지 (선택)
  content: string; // 간단한 내용 (선택)
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
  trackColor: string; // 슬라이더 트랙(빈 호) — 배경에 맞춰 조정
  maxMinutes: number;
  setMaxMinutes: (m: number) => void;
  hapticEnabled: boolean; // 마지막 10초 진동 on/off
  setHapticEnabled: (v: boolean) => void;
  keepAwakeEnabled: boolean; // 실행 중 화면 켜둠 on/off
  setKeepAwakeEnabled: (v: boolean) => void;
  sessions: Session[];
  addSession: (s: Omit<Session, "id">) => void;
  updateSession: (id: string, patch: Pick<Session, "title" | "content">) => void;
  colorOpen: boolean; // 색상 플로팅 카드 표시 여부
  openColor: () => void;
  closeColor: () => void;
  settingsRef: RefObject<BottomSheetModal | null>;
  openSettings: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(DEFAULT);
  const [maxMinutes, setMaxMinutes] = useState(60);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [keepAwakeEnabled, setKeepAwakeEnabled] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const idRef = useRef(0);

  const [colorOpen, setColorOpen] = useState(false);
  const settingsRef = useRef<BottomSheetModal>(null);
  const loaded = useRef(false);

  // 폰에서 불러오기 (1회)
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const s = JSON.parse(raw);
          if (s.colors) setColors(s.colors);
          if (s.maxMinutes) setMaxMinutes(s.maxMinutes);
          if (typeof s.hapticEnabled === "boolean")
            setHapticEnabled(s.hapticEnabled);
          if (typeof s.keepAwakeEnabled === "boolean")
            setKeepAwakeEnabled(s.keepAwakeEnabled);
          if (Array.isArray(s.sessions)) {
            // 구버전(activity) → 신버전(title/content) 마이그레이션
            const migrated: Session[] = s.sessions.map(
              (x: Session & { activity?: string }) => ({
                id: x.id,
                minutes: x.minutes,
                title: x.title ?? x.activity ?? "",
                content: x.content ?? "",
                completedAt: x.completedAt,
              }),
            );
            setSessions(migrated);
            idRef.current = migrated.reduce(
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

  // 잦은 변경(색 스와이프·타이핑)이 디스크 쓰기로 연타되지 않게 디바운스
  const persist = useMemo(
    () =>
      debounce((value: string) => {
        AsyncStorage.setItem(STORAGE_KEY, value).catch(() => {});
      }, 400),
    [],
  );
  useEffect(() => () => persist.flush(), [persist]); // 언마운트 시 마지막 값 보장

  // 변경 시 폰에 저장 (불러오기 완료 후부터)
  useEffect(() => {
    if (!loaded.current) return;
    persist(
      JSON.stringify({
        colors,
        maxMinutes,
        hapticEnabled,
        keepAwakeEnabled,
        sessions,
      }),
    );
  }, [colors, maxMinutes, hapticEnabled, keepAwakeEnabled, sessions, persist]);

  const setColor = (key: keyof ThemeColors, value: string) =>
    setColors((c) => ({ ...c, [key]: value }));

  const addSession = (s: Omit<Session, "id">) => {
    idRef.current += 1;
    setSessions((prev) => [{ id: String(idRef.current), ...s }, ...prev]);
  };

  const updateSession = (
    id: string,
    patch: Pick<Session, "title" | "content">,
  ) =>
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );

  const iconColor = isDarkBg(colors.background)
    ? mix(colors.slider, "#ffffff", 0.55)
    : mix(colors.slider, "#0f172a", 0.45);

  const trackColor = isDarkBg(colors.background)
    ? mix(colors.background, "#ffffff", 0.18)
    : "#e2e8f0";

  return (
    <AppContext.Provider
      value={{
        colors,
        setColor,
        iconColor,
        trackColor,
        maxMinutes,
        setMaxMinutes,
        hapticEnabled,
        setHapticEnabled,
        keepAwakeEnabled,
        setKeepAwakeEnabled,
        sessions,
        addSession,
        updateSession,
        colorOpen,
        openColor: () => setColorOpen(true),
        closeColor: () => setColorOpen(false),
        settingsRef,
        openSettings: () => settingsRef.current?.present(),
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
