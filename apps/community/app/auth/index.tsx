import { Link, router } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import CustomButton from "../../components/CustomButton";

export default function AuthScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          label="이메일 로그인"
          onPress={() => router.push("/auth/login")}
        />
        <Link href={"/"} style={styles.signupText}>
          이메일로 가입하기
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    flex: 1,
  },
  logo: {
    width: 112,
    height: 112,
  },
  signupText: {
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 20,
  },
});
