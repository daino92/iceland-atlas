# Project instructions

Before starting any task in this repository, read
[Frontend Coding Patterns](.agents/skills/coding-patterns/SKILL.md).
Apply all relevant instructions throughout the task and check compliance before
finishing. These are the user's chosen project conventions; prefer them over
conflicting general style recommendations. Explicit user instructions and
higher-priority system/developer instructions still take precedence.

The skill applies to new code and code touched by the current task. Do not perform
unrelated refactors solely to bring legacy files into compliance.

## Project context

- Use pnpm, as declared in `package.json`, and maintain `pnpm-lock.yaml`.
- Read `.vscode/settings.json` and `.vscode/extensions.json` before formatting.
  This project uses Prettier and LF line endings.
- The internal path alias is `@/*` → `src/*`, configured in
  `tsconfig.app.json`. Follow the skill's barrel-import conventions.
- Use Emotion for component styling, with `styled("tag")` syntax. Keep
  `src/styles.css` limited to document defaults and shared CSS variables.
- For application changes, run `pnpm build` and validate affected behavior.
