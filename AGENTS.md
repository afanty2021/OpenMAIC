# AGENTS.md — OpenMAIC 工作区指南

OpenMAIC（Open Multi-Agent Interactive Classroom）：AI 互动课堂平台，把主题/文档转化为幻灯片、测验、交互模拟、PBL 等场景，由 AI 老师和 AI 同学实时授课。Next.js 16 (App Router) + React 19 + TypeScript 5 (strict) + Tailwind 4 + Zustand，pnpm monorepo。

## 常用命令

要求 Node >= 22.19.0，pnpm 10（版本已钉死在 package.json）。

```bash
pnpm install            # postinstall 会自动构建所有 workspace 包
pnpm dev                # 开发服务器（需先 cp .env.example .env.local）
pnpm lint               # ESLint（--fix 可自动修复）
pnpm format / pnpm check  # Prettier 写入 / 只检查
npx tsc --noEmit        # 根项目类型检查（不含 packages/*/src、render-service、e2e）
pnpm test               # 根单元测试（vitest，只跑 tests/**/*.test.ts）
pnpm test:e2e           # Playwright E2E
pnpm check:i18n-keys    # i18n 键完整性检查
```

workspace 子包各自有独立 vitest/tsc，改动包内代码时在包目录内跑：

- `packages/@openmaic/{dsl,generation,storage,importer,renderer,editor}`：`pnpm test`、`pnpm typecheck`（dsl/generation/storage 的 typecheck 含 tsconfig.test.json）
- `render-service/`：**用 npm 不用 pnpm**（自带 package-lock.json）：`npm run typecheck && npm test`
- `packages/docs`：独立 docs 子应用，被 pnpm-workspace 排除，有自己的 lockfile

## 目录结构

- `app/` — Next.js App Router 页面与 API 路由（classroom、workbench、workspace、api/*）
- `lib/` — 核心业务：`ai`（LLM 抽象）、`generation`（两阶段生成流水线）、`orchestration`（LangGraph 导演图）、`playback`、`action`（28+ 动作执行）、`agent-runtime`、`choreography`、`server`、`export`、`video-export`、`i18n` 等
- `components/` — React 组件（slide-renderer、scene-renderers、whiteboard、chat、settings、ui）
- `packages/@openmaic/` — `dsl`（文档 schema 契约）、`generation`、`storage`、`importer`、`renderer`、`editor`；另有 vendor 定制包 `pptxgenjs`、`mathml2omml`
- `render-service/` — 独立的 Node 22 + Chromium + FFmpeg 服务，把 Hyperframes 项目渲染成 MP4
- `tests/` — 根单元测试；`e2e/` — Playwright；`scripts/` — CI 辅助脚本
- 路径别名：`@/*` → 仓库根目录

## 架构边界（ESLint 机器强制，别绕过）

1. **LLM 调用唯一入口**：`ai` SDK 只能通过 `lib/ai/llm.ts` 的 `callLLM` / `streamLLM` 使用，禁止任何直接 import（静态、命名空间、动态 `import('ai')` 都会被 lint 拒绝）。
2. **`lib/choreography` 必须纯净**：禁止 `@/` 路径别名，禁止 react / react-dom / gsap 等 DOM/渲染后端导入；只可依赖 `@openmaic/dsl` 和相对路径兄弟模块。
3. **`lib/video-export/*.ts` 根文件**：相对导入只允许 `./…`。
4. **PBL v2 分层**：kernel 不得 import operations/runtime，依赖方向只能是 runtime → kernel。
5. **`@openmaic/dsl` 是契约**：其他包与下游部署都对照它校验；任何收窄现有文档可表达范围的改动都算 breaking change，须谨慎。

## 发布包版本规则（CI 强制）

`dsl`、`storage`、`renderer`、`importer` 会发布到 npm。**同一 PR 内改了这些包的可发布文件，必须 bump 该包 package.json 的 version**，否则 CI 报 `publishable package inputs changed but version did not increase`（判定集见 `scripts/check-package-version-bumps.mjs`）。只改 `docs/`、`test/`、`vitest.config.ts` 无需 bump。不要手动发布，合并后自动 release 并打 `@openmaic/<name>@<version>` tag。

## 代码约定

- **Conventional Commits**：`feat` / `fix` / `docs` / `refactor` / `test` / `chore` / `ci` / `perf` / `style`；分支命名 `feat/`、`fix/`、`docs/`
- **UI 文案必须 i18n**：禁止硬编码面向用户的字符串；locale 在 `lib/i18n/locales/`（zh-CN、en-US、ja-JP、ru-RU、ar-SA），改完跑 `pnpm check:i18n-keys`
- **环境变量**：新增/改名运维向环境变量必须同 PR 更新 `.env.example`（标注可选性、默认值、build 时还是 runtime 读取）
- 提交前跑：`pnpm format` → `pnpm lint --fix` → `npx tsc --noEmit` → 相关 `pnpm test`

## 本仓库特有事项（fork 工作流）

- 本地是 fork：`origin` = afanty2021/OpenMAIC，`upstream` = thu-maic/openmaic。定期 `git fetch upstream && git merge upstream/main -X theirs` 同步；**用户约定：冲突一律以上游为准**。
- `CLAUDE.md` 是本地维护的中文概览文档，内容停留在 v0.2.0（现已 v1.0.x，packages 结构已大改），**已过时，勿作为事实来源**；以本文件和 README.md / CONTRIBUTING.md 为准。
- 根目录 `MEMORY/`、`Plans/`、`docs/`（存放中文分析笔记）是本地未跟踪/忽略的工作目录，不要提交、不要当作项目代码。
