import { View, Text, TextInput, StyleSheet } from "react-native";

export type SessionFieldsProps = {
  title: string;
  content: string;
  onChangeTitle: (v: string) => void;
  onChangeContent: (v: string) => void;
};

// 집중 기록 입력 필드 (제목 1줄 + 내용 여러 줄, 둘 다 선택)
export function SessionFields({
  title,
  content,
  onChangeTitle,
  onChangeContent,
}: SessionFieldsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>제목 (선택)</Text>
        <TextInput
          value={title}
          onChangeText={onChangeTitle}
          placeholder="무엇을 했나요?"
          placeholderTextColor="#94a3b8"
          style={styles.input}
          maxLength={50}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>내용 (선택)</Text>
        <TextInput
          value={content}
          onChangeText={onChangeContent}
          placeholder="간단히 적어두기"
          placeholderTextColor="#94a3b8"
          style={[styles.input, styles.multiline]}
          multiline
          maxLength={300}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  field: { gap: 6 },
  label: { fontSize: 13, color: "#64748b" },
  input: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  multiline: { minHeight: 88, textAlignVertical: "top" },
});
