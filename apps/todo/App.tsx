import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { Card } from "@repo/ui";
import { Lottie, checkSuccess } from "@repo/lottie";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Todo</Text>
      <Card>
        <Text style={styles.hint}>여기에 할 일 목록을 함께 만들어봐요.</Text>
      </Card>
      {/* Lottie 래퍼 연결 확인용 (완료 애니메이션은 추후 인터랙션하며 구현) */}
      <View style={styles.lottieSlot}>
        <Lottie source={checkSuccess} style={styles.lottie} />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9", padding: 20, gap: 16 },
  title: { fontSize: 28, fontWeight: "700" },
  hint: { fontSize: 15, color: "#475569" },
  lottieSlot: { alignItems: "center" },
  lottie: { width: 120, height: 120 },
});
