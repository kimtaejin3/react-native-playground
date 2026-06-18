import { View } from "react-native";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CustomButton label="auth로 가기" onPress={() => router.push("/auth")} />
    </View>
  );
}
