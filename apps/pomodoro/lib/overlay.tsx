import { Fragment, useSyncExternalStore, type ReactNode } from "react";

// 오버레이 하나를 그리는 함수. isOpen/close를 받아 모달을 렌더.
type Render = (props: { isOpen: boolean; close: () => void }) => ReactNode;
type Item = { id: string; render: Render; isOpen: boolean };

const EXIT_MS = 250; // close 후 언마운트까지 (fade-out 시간)

let items: Item[] = [];
const listeners = new Set<() => void>();
let seq = 0;

const notify = () => {
  items = [...items]; // 새 참조 → 구독자 갱신
  listeners.forEach((l) => l());
};

// 어디서든(React 밖에서도) 호출 가능한 명령형 API
export const overlay = {
  open(render: Render) {
    const id = `ov_${++seq}`;
    items.push({ id, render, isOpen: true });
    notify();
    return id;
  },
  close(id: string) {
    const it = items.find((i) => i.id === id);
    if (!it || !it.isOpen) return;
    it.isOpen = false; // 먼저 닫힘 애니메이션
    notify();
    setTimeout(() => {
      items = items.filter((i) => i.id !== id); // 그 뒤 언마운트
      notify();
    }, EXIT_MS);
  },
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => items;

// 한 번만 마운트. 열린 오버레이들을 children 위에 렌더.
export function OverlayProvider({ children }: { children: ReactNode }) {
  const list = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return (
    <>
      {children}
      {list.map((it) => (
        <Fragment key={it.id}>
          {it.render({ isOpen: it.isOpen, close: () => overlay.close(it.id) })}
        </Fragment>
      ))}
    </>
  );
}
