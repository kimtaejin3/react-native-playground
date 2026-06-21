import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";

export function HistoryButton() {
  const router = useRouter();
  const { iconColor } = useTheme();
  return (
    <Pressable
      hitSlop={8}
      style={{ paddingHorizontal: 4 }}
      onPress={() => router.push("/history")}
    >
      <FontAwesome name="th-list" size={20} color={iconColor} />
    </Pressable>
  );
}
