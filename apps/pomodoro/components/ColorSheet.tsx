import { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useTheme } from "../context/ThemeContext";

// 숫자·슬라이더 공용 액센트
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

// 배경: 부드러운 톤 + 다크
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

export function ColorSheet() {
  const { colors, setColor, colorRef } = useTheme();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  // 숫자·슬라이더를 같은 색으로 한 번에 세팅
  const setAccent = (c: string) => {
    setColor("number", c);
    setColor("slider", c);
  };

  return (
    <BottomSheetModal
      ref={colorRef}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.sheet}>
        <Text style={styles.title}>색상 커스텀</Text>

        {/* 라이브 프리뷰 */}
        <View style={[styles.preview, { backgroundColor: colors.background }]}>
          <Text style={[styles.previewTime, { color: colors.number }]}>
            25:00
          </Text>
          <View style={[styles.previewBar, { backgroundColor: colors.slider }]} />
        </View>

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
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 36, gap: 16 },
  title: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  preview: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  previewTime: { fontSize: 32, fontWeight: "800", letterSpacing: 1 },
  previewBar: { width: 140, height: 8, borderRadius: 4 },
  section: { gap: 10 },
  label: { fontSize: 14, fontWeight: "600", color: "#475569" },
  swatches: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  swatch: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  swatchSelected: { borderWidth: 3, borderColor: "#0f172a" },
});
