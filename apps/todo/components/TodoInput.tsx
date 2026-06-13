import { useState } from "react";
import { View, TextInput } from "react-native";
import { Button } from "@repo/ui";
import { useTodos } from "../context/TodoContext";

export function TodoInput() {
  const { addTodo } = useTodos();
  const [text, setText] = useState("");
  const [desc, setDesc] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    addTodo(text, desc);
    setText("");
    setDesc("");
  };

  return (
    <>
      <View className="overflow-hidden rounded-[10px] border border-[#e2e8f0]">
        <TextInput
          className="h-12 bg-white px-[14px] text-base"
          placeholder="할 일을 입력하세요"
          placeholderTextColor="#94a3b8"
          value={text}
          onChangeText={setText}
          returnKeyType="next"
        />
        <TextInput
          className="h-12 border-t border-[#e2e8f0] bg-white px-[14px] text-base"
          placeholder="설명 (선택)"
          placeholderTextColor="#94a3b8"
          value={desc}
          onChangeText={setDesc}
          onSubmitEditing={submit}
          returnKeyType="done"
        />
      </View>
      <Button title="추가" onPress={submit} />
    </>
  );
}
