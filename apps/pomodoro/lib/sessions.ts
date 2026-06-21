import type { Session } from "../context/ThemeContext";

export const fmtTime = (ms: number) => {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
};

const dayKey = (ms: number) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const dayLabel = (ms: number) => {
  const d = new Date(ms);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const that = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((today.getTime() - that.getTime()) / 86400000);
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
};

export type DayGroup = {
  label: string;
  total: number; // 그날 총 집중 분
  items: Session[];
};

// 날짜별 그룹 (sessions는 최신순으로 들어온다고 가정)
export function groupByDay(sessions: Session[]): DayGroup[] {
  const map = new Map<string, Session[]>();
  for (const s of sessions) {
    const k = dayKey(s.completedAt);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(s);
  }
  return Array.from(map.values()).map((items) => ({
    label: dayLabel(items[0].completedAt),
    total: items.reduce((sum, x) => sum + x.minutes, 0),
    items,
  }));
}
