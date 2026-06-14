import { useState } from "react";
import { FlatList } from "react-native";
import { useTodos } from "../context/TodoContext";
import { TodoItem } from "./TodoItem";

export type TodoListProps = {
  onLongPress: (id: string) => void;
};

export function TodoList({ onLongPress }: TodoListProps) {
  const { sortedTodos, toggleTodo } = useTodos();
  // 위치가 바뀐 아이템만 remount(=disappear/reappear) 시키기 위한 카운터
  const [bumps, setBumps] = useState<Record<string, number>>({});

  const onToggle = (id: string) => {
    if (toggleTodo(id)) {
      setBumps((b) => ({ ...b, [id]: (b[id] ?? 0) + 1 }));
    }
  };

  return (
    <FlatList
      data={sortedTodos}
      keyExtractor={(item) => `${item.id}-${bumps[item.id] ?? 0}`}
      contentContainerClassName="gap-2.5 pb-5 pt-1"
      renderItem={({ item }) => (
        <TodoItem item={item} onToggle={onToggle} onLongPress={onLongPress} />
      )}
    />
  );
}
