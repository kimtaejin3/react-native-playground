import { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useTheme } from "../context/ThemeContext";

const fmtTime = (ms: number) => {
  const d = new Date(ms);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export function HistorySheet() {
  const { sessions, historyRef } = useTheme();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={historyRef}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.sheet}>
        <Text style={styles.title}>집중 기록</Text>
        {sessions.length === 0 ? (
          <Text style={styles.empty}>아직 기록이 없어요.</Text>
        ) : (
          sessions.map((s) => (
            <View key={s.id} style={styles.row}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{s.minutes}분</Text>
              </View>
              <Text style={styles.activity}>{s.activity}</Text>
              <Text style={styles.time}>{fmtTime(s.completedAt)}</Text>
            </View>
          ))
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 36, gap: 12 },
  title: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  empty: { fontSize: 14, color: "#94a3b8", paddingVertical: 8 },
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
