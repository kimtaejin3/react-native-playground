import { Text, View, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export type TodoHeaderProps = {
  title?: string;
  onPressNotifications?: () => void;
  onPressSettings?: () => void;
};

export function TodoHeader({
  title = "My Tasks",
  onPressNotifications,
  onPressSettings,
}: TodoHeaderProps) {
  return (
    <View className="mb-1 flex-row items-center justify-between py-1">
      <Text className="text-2xl font-bold text-[#0f172a]">{title}</Text>
      <View className="flex-row items-center gap-2">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] bg-white"
          onPress={onPressNotifications}
        >
          <MaterialIcons name="notifications-none" size={22} color="#334155" />
          <View className="absolute right-[9px] top-[9px] h-2 w-2 rounded-full border border-white bg-[#ef4444]" />
        </Pressable>
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] bg-white"
          onPress={onPressSettings}
        >
          <MaterialIcons name="settings" size={22} color="#334155" />
        </Pressable>
      </View>
    </View>
  );
}
