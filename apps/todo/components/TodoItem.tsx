import { Text, View, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { Card } from "@repo/ui";
import type { Todo } from "../context/TodoContext";
import { ItemEnter, ItemExit, itemLayout, TIMING } from "./todoMotion";
import { Checkbox } from "./Checkbox";

export type TodoItemProps = {
  item: Todo;
  delayCheck: boolean;
  onToggle: (id: string) => void;
  onLongPress: (id: string) => void;
};

export function TodoItem({
  item,
  delayCheck,
  onToggle,
  onLongPress,
}: TodoItemProps) {
  return (
    <Animated.View entering={ItemEnter} exiting={ItemExit} layout={itemLayout}>
      <Pressable
        onPress={() => onToggle(item.id)}
        onLongPress={() => onLongPress(item.id)}
        delayLongPress={TIMING.longPress}
      >
        <Card
          className={`flex-row items-center justify-between gap-3 ${
            item.done ? "bg-[#fafafa]" : ""
          }`}
        >
          <View className="flex-1 gap-0.5">
            <Text
              className={`text-base ${
                item.done ? "text-[#94a3b8] line-through" : "text-[#0f172a]"
              }`}
            >
              {item.text}
            </Text>
            {item.description ? (
              <Text className="text-[13px] text-[#64748b]">
                {item.description}
              </Text>
            ) : null}
          </View>
          <Checkbox checked={item.done} delayed={delayCheck} />
        </Card>
      </Pressable>
    </Animated.View>
  );
}
