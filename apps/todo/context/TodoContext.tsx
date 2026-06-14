import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Todo = {
  id: string;
  text: string;
  description: string;
  done: boolean;
};

const byDone = (a: Todo, b: Todo) => Number(a.done) - Number(b.done);

type TodoContextValue = {
  todos: Todo[];
  sortedTodos: Todo[];
  addTodo: (text: string, description: string) => void;
  /** 토글로 정렬 위치가 바뀌면 true 반환 */
  toggleTodo: (id: string) => boolean;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string, description: string) => void;
};

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const idRef = useRef(0);

  // 파생 도메인 데이터: 미완료 먼저, 완료는 아래로 (안정 정렬)
  const sortedTodos = [...todos].sort(byDone);

  const addTodo = (text: string, description: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    idRef.current += 1;
    setTodos((prev) => [
      {
        id: String(idRef.current),
        text: trimmed,
        description: description.trim(),
        done: false,
      },
      ...prev,
    ]);
  };

  const toggleTodo = (id: string): boolean => {
    const before = sortedTodos.findIndex((t) => t.id === id);
    const next = todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t,
    );
    const after = [...next].sort(byDone).findIndex((t) => t.id === id);
    setTodos(next);
    return before !== after;
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const editTodo = (id: string, text: string, description: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, text: trimmed, description: description.trim() }
          : t,
      ),
    );
  };

  return (
    <TodoContext.Provider
      value={{ todos, sortedTodos, addTodo, toggleTodo, deleteTodo, editTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos must be used within a TodoProvider");
  return ctx;
}
