import { useEffect } from "react";
import {
  activateKeepAwakeAsync,
  deactivateKeepAwake,
} from "expo-keep-awake";

/**
 * active가 true인 동안에만 화면이 꺼지지 않게 유지한다.
 * (false가 되거나 언마운트되면 자동 해제)
 */
export function useKeepAwakeWhile(active: boolean) {
  useEffect(() => {
    if (!active) return;
    activateKeepAwakeAsync();
    return () => {
      deactivateKeepAwake();
    };
  }, [active]);
}
