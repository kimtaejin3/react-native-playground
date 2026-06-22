import { useMemo } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { groupBy } from "es-toolkit";
import { useTheme } from "../context/ThemeContext";
import { fmtTime, dayKey, dayLabel } from "../lib/sessions";
import { overlay } from "../lib/overlay";
import { SessionEditModal } from "../components/SessionEditModal";

export default function History() {
  const { sessions, updateSession } = useTheme();

  // 날짜별로 묶어 보여줄 그룹 (라벨·합계는 화면 표시용)
  const groups = useMemo(() => {
    const byDay = groupBy(sessions, (s) => dayKey(s.completedAt));
    return Object.values(byDay).map((items) => ({
      label: dayLabel(items[0].completedAt),
      total: items.reduce((sum, x) => sum + x.minutes, 0),
      items,
    }));
  }, [sessions]);

  const openEdit = (id: string, title: string, content: string) => {
    overlay.open(({ isOpen, close }) => (
      <SessionEditModal
        visible={isOpen}
        initialTitle={title}
        initialContent={content}
        onSave={(record) => {
          updateSession(id, record);
          close();
        }}
        onClose={close}
      />
    ));
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
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
              <Pressable
                key={s.id}
                style={styles.row}
                onPress={() => openEdit(s.id, s.title, s.content)}
              >
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{s.minutes}분</Text>
                </View>
                <View style={styles.rowBody}>
                  <Text
                    style={[styles.rowTitle, !s.title && styles.placeholder]}
                    numberOfLines={1}
                  >
                    {s.title || "(제목 없음)"}
                  </Text>
                  {!!s.content && (
                    <Text style={styles.rowContent} numberOfLines={1}>
                      {s.content}
                    </Text>
                  )}
                </View>
                <Text style={styles.time}>{fmtTime(s.completedAt)}</Text>
              </Pressable>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, gap: 20 },
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
  rowBody: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 15, color: "#0f172a", fontWeight: "600" },
  placeholder: { color: "#94a3b8", fontWeight: "400" },
  rowContent: { fontSize: 13, color: "#64748b" },
  time: { fontSize: 13, color: "#94a3b8" },
});
