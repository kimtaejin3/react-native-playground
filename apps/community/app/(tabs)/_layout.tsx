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
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="home" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: "내 프로필",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="person" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "설정",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="settings" size={18} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
