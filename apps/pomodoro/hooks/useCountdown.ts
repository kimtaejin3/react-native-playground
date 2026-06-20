import { useEffect, useRef, useState } from "react";

// 렌더마다 최신 값을 담는 ref (effect 재실행 없이 최신 콜백/값 읽기)
function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

type Handlers = {
  onTick?: (remainingSec: number) => void; // 매초 (남은 초)
  onDone?: (durationSec: number) => void; // 0 도달 (총 길이)
  onEmpty?: () => void; // 시작 시간이 0 이하
};

/**
 * running이 true가 되는 순간 getStartSeconds()로 시작하는 1초 카운트다운.
 * - 남은 초를 state로 반환 (멈추면 null)
 * - 시작 시점의 값으로만 도므로 deps는 running 하나면 충분 (나머지는 ref로 최신화)
 */
export function useCountdown(
  running: boolean,
  getStartSeconds: () => number,
  handlers: Handlers,
) {
  const [remaining, setRemaining] = useState<number | null>(null);

  const getStartRef = useLatest(getStartSeconds);
  const handlersRef = useLatest(handlers);

  useEffect(() => {
    if (!running) {
      setRemaining(null);
      return;
    }
    const startSec = getStartRef.current();
    if (startSec <= 0) {
      setRemaining(null);
      handlersRef.current.onEmpty?.();
      return;
    }
    const endTime = Date.now() + startSec * 1000;
    setRemaining(startSec);
    const id = setInterval(() => {
      const remMs = endTime - Date.now();
      if (remMs <= 0) {
        setRemaining(0);
        handlersRef.current.onDone?.(startSec);
        return;
      }
      const sec = Math.ceil(remMs / 1000);
      setRemaining(sec);
      handlersRef.current.onTick?.(sec);
    }, 1000);
    return () => clearInterval(id);
  }, [running, getStartRef, handlersRef]);

  return remaining;
}
