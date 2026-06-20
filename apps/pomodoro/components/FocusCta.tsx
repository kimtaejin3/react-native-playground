import { Pressable, View, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export type FocusCtaProps = {
  minutes: number;
  color: string;
  running: boolean;
  onPress: () => void;
};

const STEP = 30; // 글자당 지연(ms) — 왼→오 순차

// 드래그 끝 → 아이콘은 아래에서 위로, 텍스트는 글자마다 왼→오
// running이면 "그만하기" + 정지 아이콘
export function FocusCta({ minutes, color, running, onPress }: FocusCtaProps) {
  const label = running ? "그만하기" : `${minutes}분 집중 시작!`;
  const chars = [...label];

  return (
    <Pressable style={styles.row} onPress={onPress} hitSlop={8}>
      <Animated.View entering={FadeInDown.duration(200)}>
        <Ionicons name={running ? "stop" : "play"} size={18} color={color} />
      </Animated.View>
      <View style={styles.text}>
        {chars.map((ch, i) => (
          <Animated.Text
            key={i}
            entering={FadeIn.duration(140).delay(i * STEP)}
            style={[styles.char, { color }]}
          >
            {ch}
          </Animated.Text>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  text: { flexDirection: "row" },
  char: { fontSize: 15, fontWeight: "700" },
});
