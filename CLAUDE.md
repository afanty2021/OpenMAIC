# OpenMAIC - AI 上下文文档

> 最后更新：2026-03-28

## 项目概述

**OpenMAIC**（Open Multi-Agent Interactive Classroom）是一个开源的 AI 互动课堂平台，能够将任何主题或文档转化为丰富的互动学习体验。基于多智能体协作引擎，它可以自动生成演示幻灯片、测验、交互式模拟实验和项目制学习活动——由 AI 教师和 AI 同学进行语音讲解、白板绘图，并与学习者展开实时讨论。

### 核心亮点

- **一键生成课堂** — 描述一个主题或附上学习材料，AI 几分钟内构建完整课堂
- **多智能体课堂** — AI 老师和智能体同学实时授课、讨论、互动
- **丰富的场景类型** — 幻灯片、测验、HTML 交互式模拟、项目制学习（PBL）
- **白板 & 语音** — 智能体实时绘制图表、书写公式、语音讲解
- **灵活导出** — 下载可编辑的 `.pptx` 幻灯片或交互式 `.html` 网页
- **OpenClaw 集成** — 通过 AI 助手在飞书、Slack、Telegram 等 20+ 聊天应用中直接生成课堂

### 学术背景

本项目基于清华大学 MAIC 团队的研究论文发表在 JCST 2026：

> **From MOOC to MAIC: Reimagine Online Teaching and Learning through LLM-driven Agents**
> Journal of Computer Science and Technology, 2026
> DOI: 10.1007/s11390-025-6000-0

---

## 核心功能

### 课堂生成流水线

OpenMAIC 采用两阶段生成流水线：

| 阶段 | 说明 |
|------|------|
| **大纲生成** | AI 分析用户输入，生成结构化的课堂大纲 |
| **场景生成** | 每个大纲条目生成为丰富的场景——幻灯片、测验、交互模块或 PBL 活动 |

### 课堂组件类型

1. **幻灯片（Slides）**
   - AI 老师配合聚光灯和激光笔动作进行语音讲解
   - 支持文本、图片、形状、表格、图表等多种元素
   - 基于 Canvas 的渲染引擎，支持实时编辑

2. **测验（Quiz）**
   - 交互式测验（单选 / 多选 / 简答）
   - 支持 AI 实时判分和反馈

3. **交互式模拟（Interactive）**
   - 基于 HTML 的交互实验，用于可视化、动手学习
   - 物理模拟器、流程图等动态内容

4. **项目制学习（PBL）**
   - 选择角色，与 AI 智能体协作完成结构化项目
   - 包含里程碑和交付物

### 多智能体互动

- **课堂讨论** — 智能体主动发起讨论话题，学习者可随时加入或被点名互动
- **圆桌辩论** — 多个不同人设的智能体围绕话题展开讨论，配合白板讲解
- **自由问答** — 随时提问，AI 老师通过幻灯片、图表或白板进行解答
- **白板** — AI 智能体在共享白板上实时绘图——逐步推导方程、绘制流程图
  - **历史记录** — 白板操作自动保存，支持撤销/重做
  - **自动保存** — 实时保存白板内容到 IndexedDB
  - **平移 & 缩放** — 支持鼠标拖拽平移和滚轮缩放
  - **自动适应** — 一键自动缩放以适应所有内容

---

## 技术栈

### 核心框架

- **Next.js 16** — React 全栈框架，App Router
- **React 19** — UI 框架
- **TypeScript 5** — 类型安全
- **Tailwind CSS 4** — 样式框架
- **pnpm** — 包管理器

### AI & 多智能体

- **LangGraph 1.1** — 多智能体编排框架
- **Vercel AI SDK** — LLM 集成（@ai-sdk/openai, @ai-sdk/anthropic, @ai-sdk/google）
- **OpenAI API** — GPT 系列模型
- **Anthropic Claude** — Claude 系列模型
- **Google Gemini** — Gemini 系列模型（推荐 Gemini 3 Flash）

### 语音 & 媒体

- **TTS 提供商** — OpenAI、Azure、GLM、Qwen
- **浏览器原生 TTS** — 使用 `speechSynthesis` API 进行本地语音播放（无需网络）
- **服务端 TTS 生成** — 预生成课堂所有语音文件，支持长文本自动分段
- **ASR 提供商** — OpenAI、Qwen
- **图片生成** — Seedream、Qwen Image、Nano Banana
- **视频生成** — Seedance、Kling、Veo
- **服务端媒体生成** — 课堂生成时自动预生成图片和视频资源

### 其他核心依赖

- **Zustand** — 状态管理
- **ProseMirror** — 富文本编辑器
- **ECharts** — 图表库
- **KaTeX / Temml** — 数学公式渲染
- **Dexie** — IndexedDB 封装
- **shadcn/ui** — UI 组件库
- **Radix UI** — 无障碍 UI 原语

### 工作区子包

- **pptxgenjs** — 定制化 PowerPoint 生成
- **mathml2omml** — MathML → Office Math 转换

---

## 项目结构

```
OpenMAIC/
├── app/                        # Next.js App Router
│   ├── api/                    #   服务端 API 路由（约 24 个端点）
│   │   ├── generate/           #     场景生成流水线
│   │   ├── generate-classroom/ #     异步课堂生成提交与轮询
│   │   ├── chat/               #     多智能体讨论（SSE 流式传输）
│   │   ├── pbl/                #     项目制学习端点
│   │   └── ...                 #     quiz-grade, parse-pdf, web-search 等
│   ├── classroom/[id]/         #   课堂回放页面
│   └── page.tsx                #   首页（生成输入）
│
├── lib/                        # 核心业务逻辑
│   ├── generation/             #   两阶段课堂生成流水线
│   ├── orchestration/          #   LangGraph 多智能体编排（导演图）
│   ├── playback/               #   回放状态机（idle → playing → live）
│   ├── action/                 #   动作执行引擎（语音、白板、特效）
│   ├── ai/                     #   LLM 服务商抽象层
│   ├── api/                    #   Stage API 门面（幻灯片/画布/场景操作）
│   ├── server/                 #   服务端功能模块
│   │   ├── classroom-generation.ts  # 课堂生成核心逻辑
│   │   └── classroom-media-generation.ts  # 服务端媒体和TTS生成
│   ├── store/                  #   Zustand 状态管理
│   │   └── whiteboard-history.ts  # 白板历史状态管理
│   ├── types/                  #   集中式 TypeScript 类型定义
│   ├── audio/                  #   TTS & ASR 服务商
│   │   ├── tts-utils.ts        # TTS 工具函数（长文本分段）
│   │   ├── browser-tts-preview.ts  # 浏览器原生 TTS 预览
│   │   └── use-tts-preview.ts      # TTS 预览 Hook
│   ├── media/                  #   图片 & 视频生成服务商
│   ├── export/                 #   PPTX & HTML 导出
│   ├── hooks/                  #   React 自定义 Hooks（55+）
│   ├── i18n/                   #   国际化（zh-CN, en-US）
│   └── ...                     #   prosemirror, storage, pdf, web-search, utils
│       └── element-fingerprint.ts  # 元素指纹工具（用于白板历史）
│
├── components/                 # React UI 组件
│   ├── slide-renderer/         #   基于 Canvas 的幻灯片编辑器和渲染器
│   ├── scene-renderers/        #   测验、交互、PBL 场景渲染器
│   ├── generation/             #   课堂生成工具栏和进度
│   ├── chat/                   #   聊天区域和会话管理
│   ├── settings/               #   设置面板（服务商、TTS、ASR、媒体…）
│   ├── whiteboard/             #   基于 SVG 的白板绘图
│   │   ├── whiteboard-history.tsx  # 白板历史记录组件
│   │   └── whiteboard-canvas.tsx   # 白板画布（增强自动保存）
│   ├── agent/                  #   智能体头像、配置、信息栏
│   └── ui/                     #   基础 UI 组件（shadcn/ui + Radix）
│
├── packages/                   # 工作区子包
│   ├── pptxgenjs/              #   定制化 PowerPoint 生成
│   └── mathml2omml/            #   MathML → Office Math 转换
│
├── skills/                     # OpenClaw / ClawHub skills
│   └── openmaic/               #   OpenMAIC 引导式 SOP skill
│
├── configs/                    # 共享常量（形状、字体、快捷键、主题…）
├── public/                     # 静态资源（logo、头像）
└── .env.example                # 环境变量配置模板
```

---

## 核心架构

### 1. 生成流水线 (`lib/generation/`)

两阶段生成流程：

1. **大纲生成** (`outline-generator.ts`)
   - 分析用户输入（主题或文档）
   - 生成结构化的课堂大纲

2. **场景生成** (`scene-generator.ts`)
   - 每个大纲条目生成为具体场景
   - 支持 4 种场景类型：幻灯片、测验、交互式模拟、PBL

### 2. 多智能体编排 (`lib/orchestration/`)

- **导演图** (`director-graph.ts`) — 基于 LangGraph 的状态机
- 管理智能体轮次和讨论流程
- 支持圆桌辩论、课堂讨论等模式

### 3. 回放引擎 (`lib/playback/`)

- 状态机：idle → playing → live
- 驱动课堂回放和实时互动
- 处理用户交互和智能体响应

### 4. 动作引擎 (`lib/action/`)

执行 28+ 种动作类型：
- 语音（TTS）
- 白板绘图/文字/形状/图表
- 聚光灯效果
- 激光笔动画
- 幻灯片导航

---

## API 端点概述

### 课堂生成

- `POST /api/generate-classroom` — 提交异步课堂生成任务
- `GET /api/generate-classroom/[jobId]` — 轮询生成任务状态
- `GET /api/classroom-media/[classroomId]/[...path]` — 获取课堂预生成的媒体文件

### 场景生成

- `POST /api/generate/scene-outlines-stream` — 生成课堂大纲（流式）
- `POST /api/generate/scene-content` — 生成场景内容
- `POST /api/generate/scene-actions` — 生成场景动作序列
- `POST /api/generate/image` — 生成图片
- `POST /api/generate/video` — 生成视频
- `POST /api/generate/tts` — 生成语音

### 多智能体交互

- `POST /api/chat` — 多智能体讨论（SSE 流式传输）

### 其他功能

- `POST /api/parse-pdf` — 解析 PDF 文档
- `POST /api/transcription` — 语音识别
- `POST /api/web-search` — 网络搜索
- `POST /api/quiz-grade` — 测验判分
- `GET /api/azure-voices` — 获取 Azure 语音列表
- `GET /api/server-providers` — 获取服务端配置的服务商
- `POST /api/verify-model` — 验证 LLM 模型配置
- `POST /api/verify-image-provider` — 验证图片生成服务商
- `POST /api/verify-video-provider` — 验证视频生成服务商
- `POST /api/verify-pdf-provider` — 验证 PDF 解析服务商

---

## 开发环境配置

### 环境要求

- **Node.js** >= 20
- **pnpm** >= 10

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/THU-MAIC/OpenMAIC.git
cd OpenMAIC

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入至少一个 LLM API Key

# 4. 启动开发服务器
pnpm dev
```

### 环境变量配置

至少配置一个 LLM 服务商的 API Key：

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Google Gemini（推荐）
GOOGLE_API_KEY=...
```

其他可选配置：
- TTS 服务商（OpenAI、Azure、GLM、Qwen）
- ASR 服务商（OpenAI、Qwen）
- 图片生成（Seedream、Qwen Image、Nano Banana）
- 视频生成（Seedance、Kling、Veo）
- PDF 解析（UnPDF、MinerU）
- 网络搜索（Tavily）

### 推荐模型

- **Gemini 3 Flash** — 效果与速度的最佳平衡
- **Gemini 3.1 Pro** — 最高质量（速度较慢）

设置默认模型：
```env
DEFAULT_MODEL=google:gemini-3-flash-preview
```

---

## OpenClaw 集成

OpenMAIC 集成了 [OpenClaw](https://github.com/openclaw/openclaw)，可以直接在飞书、Slack、Discord、Telegram 等 20+ 聊天应用中生成课堂。

### 安装方式

```bash
# 通过 ClawHub 安装
clawhub install openmaic

# 或手动复制
mkdir -p ~/.openclaw/skills
cp -R /path/to/OpenMAIC/skills/openmaic ~/.openclaw/skills/openmaic
```

### 配置

在 `~/.openclaw/openclaw.json` 中配置：

```jsonc
{
  "skills": {
    "entries": {
      "openmaic": {
        "config": {
          // 托管模式：从 open.maic.chat 获取的访问码
          "accessCode": "sk-xxx",
          // 本地部署模式：本地仓库路径和地址
          "repoDir": "/path/to/OpenMAIC",
          "url": "http://localhost:3000"
        }
      }
    }
  }
}
```

### 使用方式

1. **托管模式** — 在 [open.maic.chat](https://open.maic.chat/) 获取访问码，无需本地部署
2. **本地部署模式** — Skill 会引导你完成 clone、配置和启动

告诉你的 OpenClaw 助手 *"教我量子物理"* — 即可自动生成课堂。

---

## 开发指南

### 核心概念

1. **Stage（舞台）** — 课堂展示的核心区域，包含幻灯片、白板等
2. **Scene（场景）** — 课堂的基本单位，可以是幻灯片、测验、交互或 PBL
3. **Agent（智能体）** — AI 老师或 AI 同学，具有不同的角色和性格
4. **Action（动作）** — 智能体可以执行的操作，如语音、白板绘图等

### 状态管理

使用 Zustand 进行状态管理，主要 stores：
- `classroomStore` — 课堂状态
- `stageStore` — 舞台状态
- `playbackStore` — 回放状态
- `chatStore` — 聊天状态
- `whiteboardHistoryStore` — 白板历史记录状态（新增）

### 自定义 Hooks

项目包含 55+ 自定义 Hooks，位于 `lib/hooks/`：
- `use-scene-generator.ts` — 场景生成
- `use-canvas-operations.ts` — Canvas 操作
- `use-streaming-text.ts` — 流式文本处理
- `use-audio-recorder.ts` — 音频录制
- 更多...

### 国际化

支持中文和英文，配置文件位于 `lib/i18n/`：
- `chat.ts` — 聊天相关
- `generation.ts` — 生成相关
- `settings.ts` — 设置相关
- `stage.ts` — 舞台相关

---

## 导出功能

### PowerPoint 导出

- 可编辑的 `.pptx` 文件
- 包含图片、图表和 LaTeX 公式
- 使用定制化的 pptxgenjs 包

### HTML 导出

- 自包含的交互式网页
- 包含交互式模拟实验
- 支持 HTML 解析器

---

## 许可证

本项目基于 [GNU Affero General Public License v3.0](LICENSE) 开源。

商业授权合作请联系：**thu_maic@tsinghua.edu.cn**

---

## 相关链接

- **在线体验**: https://open.maic.chat/
- **GitHub 仓库**: https://github.com/THU-MAIC/OpenMAIC
- **论文**: [JCST 2026](https://jcst.ict.ac.cn/en/article/doi/10.1007/s11390-025-6000-0)
- **Discord 社区**: https://discord.gg/PtZaaTbH
- **OpenClaw**: https://github.com/openclaw/openclaw

---

## 变更记录

### 2026-03-28 — 同步上游更新 🚀

**合并提交：**
- `01a1d6b` — Merge remote-tracking branch 'upstream/main'

**上游新功能（38个提交，v0.1.0 发布）：**

1. **豆包 TTS 2.0 (火山引擎 Seed-TTS 2.0)** (#283)
   - 新增 Doubao TTS 提供商
   - 更新 `lib/audio/tts-providers.ts`, `lib/audio/constants.ts`

2. **讨论 TTS 语音** (#211)
   - 新增 `lib/hooks/use-discussion-tts.ts` — 讨论场景 TTS Hook
   - 新增 `lib/audio/voice-resolver.ts` — 语音解析器
   - 每个智能体支持独立语音分配

3. **ElevenLabs TTS 提供商** (#134)
   - 新增 ElevenLabs TTS 集成
   - 新增 `public/logos/elevenlabs.svg`

4. **Grok (xAI) 支持** (#113)
   - 新增 Grok 作为 LLM、图片生成和视频生成服务商
   - 新增 `lib/media/adapters/grok-image-adapter.ts`, `grok-video-adapter.ts`
   - 新增 `lib/ai/providers.ts` — 统一提供商抽象层
   - 新增 `public/logos/grok.svg`

5. **演讲模式增强** (#195, #244)
   - 全新演讲语音气泡组件 — `components/roundtable/presentation-speech-overlay.tsx`
   - 新增 `components/roundtable/audio-indicator.tsx` — 音频指示器
   - 改进输入流程和无障碍支持
   - 演讲气泡可折叠（暂停时）

6. **讨论暂停/恢复机制** (#129)
   - 新增 `lib/buffer/stream-buffer.ts` — 缓冲级别暂停
   - 暂停时冻结文本揭示，不中断 SSE 连接

7. **键盘快捷键** (#256)
   - 圆桌讨论支持 T/V/Escape/Space 快捷键

8. **Playwright E2E 测试框架** (#229)
   - 新增 `playwright.config.ts` 和完整 e2e 目录
   - 覆盖课堂交互、生成流程、首页导航等核心场景

9. **Vitest 单元测试** (#144)
   - 新增 `vitest.config.ts` 和 tests 目录
   - 提供商配置、设置同步、设置验证测试

10. **CONTRIBUTING.md** (#190) 和 **CHANGELOG.md**
    - 标准化贡献工作流文档

**Bug 修复（18个）：**
- 修复圆桌呼吸条 CSS 动画冻结和按钮点击问题 (#297, #300, #307)
- 修复演讲气泡底部内边距和折叠问题 (#289)
- 修复快速暂停/恢复时 TTS 片段重叠 (#286)
- 修复全屏对话框渲染位置 (#304, #305)
- 修复输入框打开时 TTS 行为 (#295, #253)
- 修复服务端同步后清除过期的模型/提供商 ID (#232, #137, #266)
- 修复预设课堂智能体泄漏问题 (#248)
- 修复切换课堂时保留预设智能体选择 (#241)
- 修复聊天路由使用客户端发送 key 的安全问题 (#221)
- 修复自定义提供商 providerType 转发 (#114)
- 修复白板 UX 和历史记录 (#235)
- 修复 undefined action.content 导致的白板文字绘制崩溃 (#193)
- 修复生成会话失败后的清理 (#194)
- 修复讨论/QA 请求失败后的 UI 清理 (#128)

**技术改进：**
- 新增 `lib/store/settings-validation.ts` — 设置验证模块
- 新增 `lib/store/settings.ts` (249行增强) — 设置持久化和同步
- 更新 `lib/playback/engine.ts` — 播放引擎改进
- 更新 `lib/orchestration/registry/store.ts` — 编排注册表增强
- 更新 `components/agent/agent-bar.tsx` (719行增强) — 智能体栏重构
- 更新 `components/stage.tsx` (575行增强) — 舞台组件重构
- 更新 `components/roundtable/index.tsx` (963行增强) — 圆桌讨论大幅重构
- 更新 `.gitignore` — 添加 Claude Code 目录忽略

---

### 2026-03-21 — 同步上游更新 🚀

**合并提交：**
- `7c0c015` — Merge remote-tracking branch 'upstream/main'

**上游新功能（5个提交）：**

1. **浏览器原生 TTS 修复** (#153)
   - 修复浏览器原生 TTS 播放问题
   - 新增工具栏 TTS 提供商切换功能
   - 优化 `components/generation/media-popover.tsx` (143行增强)
   - 更新 `lib/playback/engine.ts` — 播放引擎 TTS 支持

2. **i18n 国际化补充** (#168)
   - 添加缺失的 i18n 键：`pdfLoadFailed`, `pdfParseFailed`, `streamNotReadable`
   - 更新 `lib/i18n/generation.ts`

3. **LaTeX 转换类型安全** (#167)
   - 修复 `mml2omml()` 返回值类型安全问题
   - 更新 `lib/export/latex-to-omml.ts`

4. **视频占位符修复** (#117, #123)
   - 防止视频占位符 src 导致 404 请求
   - 更新 `components/element/VideoElement/BaseVideoElement.tsx`
   - 更新 `components/element/VideoElement/index.tsx`

5. **播放速度选项** (#130, #131)
   - 新增 1.25x 播放速度选项
   - 更新 `lib/store/settings.ts`

**其他改进：**
- 更新 `.gitignore` — 添加 `MEMORY` 目录忽略规则

---

### 2026-03-20 — 同步上游更新 🚀

**合并提交：**
- `e44a722` — Merge remote-tracking branch 'upstream/main'

**上游新功能（4个提交）：**

1. **服务端媒体和TTS生成** (#75)
   - 新增 `lib/server/classroom-media-generation.ts` — 服务端媒体生成核心模块
   - 新增 `lib/audio/tts-utils.ts` — TTS 工具函数，支持长文本自动分段
   - 新增 `app/api/classroom-media/[classroomId]/[...path]/route.ts` — 媒体文件服务端点
   - 课堂生成时自动预生成所有图片、视频和TTS音频文件

2. **白板画布增强** (#31)
   - 新增平移功能 — 鼠标拖拽移动画布
   - 新增缩放功能 — 鼠标滚轮缩放画布
   - 新增自动适应功能 — 一键缩放以显示所有内容
   - 优化 `components/whiteboard/whiteboard-canvas.tsx` (529行增强)

3. **幻灯片内容优化** (#85)
   - 修复幻灯片文本过于冗长的问题
   - 防止教师身份信息出现在幻灯片上
   - 更新提示词模板：`slide-content/system.md`, `slide-actions/system.md`

4. **Tavily 搜索修复** (#119, #122)
   - 修复 Tavily 查询超出长度限制的问题
   - 将查询截断至 400 字符限制

**技术改进：**
- 更新 `lib/generation/outline-generator.ts` — 大纲生成优化
- 更新 `lib/i18n/stage.ts` — 舞台相关国际化
- 更新 `lib/orchestration/registry/store.ts` — 编排注册表
- 更新 `skills/openmaic/` — OpenClaw Skill 文档更新
  - 新增 `references/provider-keys.md` — 服务商配置指南
