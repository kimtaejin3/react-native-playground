# RN 연습용 모노레포 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expo + pnpm + Turborepo 모노레포 뼈대를 만들고, 공용 패키지(lottie/ui/tsconfig/eslint-config)를 완성한 뒤 `apps/todo`를 패키지와 연결된 빈 화면 상태까지 스캐폴딩한다.

**Architecture:** pnpm workspaces가 `apps/*`, `packages/*`를 묶고 Turborepo가 태스크를 오케스트레이션한다. 앱은 Metro의 `watchFolders`/`nodeModulesPaths` 설정으로 워크스페이스 패키지를 해석한다. `@repo/lottie`가 `lottie-react-native`를 감싼 `<Lottie>`를 제공하고, `todo`가 이를 dogfooding한다.

**Tech Stack:** Expo(최신 SDK), TypeScript, pnpm workspaces, Turborepo, lottie-react-native, ESLint flat config.

> 참고: 스캐폴딩/설정 중심 작업이라 일부 태스크는 "실패 테스트"가 아닌 "검증 명령 + 기대 출력"으로 verify 한다. RN/Expo 단위테스트 하네스는 연습 범위 밖(YAGNI).

---

## File Structure

```
package.json                     # 워크스페이스 루트 + turbo 스크립트
pnpm-workspace.yaml              # apps/*, packages/* 등록
turbo.json                       # lint/start/typecheck 파이프라인
.npmrc                           # node-linker=hoisted (Expo 권장)
packages/tsconfig/               # base.json, expo.json, package.json
packages/eslint-config/          # index.mjs, package.json
packages/lottie/                 # src/Lottie.tsx, src/index.ts, assets/, package.json, tsconfig.json
packages/ui/                     # src/Button.tsx, src/Card.tsx, src/index.ts, package.json, tsconfig.json
apps/todo/                       # Expo 앱 (create-expo-app), metro.config.js 수정, App 화면 뼈대
```

---

## Task 1: 워크스페이스 루트 + Turborepo

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.npmrc`

- [ ] **Step 1: 루트 `package.json` 작성**

```json
{
  "name": "react-native-practices",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^2.1.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: `pnpm-workspace.yaml` 작성**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 3: `.npmrc` 작성 (Expo 모노레포 권장)**

```
node-linker=hoisted
```

- [ ] **Step 4: `turbo.json` 작성**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "lint": {},
    "typecheck": { "dependsOn": ["^typecheck"] },
    "start": { "cache": false, "persistent": true }
  }
}
```

- [ ] **Step 5: 검증 — `pnpm install` 후 turbo 인식 확인**

Run: `pnpm install && pnpm exec turbo --version`
Expected: 설치 성공 + turbo 버전 출력 (예: `2.x.x`)

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-workspace.yaml turbo.json .npmrc pnpm-lock.yaml
git commit -m "chore: scaffold pnpm + turborepo workspace root"
```

---

## Task 2: @repo/tsconfig

**Files:**
- Create: `packages/tsconfig/package.json`, `packages/tsconfig/base.json`, `packages/tsconfig/expo.json`

- [ ] **Step 1: `packages/tsconfig/package.json`**

```json
{
  "name": "@repo/tsconfig",
  "version": "0.0.0",
  "private": true,
  "files": ["base.json", "expo.json"]
}
```

- [ ] **Step 2: `packages/tsconfig/base.json`**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ESNext",
    "jsx": "react-jsx",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUncheckedIndexedAccess": true
  }
}
```

- [ ] **Step 3: `packages/tsconfig/expo.json`**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["DOM", "ESNext"],
    "allowJs": true
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add packages/tsconfig
git commit -m "feat(tsconfig): add shared TS configs"
```

---

## Task 3: @repo/eslint-config

**Files:**
- Create: `packages/eslint-config/package.json`, `packages/eslint-config/index.mjs`

- [ ] **Step 1: `packages/eslint-config/package.json`**

```json
{
  "name": "@repo/eslint-config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "index.mjs",
  "dependencies": {
    "eslint-config-expo": "^9.0.0"
  }
}
```

- [ ] **Step 2: `packages/eslint-config/index.mjs` (flat config base)**

```js
import expoConfig from "eslint-config-expo/flat.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...expoConfig,
  { ignores: ["dist/*", ".expo/*", "node_modules/*"] },
];
```

- [ ] **Step 3: Commit**

```bash
git add packages/eslint-config
git commit -m "feat(eslint-config): add shared flat eslint config"
```

---

## Task 4: @repo/lottie (핵심 래퍼)

**Files:**
- Create: `packages/lottie/package.json`, `packages/lottie/tsconfig.json`, `packages/lottie/src/Lottie.tsx`, `packages/lottie/src/index.ts`, `packages/lottie/assets/check-success.json`

- [ ] **Step 1: `packages/lottie/package.json`**

```json
{
  "name": "@repo/lottie",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint src"
  },
  "peerDependencies": {
    "lottie-react-native": "*",
    "react": "*",
    "react-native": "*"
  },
  "devDependencies": {
    "@repo/tsconfig": "workspace:*",
    "@repo/eslint-config": "workspace:*",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: `packages/lottie/tsconfig.json`**

```json
{
  "extends": "@repo/tsconfig/base.json",
  "include": ["src"]
}
```

- [ ] **Step 3: `packages/lottie/src/Lottie.tsx` (ref로 play/pause/reset 노출)**

```tsx
import { forwardRef, useImperativeHandle, useRef } from "react";
import LottieView, { type AnimationObject } from "lottie-react-native";
import type { ViewStyle } from "react-native";

export type LottieHandle = {
  play: () => void;
  pause: () => void;
  reset: () => void;
};

export type LottieProps = {
  source: AnimationObject | { uri: string };
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  style?: ViewStyle;
  onAnimationFinish?: (isCancelled: boolean) => void;
};

export const Lottie = forwardRef<LottieHandle, LottieProps>(function Lottie(
  { source, autoPlay = false, loop = false, speed = 1, style, onAnimationFinish },
  ref,
) {
  const inner = useRef<LottieView>(null);

  useImperativeHandle(ref, () => ({
    play: () => inner.current?.play(),
    pause: () => inner.current?.pause(),
    reset: () => inner.current?.reset(),
  }));

  return (
    <LottieView
      ref={inner}
      source={source}
      autoPlay={autoPlay}
      loop={loop}
      speed={speed}
      style={style}
      onAnimationFinish={onAnimationFinish}
    />
  );
});
```

- [ ] **Step 4: `packages/lottie/assets/check-success.json` (간단한 유효 Lottie JSON)**

> 최소 유효 Lottie 문서. 실행 시 빈 50프레임 컴포지션 (이후 사용자가 원하는 애니메이션으로 교체 가능).

```json
{
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 50,
  "w": 200,
  "h": 200,
  "nm": "check-success",
  "ddd": 0,
  "assets": [],
  "layers": []
}
```

- [ ] **Step 5: `packages/lottie/src/index.ts`**

```ts
export { Lottie } from "./Lottie";
export type { LottieHandle, LottieProps } from "./Lottie";
export { default as checkSuccess } from "../assets/check-success.json";
```

- [ ] **Step 6: Commit**

```bash
git add packages/lottie
git commit -m "feat(lottie): add Lottie wrapper with imperative handle + sample asset"
```

---

## Task 5: @repo/ui

**Files:**
- Create: `packages/ui/package.json`, `packages/ui/tsconfig.json`, `packages/ui/src/Button.tsx`, `packages/ui/src/Card.tsx`, `packages/ui/src/index.ts`

- [ ] **Step 1: `packages/ui/package.json`**

```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint src"
  },
  "peerDependencies": {
    "react": "*",
    "react-native": "*"
  },
  "devDependencies": {
    "@repo/tsconfig": "workspace:*",
    "@repo/eslint-config": "workspace:*",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: `packages/ui/tsconfig.json`**

```json
{
  "extends": "@repo/tsconfig/base.json",
  "include": ["src"]
}
```

- [ ] **Step 3: `packages/ui/src/Button.tsx`**

```tsx
import { Pressable, Text, StyleSheet, type ViewStyle } from "react-native";

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Button({ title, onPress, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.base, pressed && styles.pressed, style]}
    >
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  pressed: { opacity: 0.7 },
  label: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
```

- [ ] **Step 4: `packages/ui/src/Card.tsx`**

```tsx
import { View, StyleSheet, type ViewStyle } from "react-native";
import type { ReactNode } from "react";

export type CardProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
```

- [ ] **Step 5: `packages/ui/src/index.ts`**

```ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button";
export { Card } from "./Card";
export type { CardProps } from "./Card";
```

- [ ] **Step 6: Commit**

```bash
git add packages/ui
git commit -m "feat(ui): add Button and Card components"
```

---

## Task 6: apps/todo Expo 앱 생성

**Files:**
- Create: `apps/todo/*` (create-expo-app 산출물)

- [ ] **Step 1: Expo 앱 생성 (비대화형)**

Run: `pnpm dlx create-expo-app@latest apps/todo --template blank-typescript --no-install`
Expected: `apps/todo`에 Expo TS 템플릿 생성

- [ ] **Step 2: 검증 — 핵심 파일 존재 확인**

Run: `ls apps/todo/App.tsx apps/todo/package.json apps/todo/app.json`
Expected: 세 파일 모두 존재

- [ ] **Step 3: Commit**

```bash
git add apps/todo
git commit -m "feat(todo): scaffold expo blank-typescript app"
```

---

## Task 7: apps/todo 모노레포 연결 (Metro + deps + tsconfig)

**Files:**
- Create: `apps/todo/metro.config.js`
- Modify: `apps/todo/package.json`, `apps/todo/tsconfig.json`, `apps/todo/.eslintrc → eslint.config.js`

- [ ] **Step 1: `apps/todo/metro.config.js` 작성 (워크스페이스 해석)**

```js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
```

- [ ] **Step 2: `apps/todo/package.json`에 워크스페이스 의존성 + 스크립트 추가**

`dependencies`에 추가:
```json
"@repo/ui": "workspace:*",
"@repo/lottie": "workspace:*",
"lottie-react-native": "~7.1.0"
```
`devDependencies`에 추가:
```json
"@repo/tsconfig": "workspace:*",
"@repo/eslint-config": "workspace:*"
```
`scripts`에 추가:
```json
"lint": "eslint .",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 3: `apps/todo/tsconfig.json`을 공유 config extends로 변경**

```json
{
  "extends": "@repo/tsconfig/expo.json",
  "compilerOptions": {
    "baseUrl": "."
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

- [ ] **Step 4: `apps/todo/eslint.config.js` 작성**

```js
const config = require("@repo/eslint-config");
module.exports = config.default ?? config;
```

- [ ] **Step 5: 설치 + lottie 호환 버전 정렬**

Run: `pnpm install && pnpm --filter todo exec expo install lottie-react-native`
Expected: 설치 성공, lottie-react-native가 Expo SDK 호환 버전으로 고정

- [ ] **Step 6: 타입체크 검증**

Run: `pnpm --filter todo typecheck`
Expected: 에러 없이 통과

- [ ] **Step 7: Commit**

```bash
git add apps/todo pnpm-lock.yaml
git commit -m "chore(todo): wire app to workspace packages + metro config"
```

---

## Task 8: apps/todo 화면 뼈대 (인터랙션 전 단계)

**Files:**
- Modify: `apps/todo/App.tsx`

- [ ] **Step 1: `apps/todo/App.tsx` — 공용 패키지 import만 검증하는 빈 화면**

```tsx
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { Card } from "@repo/ui";
import { Lottie, checkSuccess } from "@repo/lottie";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Todo</Text>
      <Card>
        <Text style={styles.hint}>여기에 할 일 목록을 함께 만들어봐요.</Text>
      </Card>
      {/* Lottie 래퍼 연결 확인용 (완료 애니메이션은 추후 인터랙션하며 구현) */}
      <View style={styles.lottieSlot}>
        <Lottie source={checkSuccess} style={styles.lottie} />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9", padding: 20, gap: 16 },
  title: { fontSize: 28, fontWeight: "700" },
  hint: { fontSize: 15, color: "#475569" },
  lottieSlot: { alignItems: "center" },
  lottie: { width: 120, height: 120 },
});
```

- [ ] **Step 2: 검증 — 타입체크 통과**

Run: `pnpm --filter todo typecheck`
Expected: 에러 없이 통과

- [ ] **Step 3: 검증 — 앱 번들 시작 (사용자가 직접 실행 확인)**

Run: `pnpm --filter todo exec expo start` (사용자가 디바이스/시뮬레이터에서 빈 화면 + Card 확인)
Expected: Metro 번들 성공, 워크스페이스 패키지 import 에러 없음

- [ ] **Step 4: Commit**

```bash
git add apps/todo/App.tsx
git commit -m "feat(todo): skeleton screen wired to @repo/ui and @repo/lottie"
```

---

## Self-Review 결과

- **Spec coverage:** 루트(T1), tsconfig(T2), eslint(T3), lottie(T4), ui(T5), todo 생성·연결·뼈대(T6-8) — spec의 모든 항목 커버. todo의 할 일 추가/완료/Lottie 재생 로직은 의도적으로 spec의 "todo는 뼈대만 + 인터랙션" 분담에 따라 plan에서 제외.
- **Placeholder scan:** 모든 코드 블록 실제 내용 포함, TODO/TBD 없음.
- **Type consistency:** `Lottie`/`LottieHandle`/`LottieProps`, `checkSuccess`, `Button`/`Card` 이름이 정의(T4/T5)와 사용(T8)에서 일치.
```
