import { View, StyleSheet } from "react-native";
import { ArcSlider } from "../arcSlider";

export default function ArcSliderScreen() {
  return (
    <View style={styles.container}>
      <ArcSlider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
});
