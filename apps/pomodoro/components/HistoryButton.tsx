import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export function HistoryButton() {
  const { openHistory, iconColor } = useTheme();
  return (
    <Pressable
      hitSlop={8}
      style={{ paddingHorizontal: 4 }}
      onPress={openHistory}
    >
      <FontAwesome name="th-list" size={20} color={iconColor} />
    </Pressable>
  );
}
