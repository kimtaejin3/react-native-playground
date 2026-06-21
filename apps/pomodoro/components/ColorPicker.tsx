import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

// 스와치 밝기로 체크마크 대비색 결정 (어두우면 흰 체크, 밝으면 검은 체크)
const isDark = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
};

function Swatch({
  color,
  selected,
  onPress,
}: {
  color: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.swatch, { backgroundColor: color }]}
    >
      {selected && (
        <Ionicons
          name="checkmark"
          size={20}
          color={isDark(color) ? "#fff" : "#0f172a"}
        />
      )}
    </Pressable>
  );
}

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
                <Swatch
                  key={c}
                  color={c}
                  selected={colors.number.toLowerCase() === c}
                  onPress={() => setAccent(c)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>배경</Text>
            <View style={styles.swatches}>
              {BG.map((c) => (
                <Swatch
                  key={c}
                  color={c}
                  selected={colors.background.toLowerCase() === c}
                  onPress={() => setColor("background", c)}
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
    borderWidth: 1,
    borderColor: "#e2e8f0", // 흰 스와치도 경계 보이게 얇은 테두리
    alignItems: "center",
    justifyContent: "center",
  },
});
