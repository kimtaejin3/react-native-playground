import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export function SettingsButton() {
  const { openSettings, iconColor } = useTheme();
  return (
    <Pressable
      hitSlop={8}
      style={{ paddingHorizontal: 4 }}
      onPress={openSettings}
    >
      <MaterialIcons name="settings" size={20} color={iconColor} />
    </Pressable>
  );
}
