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

type TodoContextValue = {
  todos: Todo[];
  addTodo: (text: string, description: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string, description: string) => void;
};

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const idRef = useRef(0);

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

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
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
      value={{ todos, addTodo, toggleTodo, deleteTodo, editTodo }}
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
