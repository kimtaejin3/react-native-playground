import { Text, View, Pressable, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card } from "@repo/ui";

export type TodoActionSheetProps = {
  visible: boolean;
  title?: string;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export function TodoActionSheet({
  visible,
  title,
  onEdit,
  onDelete,
  onClose,
}: TodoActionSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-end bg-black/45 p-4"
        onPress={onClose}
      >
        <View className="gap-2">
          <Card className="gap-1 p-2">
            <Text
              className="px-3 pb-1 pt-2 text-xs text-[#94a3b8]"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Pressable
              className="flex-row items-center gap-3 rounded-lg px-3 py-3 active:bg-[#f1f5f9]"
              onPress={onEdit}
            >
              <MaterialIcons name="edit" size={20} color="#334155" />
              <Text className="text-base text-[#0f172a]">수정</Text>
            </Pressable>
            <Pressable
              className="flex-row items-center gap-3 rounded-lg px-3 py-3 active:bg-[#fef2f2]"
              onPress={onDelete}
            >
              <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
              <Text className="text-base text-[#ef4444]">삭제</Text>
            </Pressable>
          </Card>
          <Card className="p-0">
            <Pressable className="items-center px-3 py-3" onPress={onClose}>
              <Text className="text-base font-semibold text-[#64748b]">
                취소
              </Text>
            </Pressable>
          </Card>
        </View>
      </Pressable>
    </Modal>
  );
}
