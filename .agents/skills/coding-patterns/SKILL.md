---
name: coding-patterns
description: >-
  Enforces TypeScript/React coding patterns: const arrow functions, hook style,
  component exports, nested barrel imports, single import per module, handler
  memoization, Emotion styled syntax, Prettier formatting, and package-manager
  consistency. Use when writing or refactoring frontend code in src/, installing
  dependencies, or working on hooks, components, utils, and shared modules.
---

# Frontend Coding Patterns

Apply these patterns for all **new** code and when **touching** existing files.

## Functions and helpers

Use `const` + arrow functions. Do **not** use `function` declarations.

**Avoid:**

```ts
function isValid(value: unknown): value is Item {
  if (!value || typeof value !== "object") return false;
  ...
}
```

**Prefer:**

```ts
const isValid = (value: unknown): value is Item => {
  if (!value || typeof value !== "object") return false;
  ...
};
```

Same rule for exported utilities, type guards, loaders, and savers:

```ts
// avoid
export function clampValue(input: Bounds) { ... }
function loadState(): Settings { ... }

// prefer
export const clampValue = (input: Bounds): Bounds => { ... };

const loadState = (): Settings => { ... };
```

Keep module-private helpers as unexported `const` arrows, placed after imports/constants and before exports.

## Hooks

Always export hooks as const arrows:

```ts
export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);

  const addItem = useCallback((item: Item) => {
    setItems((prev) => [...prev, item]);
  }, []);

  return { items, addItem };
};
```

## Components

Define components as const arrows; export with `export default` at the bottom of the file.

```ts
interface Props {
  children: ReactNode;
}

const PageShell = ({ children }: Props) => {
  ...
  return <>{children}</>;
};

export default PageShell;
```

Colocated subcomponents in the same file follow the same pattern:

```ts
// avoid
function EmptyState() { ... }

// prefer
const EmptyState = () => { ... };
```

## Event handlers and callbacks

Wrap handlers passed to children or used in effect dependency arrays with `useCallback`:

```ts
const removeItem = useCallback((id: string) => {
  setItems((prev) => prev.filter((item) => item.id !== id));
}, []);
```

## Imports and barrel exports

Each major source folder should expose a public API through `index.ts` (barrel file). Typical folders: `components/`, `hooks/`, `utils/`, `context/`, `api/`, `types/`.

Import from the barrel via the `@/` path alias, not deep file paths.

When `tsconfig.json` defines a path alias (commonly `"@/*": ["./src/*"]`), **always** use `@/<folder>` for internal imports — including files inside nested subfolders importing sibling modules.

**Avoid:**

```ts
import Sidebar from "@/components/layout/Sidebar";
import { ListItem } from "./ListItem";
import { formatLabel } from "@/utils/formatters";
import { useAuth } from "@/hooks/useAuth";
```

**Prefer:**

```ts
import { Sidebar, ListItem, emptyStateStyle } from "@/components";
import { formatLabel } from "@/utils";
import { useAuth } from "@/hooks";
import type { User } from "@/types";
```

If the project has **no** `@/` path alias in `tsconfig.json`, use relative paths within the same folder and barrel imports where available.

### One import per module

Use **exactly one** `import` statement per module path in a file. Never import from the same package or alias twice.

**Avoid** (split `@/types`):

```ts
import type { Item, ItemStatus, NotifyType } from "@/types";
import { STATUS_CONFIG, TYPE_CONFIG } from "@/types";
```

**Avoid** (split `react`):

```ts
import { useState, useMemo, forwardRef, type ComponentPropsWithoutRef } from "react";
import type { CSSProperties } from "react";
```

**Avoid** (split external package):

```ts
import { ODSBox, ODSText } from "@telekom-ods/react-ui-kit";
import type { ODSBoxProps } from "@telekom-ods/react-ui-kit";
```

**Prefer** (types only — single `import type`):

```ts
import type { Item, ItemStatus, NotifyType } from "@/types";
```

**Prefer** (mixed types and values — inline `type` in one statement):

```ts
import {
  STATUS_CONFIG,
  TYPE_CONFIG,
  type Item,
  type ItemStatus,
  type NotifyType,
} from "@/types";
```

**Prefer** (react — values + types together):

```ts
import {
  useState,
  useMemo,
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
```

**Prefer** (external package — values + types together):

```ts
import { ODSBox, ODSText, type ODSBoxProps } from "@telekom-ods/react-ui-kit";
```

Same rule applies to every module: `@/api`, `@/hooks`, `@/components`, `react`, `@emotion/react`, etc.

When auditing a file, scan for duplicate `from "…"` paths and merge before finishing.

### Barrel file rules

1. When adding a new **public** hook, util, component, or helper, export it from that folder's `index.ts`.
2. If a barrel is missing, create or extend it when adding exports or when converting imports in a file you are already editing.
3. Default exports are re-exported as named exports:

```ts
// components/layout/index.ts
export { default as Sidebar } from "./Sidebar";
export { ListHeader } from "./ListHeader";
export { emptyStateStyle } from "./typography";
```

4. **Nested barrels**: subfolders with multiple modules get their own `index.ts`. The parent barrel re-exports the subfolder:

```ts
// components/index.ts
export { default as PageShell } from "./PageShell";
export * from "./layout/index";
export * from "./editor/index";
```

On case-insensitive filesystems (Windows), use the `/index` suffix when a sibling file differs only by casing (e.g. `Sidebar.tsx` vs `sidebar/` folder).

5. All internal imports use `@/<folder>` when the path alias is configured — never deep paths (`@/components/foo/Bar`) and never relative sibling paths (`./Bar`) if the symbol is exported from the barrel.
6. Use `import type { X }` when **all** imported symbols are types; otherwise use inline `type` in a single value import.
7. Group imports: external packages → blank line → internal `@/` barrel imports.

## Formatting and editor config

Before finishing a refactor, align with project editor settings so save does not reformat your work.

1. Read `.vscode/settings.json` and `.vscode/extensions.json` if they exist.
2. Use the project's configured formatter (commonly **Prettier** via `esbenp.prettier-vscode`) with `formatOnSave` where enabled.
3. After editing, run the project's format script on changed files (e.g. `npm run format`).
4. Match existing style: line endings, ESLint fixes where configured on save.

Do not hand-format in a style that conflicts with the project formatter.

## Package manager

Before installing, removing, or updating dependencies, detect which package manager the repo uses and **stick to that one**. Do not mix lockfiles or install commands.

### How to detect

Check the repo root (in order of reliability):

| Signal | Package manager |
|--------|-----------------|
| `pnpm-lock.yaml` | **pnpm** |
| `yarn.lock` | **Yarn** |
| `bun.lock` / `bun.lockb` | **Bun** |
| `package-lock.json` (and no lockfiles above) | **npm** |
| `node_modules/.package-lock.json` only | **npm** |

Also check:

- `package.json` → `"packageManager"` field (e.g. `"pnpm@9.0.0"`) — authoritative when present
- CI config (`Jenkinsfile`, `.github/workflows`, etc.) for `npm ci`, `pnpm install`, `yarn install`
- `.npmrc` — may indicate npm/pnpm registry settings but not always the client

If multiple lockfiles exist, prefer the one that matches `packageManager` or the most recently modified lockfile, and flag the conflict to the user — do not add a second lockfile type.

### Commands to use

| Manager | Install dependency | Install all | Run script |
|---------|-------------------|-------------|------------|
| **npm** | `npm install <pkg>` | `npm install` | `npm run <script>` |
| **pnpm** | `pnpm add <pkg>` | `pnpm install` | `pnpm run <script>` |
| **Yarn** | `yarn add <pkg>` | `yarn install` | `yarn <script>` |
| **Bun** | `bun add <pkg>` | `bun install` | `bun run <script>` |

For dev dependencies, use the manager's dev flag (`-D` / `--save-dev` / `add -D` as appropriate).

After adding a package, commit the lockfile that belongs to that manager — never commit a new lockfile type alongside an existing one.

## Types and constants

- Shared types and config maps live in a central types module (e.g. `types/index.ts`).
- File-scoped constants: `UPPER_SNAKE_CASE` (`const STORAGE_KEY = "..."`).
- Prefer `interface` for component props; use `type` for unions and mapped types.

## Styling

Use the project's CSS-in-JS solution (commonly Emotion `styled`) for component layout and visuals. Do not add new global CSS classes or BEM-style rules to shared stylesheets — treat existing global `.css` as legacy to migrate away over time, not to extend.

### Emotion styled syntax

When using Emotion, always use the **string tag** form: `styled("tag")`, not `styled.tag`.

**Avoid:**

```ts
const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
});
```

**Prefer:**

```ts
const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
});
```

With generics/props, keep the string tag:

```ts
const Header = styled("header")<{ $variant: "light" | "dark" }>(
  ({ $variant }) => ({ ... }),
);
```

Do not introduce new CSS-in-JS libraries beyond what the project already uses.

### Hex color literals

Always write hex color values in **uppercase** (`#FFF`, `#E20074`, `#1A1A1A`). This applies everywhere a hex color appears: CSS, Emotion `styled` objects, inline `style`, TypeScript config maps, SVG attributes, and documentation examples.

**Avoid:**

```ts
background: "var(--colours-basic-background, #fff)",
color: "#1a1a1a",
```

**Prefer:**

```ts
background: "var(--colours-basic-background, #FFF)",
color: "#1A1A1A",
```

`rgba()`, `hsl()`, and CSS variables are unchanged; only `#` hex literals use uppercase.

## Legacy code

Some files may still use `function` declarations, `styled.div`, or deep imports instead of barrels. When editing those files, convert **only the code you touch** to the patterns above. Do not do unrelated drive-by refactors.
