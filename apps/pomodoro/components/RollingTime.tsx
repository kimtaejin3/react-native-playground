import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";

const DIGIT_H = 84; // 한 자릿수 높이(=글자 height)
const DIGIT_W = 50; // 한 자릿수 폭
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// 0~9가 세로로 쌓인 칼럼을 translateY로 굴려 해당 숫자를 보여줌
function RollingDigit({ digit, color }: { digit: number; color: string }) {
  const y = useSharedValue(-digit * DIGIT_H);

  useEffect(() => {
    y.value = withTiming(-digit * DIGIT_H, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [digit, y]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  return (
    <View style={styles.window}>
      <Animated.View style={style}>
        {DIGITS.map((d) => (
          <Text key={d} style={[styles.digit, { color }]}>
            {d}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

const tens = (n: number) => Math.floor(n / 10);
const ones = (n: number) => n % 10;

export type RollingTimeProps = {
  seconds: number; // 0 ~ 3600 (고른 값이든 남은 값이든 동일하게 표시)
};

export function RollingTime({ seconds }: RollingTimeProps) {
  const color = useTheme().colors.number;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return (
    <View style={styles.row}>
      <RollingDigit digit={tens(m)} color={color} />
      <RollingDigit digit={ones(m)} color={color} />
      <Text style={[styles.colon, { color }]}>:</Text>
      <RollingDigit digit={tens(s)} color={color} />
      <RollingDigit digit={ones(s)} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  window: { height: DIGIT_H, width: DIGIT_W, overflow: "hidden" },
  digit: {
    height: DIGIT_H,
    width: DIGIT_W,
    lineHeight: DIGIT_H,
    textAlign: "center",
    fontSize: 64,
    fontFamily: "ArchivoBlack_400Regular",
    color: "#0f172a",
  },
  colon: {
    fontSize: 64,
    fontFamily: "ArchivoBlack_400Regular",
    color: "#0f172a",
    lineHeight: DIGIT_H,
    marginHorizontal: 2,
  },
});
