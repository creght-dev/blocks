# Creght 线上站点管理方案

线上站点 `p35l7ulie6he/p35l7ulpwviq` 已作为独立 Creght 工作区放在
`apps/creght-site/`。该目录与 `apps/ai-seo-creght-template/` 是本地维护副本，
已加入 `.gitignore`，不纳入当前仓库提交。本地文件与 Creght 同步状态保留；
可分发组件源码仍在 `registry/creght/` 中维护并提交。

## 目录与职责

| 路径 | 职责 | 来源规则 |
| --- | --- | --- |
| `registry/creght/` | 可分发板块源码 | 板块代码的主来源 |
| `registry.json`、`public/r/` | shadcn Registry 索引与构建产物 | 由根目录脚本生成 |
| `src/` | 本地 Vite 展示与开发入口 | 只服务本地 Registry 开发 |
| `apps/creght-site/components/sections/` | Creght 线上站点使用的板块副本 | 从主来源选择性同步，并保留平台适配 |
| `apps/creght-site/pages/`、`components/library/` | Creght 页面、预览器与站点 UI | 仅在 Creght 工作区维护 |
| `apps/creght-site/data/`、`messages/` | 站点回退数据与双语文案 | 与新增板块同一变更维护 |
| `apps/creght-site/backend/`、`platform/` | Func 与平台数据定义 | 通过 Creght 工作流维护 |
| `apps/creght-site/.creght/` | 远端基线和三方合并状态 | 本地保留，不提交；不要手工改写 |
| `apps/creght-site/AGENTS.md` | CLI 生成的本地协作说明 | 本地保留，并由 `.creghtignore` 排除在线同步 |

根 `package.json` 的 npm 发布白名单没有包含 `apps/`，因此站点工作区不会被打进
`@creght/creght-blocks` 包。

## 为什么不直接合并目录

Creght 的 `pages/`、`talizen.config.ts`、SSR、CMS、Auth 和 Func 都是平台运行模型；
根项目则是 Vite、React Router 和 shadcn Registry。把两套文件放在同一个应用根下会造成
依赖、路由和发布边界混乱。独立的本地工作区便于维护线上站点，同时让 Creght CLI
准确找到自己的 `.creght/state.json`。

## 日常同步

开始工作前先接收在线编辑器中的修改：

```bash
npm run site:pull
```

完成本地修改后先检查，不要直接推送：

```bash
npm run registry:build
npm run site:sync:report
npm run site:diff
```

确认 diff 后再上传到 Creght 远端并打开预览：

```bash
npm run site:push
npm run site:preview
```

`site:push` 只更新远端草稿，不会发布正式站点。正式发布应在预览验收后单独执行，并明确
填写站点 ID。不要在常规脚本里加入自动 publish。

## 新增板块清单

1. 在 `registry/creght/<category>/<section-id>/` 新增或修改板块，先把这里作为源码主来源。
2. 运行 `npm run registry:build`，确认 `registry.json` 和 `public/r/` 正确生成。
3. 把线上要展示的入口文件及其相对依赖同步到
   `apps/creght-site/components/sections/<category>/<section-id>/`。
4. 在 `apps/creght-site/data/sections.ts` 增加板块元数据和回退数据。
5. 在 `apps/creght-site/pages/Preview.tsx` 增加 import 与 `previewComponents` 映射。
6. 为新增标题、描述和交互文案同时更新 `messages/en.json` 与 `messages/zh-CN.json`。
7. 如果首页使用 CMS 数据，再通过 Creght CMS/Content 工作流补充对应内容；不要手改
   `types/cms.d.ts` 或 `types/form.d.ts`。
8. 确认板块元数据里的 `id` 和 `category` 已填写；复制统计会直接使用当前板块目录，禁止再在
   `backend/func/section-usage.ts` 中维护逐板块 ID 白名单。
9. 依次运行同步报告、Creght diff、push 和 preview；验收通过后再发布。

Git 提交包含 Registry 源码及生成产物；Creght 站点接入和对应文案通过本地工作区
同步到平台。新增板块时仍需核对预览映射和线上元数据，避免遗漏。

## 网站模板管理

模板目录由 Creght CMS 的 `templates` 集合管理，前台路由是 `/templates`。模板数量较少时
不设置分类、搜索或分页，CMS 系统 `sort` 就是前台展示顺序，`status` 为 `published` 的内容
才会上架。

新增模板时填写：

- `template_key`：站内唯一标识。
- `title`、`description`：支持中英文的卡片文案。
- `cover_url`：统一使用 16:10 模板封面。
- `pricing_type`：`free` 或 `paid`。
- `price_amount`：收费模板的人民币展示价格；留空时显示“付费模板”。
- `creght_slug`：Creght 模板详情页 slug，例如 `navigation-hub`，前台统一生成
  `https://www.creght.cn/template/<slug>`。
- `preview_url`：仅免费模板使用的在线预览地址。
- `demo_video_url`、`demo_poster_url`：仅收费模板使用的视频演示和视频封面；收费模板不配置
  在线预览地址。
- `new`：控制卡片 NEW 标识。

收费模板的“观看演示”在当前站点内打开视频弹窗，“购买”始终进入 Creght 模板详情，由
Creght 继续处理付费和使用流程。不要在 Blocks 站点重复实现订单、授权或支付状态。

## 当前需要逐步收敛的差异

首次拉取时，线上 `components/sections/` 有 42 个源码文件；根 Registry 有更多尚未接入线上
站点的板块。两边同路径文件中也存在历史差异，主要来自资源 URL、格式和少量平台适配。
`npm run site:sync:report` 会列出这些差异。

不要一次性用任一侧覆盖另一侧。应按板块逐个确认正确图片、依赖和平台兼容性，收敛后再使用
`npm run site:sync:check` 作为严格检查；严格模式会在内容差异或线上独有板块源码存在时失败。

## 冲突与安全规则

- 在线编辑器也有人修改时，先 `site:pull`，让 Creght 做三方合并。
- 出现冲突标记时，先在 `apps/creght-site/` 内执行 `creght resolve --list` 并解决冲突。
- 常规推送不要使用 `--force` 或 `--delete`。
- `.creght/base/` 是安全 diff 所需的基线，`.creght/backup/` 是本地恢复副本；两者随工作区保留在本地，并由 Git 忽略。
- `site:diff` 无变更不代表 Registry 与站点副本一致，两种检查都要运行。
