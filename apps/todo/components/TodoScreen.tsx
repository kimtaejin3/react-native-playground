import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { successBurst } from "@repo/lottie";
import { useTodos } from "../context/TodoContext";
import { useLottieOverlay } from "../context/LottieOverlayContext";
import { TodoHeader } from "./TodoHeader";
import { TodoInput } from "./TodoInput";
import { TodoList } from "./TodoList";
import { TodoActionSheet } from "./TodoActionSheet";
import { EditTodoModal } from "./EditTodoModal";

// 메뉴 시트와 수정 모달은 상호 배타적 → 하나의 상태(id + 모드)로 표현
type Selection = { id: string; mode: "menu" | "edit" } | null;

export function TodoScreen() {
  const { todos, deleteTodo, editTodo } = useTodos();
  const { play } = useLottieOverlay();

  const [selected, setSelected] = useState<Selection>(null);
  const selectedTodo = todos.find((t) => t.id === selected?.id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
      <View className="flex-1 gap-3 p-5">
        <TodoHeader />
        <TodoInput />
        <TodoList onLongPress={(id) => setSelected({ id, mode: "menu" })} />
      </View>

      <TodoActionSheet
        visible={selected?.mode === "menu"}
        title={selectedTodo?.text}
        onEdit={() =>
          setSelected((s) => (s ? { id: s.id, mode: "edit" } : null))
        }
        onDelete={() => {
          if (selected) deleteTodo(selected.id);
          setSelected(null);
        }}
        onClose={() => setSelected(null)}
      />

      <EditTodoModal
        key={selected?.mode === "edit" ? selected.id : "closed"}
        visible={selected?.mode === "edit"}
        initialText={selectedTodo?.text ?? ""}
        initialDesc={selectedTodo?.description ?? ""}
        onSave={(t, d) => {
          if (selected) editTodo(selected.id, t, d);
          setSelected(null);
          play(successBurst, { size: 260 }); // 수정 성공 → 중앙에 성공 버스트
        }}
        onClose={() => setSelected(null)}
      />
    </SafeAreaView>
  );
}
