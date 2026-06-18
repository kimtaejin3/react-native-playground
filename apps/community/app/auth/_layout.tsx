import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import Foundation from "@expo/vector-icons/Foundation";
import { colors } from "../constants";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.BLACK,
        contentStyle: {
          backgroundColor: colors.WHITE,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "로그인",
          headerShown: true,
          headerLeft: () => (
            <Link href={"/"} asChild>
              <Pressable hitSlop={12} style={{ paddingHorizontal: 8 }}>
                <Foundation name="home" size={28} color={"black"} />
              </Pressable>
            </Link>
          ),
        }}
      />
    </Stack>
  );
}
