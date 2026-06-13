import { Pressable, Text, StyleSheet, type ViewStyle } from "react-native";

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Button({ title, onPress, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.base, pressed && styles.pressed, style]}
    >
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  pressed: { opacity: 0.7 },
  label: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
