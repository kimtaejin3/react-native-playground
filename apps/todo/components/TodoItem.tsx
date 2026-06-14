import { Text, View, Pressable } from "react-native";
import Animated, { Keyframe, LinearTransition } from "react-native-reanimated";
import { Card } from "@repo/ui";
import { Lottie, checkDraw } from "@repo/lottie";
import type { Todo } from "../context/TodoContext";

// 애니메이션 타이밍(ms) — layout이 기준값
const TIMING = {
  layout: 400, // 항목 재배치(슬라이드)
  enter: 220, // 등장
  exit: 180, // 사라짐
  longPress: 350, // 길게 누름 인식
} as const;

const SCALE_FROM = 0.85; // 등장/사라짐의 시작·끝 크기
const CHECK_SIZE = 18; // 체크 Lottie 크기(px)
const CHECK_SETTLE_BUFFER = 120; // 안착 후 체크 그리기까지 여유(ms)

// 파생값: "결과 숫자"가 아니라 "관계"로 정의 → 기준값 바꾸면 자동 반영
const ENTER_DELAY = TIMING.layout; // 슬라이드가 끝난 뒤 등장
const CHECK_DRAW_DELAY = TIMING.layout + CHECK_SETTLE_BUFFER; // 안착 후 체크

// 자리 차지 후 살짝 커지며 등장 (리스트가 먼저 밀린 뒤 나오도록 delay)
const ItemEnter = new Keyframe({
  0: { opacity: 0, transform: [{ scale: SCALE_FROM }] },
  100: { opacity: 1, transform: [{ scale: 1 }] },
})
  .duration(TIMING.enter)
  .delay(ENTER_DELAY);

// 토글 시 원래 자리에서 사라지는 애니메이션
const ItemExit = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: SCALE_FROM }] },
}).duration(TIMING.exit);

export type TodoItemProps = {
  item: Todo;
  /** 위치가 바뀐 토글일 때만 안착(슬라이드)을 기다렸다 체크를 그림 */
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
    <Animated.View
      entering={ItemEnter}
      exiting={ItemExit}
      layout={LinearTransition.duration(TIMING.layout)}
    >
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
                delay={delayCheck ? CHECK_DRAW_DELAY : 0}
                style={{ width: CHECK_SIZE, height: CHECK_SIZE }}
              />
            )}
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
}
