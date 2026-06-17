import { Tabs } from "expo-router";
import React from "react";
import { colors } from "../constants";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.ORANGE_600,
        headerShown: false,
        tabBarStyle: {
          height: 80,
          borderRadius: 50,
          paddingTop: 5,
          backgroundColor: colors.WHITE,

          position: "absolute",

          elevation: 8,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: "내 프로필",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "설정",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={18} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
