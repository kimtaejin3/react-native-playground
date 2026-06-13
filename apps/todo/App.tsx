import "./global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TodoProvider } from "./context/TodoContext";
import { LottieOverlayProvider } from "./context/LottieOverlayContext";
import { TodoScreen } from "./components/TodoScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <LottieOverlayProvider>
        <TodoProvider>
          <TodoScreen />
          <StatusBar style="auto" />
        </TodoProvider>
      </LottieOverlayProvider>
    </SafeAreaProvider>
  );
}
