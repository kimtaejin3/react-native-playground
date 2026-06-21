import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { SessionFields } from "./SessionFields";

export type SessionEditModalProps = {
  visible: boolean;
  initialTitle: string;
  initialContent: string;
  onSave: (record: { title: string; content: string }) => void;
  onClose: () => void;
};

// 히스토리에서 기존 기록을 수정하는 모달 (overlay로 띄움)
export function SessionEditModal({
  visible,
  initialTitle,
  initialContent,
  onSave,
  onClose,
}: SessionEditModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  // 열릴 때마다 대상 기록 값으로 초기화
  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setContent(initialContent);
    }
  }, [visible, initialTitle, initialContent]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>기록 수정</Text>

          <SessionFields
            title={title}
            content={content}
            onChangeTitle={setTitle}
            onChangeContent={setContent}
          />

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={[styles.btn, styles.cancel]}>
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                onSave({ title: title.trim(), content: content.trim() })
              }
              style={[styles.btn, styles.save]}
            >
              <Text style={styles.saveText}>저장</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
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
    gap: 12,
  },
  title: { fontSize: 20, fontWeight: "800", color: "#0f172a" },
  actions: { flexDirection: "row", gap: 10, marginTop: 4 },
  btn: { flex: 1, alignItems: "center", paddingVertical: 14, borderRadius: 14 },
  cancel: { backgroundColor: "#f1f5f9" },
  cancelText: { color: "#475569", fontSize: 16, fontWeight: "700" },
  save: { backgroundColor: "#0f172a" },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
