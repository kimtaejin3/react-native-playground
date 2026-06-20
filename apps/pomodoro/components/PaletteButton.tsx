import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export function PaletteButton() {
  const { openColor, iconColor } = useTheme();
  return (
    <Pressable hitSlop={8} style={{ paddingHorizontal: 4 }} onPress={openColor}>
      <MaterialIcons name="palette" size={22} color={iconColor} />
    </Pressable>
  );
}
