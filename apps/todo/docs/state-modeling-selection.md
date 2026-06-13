# 메뉴/수정 선택 상태 모델링

> 작성일: 2026-06-13 · 대상: `components/TodoScreen.tsx`

## 문제

길게 누르면 뜨는 **액션 시트(메뉴)** 와 **수정 모달**, 두 UI의 "어떤 항목을 대상으로 하는가"를
각각 nullable id 두 개로 관리했다.

```tsx
const [menuId, setMenuId] = useState<string | null>(null); // 메뉴 시트 대상
const [editId, setEditId] = useState<string | null>(null); // 수정 모달 대상
```

이 구조의 문제는 **불가능한 상태가 타입상 허용된다**는 것이다.

| menuId | editId | 의미 | 유효? |
| --- | --- | --- | --- |
| null | null | 아무것도 안 열림 | ✅ |
| "1" | null | 1번 메뉴 열림 | ✅ |
| null | "1" | 1번 수정 열림 | ✅ |
| "1" | "2" | **메뉴와 수정이 동시에?** | ❌ (불가능해야 함) |

메뉴와 수정 모달은 **상호 배타적**(동시에 뜨면 안 됨)인데, 변수 두 개로는 이 불변식이
타입으로 보장되지 않는다. 네 번째 행 같은 상태를 코드가 실수로 만들 수 있고,
컴파일러는 막아주지 못한다.

부수적으로:

- 모드 전환(메뉴 → 수정)이 `setEditId(menuId)` + `setMenuId(null)` **두 번의 setState**로 나뉘어
  원자적이지 않다.
- 대상 항목 조회도 `menuTodo`, `editingTodo` 두 벌로 중복된다.

## 해결

"어떤 항목을, 어떤 모드로 다루는가"는 사실 **하나의 관심사**다.
id 하나 + 모드(`"menu" | "edit"`)를 가진 **단일 상태**로 합쳐, 한 번에 하나의 모드만
존재할 수 있게 만들었다.

```tsx
type Selection = { id: string; mode: "menu" | "edit" } | null;

const [selected, setSelected] = useState<Selection>(null);
const selectedTodo = todos.find((t) => t.id === selected?.id);
```

사용부:

```tsx
// 열기
onLongPress={() => setSelected({ id: item.id, mode: "menu" })}

// 메뉴 → 수정 (같은 id로 모드만 전환, setState 한 번)
onEdit={() => setSelected((s) => (s ? { id: s.id, mode: "edit" } : null))}

// 닫기 / 완료
onClose={() => setSelected(null)}

// 표시 조건
<TodoActionSheet visible={selected?.mode === "menu"} ... />
<EditTodoModal   visible={selected?.mode === "edit"} ... />
```

## 효과

- **불가능한 상태가 표현 불가능해짐**: id가 하나뿐이라 메뉴와 수정이 동시에 켜질 수 없다.
- 모드 전환이 **setState 한 번**으로 원자적.
- 대상 항목 조회가 `selectedTodo` 하나로 통일.

## 일반 원칙: Make illegal states unrepresentable

상태를 설계할 때 "이 값들의 조합 중 **실제로 불가능한 조합**이 있는가?"를 따져본다.
있다면, 그 불가능한 조합을 **타입 수준에서 만들 수 없도록** 모델을 바꾼다.

- 상호 배타적인 모드 → 여러 boolean/nullable 대신 **하나의 유니온(discriminated union)** 으로.
- 판단 기준 질문: *"이 두 상태가 동시에 참이 될 수 있나? 그러면 안 되나?"* → 안 되면 합쳐라.

> 관련: UI 선택 상태(`selected`)는 도메인 데이터(`todos`)와 분리해 화면 지역 상태로 둔다.
> "이 상태가 사라져도 todos는 멀쩡한가?" → 그렇다면 UI 상태이므로 Context가 아닌 화면에 둔다.
