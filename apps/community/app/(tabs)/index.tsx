import { View } from "react-native";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import InputField from "../../components/InputField";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <InputField label="이메일" placeholder="이메일을 입력하세요" />
      <CustomButton
        label="인증 페이지로 가기"
        onPress={() => router.push("/auth")}
      />
    </View>
  );
}
