# Creght 板块库（Registry）需求说明

> 参考：[shadcn Registry - Getting Started](https://ui.shadcn.com/docs/registry/getting-started)  
> 关联规范：[registry.json](https://ui.shadcn.com/docs/registry/registry-json)、[registry-item JSON](https://ui.shadcn.com/docs/registry/registry-item-json)

## 已确认决策（摘要）

| 维度 | 决策 |
|------|------|
| 板块类型 | 以 Hero、Pricing、Feature、FAQ 等为方向；**首期上线 5 个 Hero 板块** |
| 技术栈 | **React + TypeScript + Tailwind CSS** |
| UI 基座 | **Tailwind 即可**（不强制依赖 shadcn/ui 组件；按需可在条目中声明 npm 依赖） |
| 安装方式 | **`npx shadcn add <条目 URL>`**（条目与入口 JSON 须符合官方 registry 规范） |
| 分发 / 部署 | **统一走 npm 公共 Registry；所有板块开放使用**（见 §3.4） |
| 可见性 | **源码、预览与 Registry 全部公开** |
| 版本策略 | **灵活**（语义化版本或主干最新均可，实施时任选其一并在文档说明） |
| 文档 | **自建文档站点**（列表、预览、安装说明） |
| 主题 / 风格 | **单一风格**目录（例如 `registry/creght/…`，不做多套 STYLE 分叉） |
| 验收标准 | **在 Creght 主应用（或约定的目标仓库）中能成功使用该板块库** |

> **已更新（2026-09-17）**：不再区分 Pro；所有源码归入当前仓库，列表、预览和复制入口统一开放（复制仍遵循站点的登录要求）。

---

## 1. 背景与目标

### 1.1 背景

Creght 需要一套可分发、可通过工具链安装的「板块」（Section/Block）资源库，按需拉取、组合 Landing / 专题页中的 Hero、定价、特性、FAQ 等区块。

### 1.2 总体目标

- **Registry 兼容性**：导出符合 shadcn **registry-item** 规范的 JSON，支持 **`npx shadcn add <registry 或条目 URL>`**。
- **可追溯与可文档化**：每条板块具备名称、描述、文件清单与依赖声明，便于人类与 LLM 理解用途。
- **可托管**：通过 **npm 发布后**可用的 HTTPS 静态资源（如 **unpkg / jsDelivr** 等）或可返回 JSON 的端点提供服务；按需实现根路径 **Content negotiation**（与官方文档一致）。

### 1.3 术语

| 术语 | 含义 |
|------|------|
| 板块库 | Creght 预置的 Section/Block 集合及元数据 |
| Registry 条目 | 单个可安装单元，对应一个 `*.json` 及关联源码文件 |
| `registry.json` | 库的入口索引，列出所有条目 |

---

## 2. 对齐 shadcn Registry 的必要条件（技术性）

作为本库的**硬性技术约束**。

1. **JSON 合法性**：条目必须符合 **registry-item schema**。
2. **入口文件**：在 Registry 根 URL 提供 **`registry.json`**（以 [registry schema](https://ui.shadcn.com/docs/registry/registry-json) 为准）。
3. **条目结构**：每个 item 包含 `name`、`type`、`title`、`description`、`files`（各 file 含 `path` 与 `type`）。
4. **构建**：使用 **`shadcn build`**（`registry:build`），输出目录与官方一致或可配置。
5. **服务端点**：各条目可被 `…/r/[NAME].json` 等形式访问（具体路径以构建输出为准）。
6. **依赖声明**：在条目中正确使用 **`registryDependencies`** 与 **`dependencies`**（npm 包可使用 `name@version`）。

---

## 3. Creght 产品范围

### 3.1 首期范围（MVP）

- **先做 5 个 Hero 板块**并对外可用（命名、文案、视觉可区分）。
- 中长期按同一 Registry 扩充 **Pricing、Feature、FAQ** 等类型；需求与 Hero 同属「营销/落地页区块」一族。

### 3.2 板块实现约定

- 每个板块可为 **一个或多个 React 组件文件**，可按需包含 `components` / `hooks` / `lib`。
- 条目 `type` 与 shadcn 体系对齐（如 **`registry:block`**）；样式以 **Tailwind** 为主。

### 3.3 目录与命名

- **单一风格路径**：例如 `registry/creght/<section-name>/...`，不维护多套 `STYLE` 变体。
- 导入别名与官方建议一致（如 `@/registry/creght/...`），若 Creght 仓库有别名规则，在消费端与文档中写死一处即可。

### 3.4 发布与消费方式

- **构建**：`registry:build` 生成 JSON 产物。
- **统一 npm Registry**：将完整 `registry.json`、全部构建产物与文档站所需资源发布为 npm 包。消费者通过稳定 HTTPS URL 安装，例如：
  `npx shadcn add https://unpkg.com/<scope>/<pkg>@<version>/registry.json`  
  或对单条目：  
  `npx shadcn add https://unpkg.com/<scope>/<pkg>@<version>/r/<item-name>.json`  
  （实际 URL 以包内结构与发布根目录为准，**文档站点须给出可复制命令**。）
- **统一开放**：不维护 Pro 标签、升级弹窗、Token 或账号权益分层。
- **文档站点**：公开展示全部板块的列表、说明、实时预览与安装方式。
- **源码归属**：全部板块源码统一维护在当前仓库的 `registry/creght/`，不再从私有兄弟仓同步。

### 3.5 验收标准（可测）

1. 完整 `registry.json` 与全部条目 JSON 可被公开 HTTPS 访问，且可被 `shadcn add` 使用。
2. 所有条目都存在于当前 Git 仓库、npm 包和 `public/r` 中，并使用同一安装流程。
3. **至少 5 个 Hero 条目** 在文档站列出并可按需安装。
4. **Creght（目标应用）**：在约定分支/环境中能通过文档说明成功引入并渲染任意板块。

---

## 4. 非目标（MVP）

- **自动支付、账号权益与许可证网关**（后续重新设计时单独实施）。
- **可视化搭建器**（非本期范围）。
- **多套 STYLE 分叉**（已排除；仅单一 `creght` 路径）。

版本策略不设硬性规定；若采用 semver，建议在文档站标明包版本与兼容性说明。

---

## 5. 风险与依赖

- **shadcn CLI / schema 演进**：建议在仓库中锁定 `shadcn` 主版本并在 CI 中校验构建。
- **npm + `shadcn add` URL**：须在发布后对 **unpkg 等 CDN 路径**做一次冒烟验证（首次发布后 URL 是否与文档一致）。
- **Creght 与别名路径**：若 `@/` 映射与模板不一致，在安装说明中给出路径调整或约定。

---

*文档版本：1.0 | 已定稿要点来自产品确认（2026-04-29）*
