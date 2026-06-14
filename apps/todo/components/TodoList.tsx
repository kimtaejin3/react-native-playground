import { useState } from "react";
import { FlatList } from "react-native";
import { useTodos } from "../context/TodoContext";
import { useLottieOverlay } from "../context/LottieOverlayContext";
import { TodoItem } from "./TodoItem";
import finish from "../assets/finish.json";

export type TodoListProps = {
  onLongPress: (id: string) => void;
};

export function TodoList({ onLongPress }: TodoListProps) {
  const { todos, sortedTodos, toggleTodo } = useTodos();
  const { play } = useLottieOverlay();

  // 위치가 바뀐 아이템만 remount(=disappear/reappear) 시키기 위한 카운터
  const [bumps, setBumps] = useState<Record<string, number>>({});
  // 마지막 토글로 그 아이템 위치가 바뀌었는지 (체크 delay 여부 결정)
  const [moved, setMoved] = useState<Record<string, boolean>>({});

  const onToggle = (id: string) => {
    const didMove = toggleTodo(id);
    setMoved((m) => ({ ...m, [id]: didMove }));
    if (didMove) {
      setBumps((b) => ({ ...b, [id]: (b[id] ?? 0) + 1 }));
    }
    // 이번 토글로 모든 todo가 완료되면 finish 애니메이션 재생
    const allDone =
      todos.length > 0 && todos.every((t) => (t.id === id ? !t.done : t.done));
    if (allDone) play(finish, { size: 320 });
  };

  return (
    <FlatList
      data={sortedTodos}
      keyExtractor={(item) => `${item.id}-${bumps[item.id] ?? 0}`}
      contentContainerClassName="gap-2.5 pb-5 pt-1"
      renderItem={({ item }) => (
        <TodoItem
          item={item}
          delayCheck={moved[item.id] ?? false}
          onToggle={onToggle}
          onLongPress={onLongPress}
        />
      )}
    />
  );
}
