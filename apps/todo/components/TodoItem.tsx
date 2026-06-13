import { Text, View, Pressable } from "react-native";
import Animated, { Keyframe, LinearTransition } from "react-native-reanimated";
import { Card } from "@repo/ui";
import { Lottie, checkDraw } from "@repo/lottie";
import { useTodos, type Todo } from "../context/TodoContext";

// 자리 차지 후 살짝 커지며 등장 (리스트가 먼저 밀린 뒤 나오도록 delay)
const ItemEnter = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.85 }] },
  100: { opacity: 1, transform: [{ scale: 1 }] },
})
  .duration(220)
  .delay(400);

// 토글 시 원래 자리에서 사라지는 애니메이션
const ItemExit = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: 0.85 }] },
}).duration(180);

export type TodoItemProps = {
  item: Todo;
  onLongPress: (id: string) => void;
};

export function TodoItem({ item, onLongPress }: TodoItemProps) {
  const { toggleTodo } = useTodos();

  return (
    <Animated.View
      entering={ItemEnter}
      exiting={ItemExit}
      layout={LinearTransition.duration(400)}
    >
      <Pressable
        onPress={() => toggleTodo(item.id)}
        onLongPress={() => onLongPress(item.id)}
        delayLongPress={350}
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
          <View
            className={`h-7 w-7 items-center justify-center overflow-hidden rounded-lg border-2 ${
              item.done ? "border-[#023ec1] bg-[#111ec8]" : "border-[#cedcea]"
            }`}
          >
            {item.done && (
              <Lottie
                source={checkDraw}
                autoPlay
                loop={false}
                delay={520}
                style={{ width: 18, height: 18 }}
              />
            )}
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
}
