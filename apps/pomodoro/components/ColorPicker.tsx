import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const ACCENT = [
  "#0f172a",
  "#2563eb",
  "#7c3aed",
  "#0d9488",
  "#059669",
  "#d97706",
  "#e11d48",
  "#db2777",
];

const BG = [
  "#ffffff",
  "#f1f5f9",
  "#fef3c7",
  "#ecfeff",
  "#f5f3ff",
  "#fdf2f8",
  "#f0fdf4",
  "#0f172a",
];

export function ColorPicker() {
  const { colors, setColor, colorOpen, closeColor } = useTheme();

  const setAccent = (c: string) => {
    setColor("number", c);
    setColor("slider", c);
  };

  return (
    <Modal
      visible={colorOpen}
      transparent
      animationType="fade"
      onRequestClose={closeColor}
    >
      {/* 배경 탭하면 닫힘 */}
      <Pressable style={styles.backdrop} onPress={closeColor}>
        {/* 팔레트 버튼 아래에 떠 있는 카드 */}
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.section}>
            <Text style={styles.label}>색상 (숫자·슬라이더)</Text>
            <View style={styles.swatches}>
              {ACCENT.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setAccent(c)}
                  style={[
                    styles.swatch,
                    { backgroundColor: c },
                    colors.number.toLowerCase() === c && styles.swatchSelected,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>배경</Text>
            <View style={styles.swatches}>
              {BG.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setColor("background", c)}
                  style={[
                    styles.swatch,
                    { backgroundColor: c },
                    colors.background.toLowerCase() === c &&
                      styles.swatchSelected,
                  ]}
                />
              ))}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "flex-end",
    paddingTop: 100, // 헤더 아래
    paddingHorizontal: 12,
  },
  card: {
    width: 268,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    gap: 16,
    // 떠 있는 느낌의 그림자
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  section: { gap: 10 },
  label: { fontSize: 13, fontWeight: "600", color: "#475569" },
  swatches: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 9999,
    borderWidth: 3,
    borderColor: "#e2e8f0",
  },
  swatchSelected: { borderWidth: 3, borderColor: "#0f172a" },
});
