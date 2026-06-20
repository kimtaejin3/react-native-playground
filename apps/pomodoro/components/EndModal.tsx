import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const ACTIVITIES = ["공부", "독서", "코딩", "운동", "글쓰기", "휴식", "기타"];

const fmt = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(
    2,
    "0",
  )}`;

export type EndModalProps = {
  visible: boolean;
  minutes: number;
  onSave: (activity: string) => void;
  onClose: () => void;
};

export function EndModal({ visible, minutes, onSave, onClose }: EndModalProps) {
  const color = useTheme().colors.slider; // 선택한 색
  // 타이머 종료 후 경과 시간 (인지 못한 시간 알려주기용)
  const [overtime, setOvertime] = useState(0);
  const [activity, setActivity] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setOvertime(0);
      setActivity(null);
      return;
    }
    const start = Date.now();
    const id = setInterval(
      () => setOvertime(Math.floor((Date.now() - start) / 1000)),
      1000,
    );
    return () => clearInterval(id);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{minutes}분 집중 완료!</Text>

          <Text style={styles.label}>종료 후 경과</Text>
          <Text style={[styles.overtime, { color }]}>{fmt(overtime)}</Text>

          <Text style={styles.label}>무엇을 했나요? (선택)</Text>
          <View style={styles.chips}>
            {ACTIVITIES.map((a) => {
              const sel = activity === a;
              return (
                <Pressable
                  key={a}
                  onPress={() => setActivity(a)}
                  style={[styles.chip, sel && styles.chipSel]}
                >
                  <Text style={[styles.chipText, sel && styles.chipTextSel]}>
                    {a}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={() => (activity ? onSave(activity) : onClose())}
            style={styles.save}
          >
            <Text style={styles.saveText}>{activity ? "저장" : "닫기"}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    gap: 10,
  },
  title: { fontSize: 20, fontWeight: "800", color: "#0f172a" },
  label: { fontSize: 13, color: "#64748b", marginTop: 6 },
  overtime: { fontSize: 36, fontWeight: "800", color: "#2563eb" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  chipSel: { borderColor: "#0f172a", backgroundColor: "#0f172a" },
  chipText: { fontSize: 14, fontWeight: "600", color: "#334155" },
  chipTextSel: { color: "#fff" },
  save: {
    marginTop: 14,
    alignItems: "center",
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    borderRadius: 14,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
