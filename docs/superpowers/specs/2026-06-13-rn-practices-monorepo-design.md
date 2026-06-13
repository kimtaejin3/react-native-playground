# RN 연습용 모노레포 설계

작성일: 2026-06-13

## 목적

여러 React Native 연습 프로젝트를 한 곳에서 관리하면서, Lottie 애니메이션을
중심으로 간단한 서비스들을 만들어보는 모노레포를 구축한다. 공용 컴포넌트와
Lottie 래퍼를 패키지로 공유해 앱이 늘어나도 재사용이 가능하도록 한다.

## 기술 스택

- **Expo** (최신 SDK) — 설정 최소화, Lottie 기본 지원
- **pnpm workspaces** — 의존성 공유/디스크 효율
- **Turborepo** — 빌드/캐시/스크립트 오케스트레이션
- **lottie-react-native** — 애니메이션 재생

## 디렉토리 구조

```
react-native-practices/
├── apps/
│   └── todo/                # Expo 앱 #1 — 할 일 앱 (완료 시 Lottie 재생)
├── packages/
│   ├── ui/                  # @repo/ui — 공용 컴포넌트 (Button, Card 등)
│   ├── lottie/              # @repo/lottie — LottieView 래퍼 + 애니메이션 JSON
│   ├── tsconfig/            # @repo/tsconfig — 공유 TS 설정 (base/expo)
│   └── eslint-config/       # @repo/eslint-config — 공유 lint 설정
├── package.json             # 워크스페이스 루트 (pnpm)
├── pnpm-workspace.yaml      # apps/*, packages/* 등록
└── turbo.json               # Turborepo 파이프라인
```

## 공용 패키지

### @repo/lottie (핵심)
- `lottie-react-native`를 감싼 `<Lottie>` 컴포넌트.
- props: `source`, `autoPlay`, `loop`, `speed`.
- ref로 `play() / pause() / reset()` 메서드 노출.
- `assets/`에 애니메이션 JSON 보관(예: `check-success.json`), named export 제공.

### @repo/ui
- `Button`, `Card` 등 기본 컴포넌트. RN `StyleSheet` 기반(별도 스타일 라이브러리 없음).

### @repo/tsconfig
- `base.json`(공통) + `expo.json`(앱용, base extends). 각 앱/패키지가 extends.

### @repo/eslint-config
- flat config 기반 공유 lint 규칙.

## apps/todo

- 할 일 추가/삭제/완료 토글. 상태는 로컬 `useState`(서버/DB 없음).
- 완료 토글 시 `@repo/lottie` 체크 애니메이션 재생.
- `@repo/ui`의 `Button`/`Card` 사용 → 공용 패키지 dogfooding.

## 모노레포 핵심 설정

- **Metro**: `metro.config.js`에서 `watchFolders`(워크스페이스 루트) +
  `nodeModulesPaths` 설정. 안 하면 공용 패키지 import가 깨짐 (Expo 공식 가이드).
- **Turborepo**: `lint`, `start`, `typecheck` 태스크 파이프라인.

## 작업 분담

- **Claude가 완성**: 모노레포 뼈대(pnpm/turbo/workspace), `@repo/tsconfig`,
  `@repo/eslint-config`, `@repo/lottie`(래퍼 + 예시 JSON), `@repo/ui`(기본 컴포넌트).
- **todo는 뼈대만**: Expo 앱 생성 + 패키지 연결 + 빈 화면까지. 이후 할 일 추가/완료/
  Lottie 연동은 사용자와 인터랙션하며 함께 구현.

## 범위 밖 (YAGNI)

- 서버, DB, 인증, 상태관리 라이브러리(Redux 등) — 연습 단계에서는 제외.
- todo 외 추가 앱 — 필요해질 때 같은 spec→plan 사이클로 추가.
```
