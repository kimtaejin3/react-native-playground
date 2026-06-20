import { useCallback, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useTheme, type Session } from "../context/ThemeContext";

const fmtTime = (ms: number) => {
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

export function HistorySheet() {
  const { sessions, historyRef } = useTheme();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  );

  // 날짜별 그룹 (sessions는 최신순으로 들어옴)
  const groups = useMemo(() => {
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
  }, [sessions]);

  return (
    <BottomSheetModal
      ref={historyRef}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.sheet}>
        <Text style={styles.title}>집중 기록</Text>
        {groups.length === 0 ? (
          <Text style={styles.empty}>아직 기록이 없어요.</Text>
        ) : (
          groups.map((g) => (
            <View key={g.label} style={styles.group}>
              <View style={styles.groupHead}>
                <Text style={styles.date}>{g.label}</Text>
                <Text style={styles.totalText}>총 {g.total}분</Text>
              </View>
              {g.items.map((s) => (
                <View key={s.id} style={styles.row}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{s.minutes}분</Text>
                  </View>
                  <Text style={styles.activity}>{s.activity}</Text>
                  <Text style={styles.time}>{fmtTime(s.completedAt)}</Text>
                </View>
              ))}
            </View>
          ))
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 36, gap: 18 },
  title: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  empty: { fontSize: 14, color: "#94a3b8", paddingVertical: 8 },
  group: { gap: 10 },
  groupHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: { fontSize: 14, fontWeight: "700", color: "#0f172a" },
  totalText: { fontSize: 13, fontWeight: "600", color: "#94a3b8" },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  badge: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  activity: { flex: 1, fontSize: 15, color: "#0f172a", fontWeight: "600" },
  time: { fontSize: 13, color: "#94a3b8" },
});
