import { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useTheme } from "../context/ThemeContext";

const OPTIONS = [15, 30, 45, 60];

export function SettingsSheet() {
  const { maxMinutes, setMaxMinutes, settingsRef } = useTheme();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={settingsRef}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.sheet}>
        <Text style={styles.title}>최대 시간</Text>
        <View style={styles.options}>
          {OPTIONS.map((m) => {
            const selected = maxMinutes === m;
            return (
              <Pressable
                key={m}
                onPress={() => setMaxMinutes(m)}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <Text
                  style={[styles.optionText, selected && styles.optionTextSel]}
                >
                  {String(m).padStart(2, "0")}:00
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 36, gap: 16 },
  title: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  optionSelected: { borderColor: "#0f172a", backgroundColor: "#0f172a" },
  optionText: { fontSize: 18, fontWeight: "800", color: "#334155" },
  optionTextSel: { color: "#fff" },
});
