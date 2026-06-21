import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { SessionFields } from "./SessionFields";

const fmt = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(
    2,
    "0",
  )}`;

export type EndModalProps = {
  visible: boolean;
  minutes: number;
  onSave: (record: { title: string; content: string }) => void;
  onClose: () => void;
};

export function EndModal({ visible, minutes, onSave, onClose }: EndModalProps) {
  const color = useTheme().colors.slider; // 선택한 색
  // 타이머 종료 후 경과 시간 (인지 못한 시간 알려주기용)
  const [overtime, setOvertime] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!visible) {
      setOvertime(0);
      setTitle("");
      setContent("");
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

          <SessionFields
            title={title}
            content={content}
            onChangeTitle={setTitle}
            onChangeContent={setContent}
          />

          <Pressable
            onPress={() => onSave({ title: title.trim(), content: content.trim() })}
            style={styles.save}
          >
            <Text style={styles.saveText}>저장</Text>
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
  save: {
    marginTop: 14,
    alignItems: "center",
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    borderRadius: 14,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
