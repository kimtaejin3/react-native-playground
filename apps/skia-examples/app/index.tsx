import { View, StyleSheet } from "react-native";
import { Matrix } from "../matrix";

export default function Home() {
  return (
    <View style={styles.container}>
      <Matrix />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});
