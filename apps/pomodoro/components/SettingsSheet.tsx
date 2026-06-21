import { useCallback } from "react";
import { View, Text, Pressable, Switch, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useTheme } from "../context/ThemeContext";

const OPTIONS = [15, 30, 45, 60];

export function SettingsSheet() {
  const {
    maxMinutes,
    setMaxMinutes,
    hapticEnabled,
    setHapticEnabled,
    keepAwakeEnabled,
    setKeepAwakeEnabled,
    settingsRef,
  } = useTheme();

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

        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleLabel}>마지막 10초 진동</Text>
            <Text style={styles.toggleHint}>끝나기 직전 매초 가볍게 진동</Text>
          </View>
          <Switch value={hapticEnabled} onValueChange={setHapticEnabled} />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleLabel}>화면 켜두기</Text>
            <Text style={styles.toggleHint}>집중하는 동안 화면이 안 꺼짐</Text>
          </View>
          <Switch
            value={keepAwakeEnabled}
            onValueChange={setKeepAwakeEnabled}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100, gap: 32 },
  title: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  optionSelected: { borderColor: "#0f172a", backgroundColor: "#0f172a" },
  optionText: { fontSize: 15, fontWeight: "800", color: "#334155" },
  optionTextSel: { color: "#fff" },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  toggleText: { flex: 1, gap: 2 },
  toggleLabel: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  toggleHint: { fontSize: 13, color: "#64748b" },
});
