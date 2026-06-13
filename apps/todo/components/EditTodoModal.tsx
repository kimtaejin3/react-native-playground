import { useState } from "react";
import { Text, View, TextInput, Pressable, Modal } from "react-native";
import { Button, Card } from "@repo/ui";

export type EditTodoModalProps = {
  visible: boolean;
  initialText: string;
  initialDesc: string;
  onSave: (text: string, desc: string) => void;
  onClose: () => void;
};

export function EditTodoModal({
  visible,
  initialText,
  initialDesc,
  onSave,
  onClose,
}: EditTodoModalProps) {
  // 지역 상태: 부모가 key로 재마운트시켜주므로 초기값으로 충분
  const [text, setText] = useState(initialText);
  const [desc, setDesc] = useState(initialDesc);

  const save = () => {
    if (!text.trim()) return;
    onSave(text, desc);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/45 p-6">
        <Card className="w-full max-w-[360px] gap-3">
          <Text className="text-lg font-bold text-[#0f172a]">할 일 수정</Text>
          <View className="overflow-hidden rounded-[10px] border border-[#e2e8f0]">
            <TextInput
              className="h-12 bg-white px-[14px] text-base"
              placeholder="할 일"
              placeholderTextColor="#94a3b8"
              value={text}
              onChangeText={setText}
              returnKeyType="next"
            />
            <TextInput
              className="h-12 border-t border-[#e2e8f0] bg-white px-[14px] text-base"
              placeholder="설명 (선택)"
              placeholderTextColor="#94a3b8"
              value={desc}
              onChangeText={setDesc}
              onSubmitEditing={save}
              returnKeyType="done"
            />
          </View>
          <View className="mt-1 flex-row items-center justify-end gap-2">
            <Pressable className="px-4 py-3" onPress={onClose}>
              <Text className="text-base font-semibold text-[#64748b]">
                취소
              </Text>
            </Pressable>
            <Button title="저장" onPress={save} />
          </View>
        </Card>
      </View>
    </Modal>
  );
}
