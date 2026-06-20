import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export function HistoryButton() {
  const { openHistory, iconColor } = useTheme();
  return (
    <Pressable
      hitSlop={8}
      style={{ paddingHorizontal: 4 }}
      onPress={openHistory}
    >
      <MaterialIcons name="format-list-bulleted" size={24} color={iconColor} />
    </Pressable>
  );
}
