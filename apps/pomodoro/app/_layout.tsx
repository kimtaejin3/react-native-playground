import { Stack } from "expo-router";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  useFonts,
  ArchivoBlack_400Regular,
} from "@expo-google-fonts/archivo-black";
import { ThemeProvider } from "../context/ThemeContext";
import { HistoryButton } from "../components/HistoryButton";
import { PaletteButton } from "../components/PaletteButton";
import { SettingsButton } from "../components/SettingsButton";
import { ColorPicker } from "../components/ColorPicker";
import { SettingsSheet } from "../components/SettingsSheet";
import { HistorySheet } from "../components/HistorySheet";

function HeaderRight() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <HistoryButton />
      <PaletteButton />
      <SettingsButton />
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({ ArchivoBlack_400Regular });
  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <BottomSheetModalProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="index"
              options={{
                headerShown: true,
                headerTitle: "",
                headerTransparent: true,
                headerShadowVisible: false,
                headerRight: () => <HeaderRight />,
              }}
            />
          </Stack>
          <ColorPicker />
          <SettingsSheet />
          <HistorySheet />
        </BottomSheetModalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
