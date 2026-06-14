import { Keyframe, LinearTransition } from "react-native-reanimated";

// 애니메이션 타이밍(ms) — layout이 기준값
export const TIMING = {
  layout: 400, // 항목 재배치(슬라이드)
  enter: 220, // 등장
  exit: 180, // 사라짐
  longPress: 350, // 길게 누름 인식
} as const;

const SCALE_FROM = 0.85; // 등장/사라짐의 시작·끝 크기
const CHECK_SETTLE_BUFFER = 110; // 안착 후 체크 그리기까지 여유(ms)

// 파생값: "결과 숫자"가 아니라 "관계"로 정의 → 기준값 바꾸면 자동 반영
const ENTER_DELAY = TIMING.layout; // 슬라이드가 끝난 뒤 등장
export const CHECK_DRAW_DELAY = TIMING.layout + CHECK_SETTLE_BUFFER; // 안착 후 체크

// 자리 차지 후 살짝 커지며 등장 (리스트가 먼저 밀린 뒤 나오도록 delay)
export const ItemEnter = new Keyframe({
  0: { opacity: 0, transform: [{ scale: SCALE_FROM }] },
  100: { opacity: 1, transform: [{ scale: 1 }] },
})
  .duration(TIMING.enter)
  .delay(ENTER_DELAY);

// 토글 시 원래 자리에서 사라지는 애니메이션
export const ItemExit = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: SCALE_FROM }] },
}).duration(TIMING.exit);

// 재배치 슬라이드
export const itemLayout = LinearTransition.duration(TIMING.layout);
