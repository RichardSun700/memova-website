---
page_id: product-model
book_id: memova-company-memory-book
chapter_id: first-wedge
state: CURRENT
updated: 2026-07-19
reading_time: 3 minutes
summary: "Memova MVP 由 Private Page、Shared Page、Distribution Assets 和 Book 四个对象组成；知识源保持私密，分享与发行是经确认生成的投影。"
sources:
  - "docs/product-book/memova-product-book.md — 四对象模型、版本规则与归书定义"
  - "docs/superpowers/specs/2026-07-19-memova-company-memory-book-design.md — source/projection 页面演示要求"
related_pages:
  - memova-now
  - experience-sharing
  - library-home
  - product-system
  - memory-interfaces
---

# The Product Model

> **Page 02 · CURRENT · Direct Link · Noindex**
> 一个知识源，多个受控投影，最终形成一本持续演化的书。

## 本页目的

定义 MVP 中用户真正需要理解的四个对象，并明确私人知识源、分享快照、平台素材与长期归书之间的边界。

## Agent Quick Read · 30 秒

Memova 的核心对象是 Private Page。它保存用户原始输入、相关项目与人物 context、来源、推断、待确认表达和不适合外传的信息。用户确认后，可以从它产生一个 Shared Page；MVP 每张私密书页最多一个分享快照，私密页更新不会静默改变已分享 HTML。Distribution Assets 从同一分享内容派生为长图、多图、平台文案或已有视频的适配版本，但不成为新的知识源。Private Pages 按项目、主题、人物和时间自动归入 Book，用户保留确认、改名、移动、合并和拆分权。Page → Book → Library 是长期记忆结构，社媒只是可选出口。

## 四个核心对象

```text
Private Page ──用户确认──> Shared Page ──适配──> Distribution Assets
      │
      └──自动建议归书──> Book ──关联积累──> Personal Library
```

对象之间不是四份平行副本。它们有清楚的权威与生命周期：

1. Private Page 保存最完整的个人 context；
2. Shared Page 是经过删减和确认的外部快照；
3. Distribution Assets 是面向渠道的呈现形式；
4. Book 组织 Private Pages，构成可持续发展的主题记忆。

## 1. Private Page · 私密书页

### CURRENT · 知识源

Private Page 是用户个人记忆的一部分，默认仅本人可见。它可以包含：

- 原始语音及转录；
- 用户补充的文字、图片、已有视频和文件；
- 相关项目、人物、历史决策和前序书页；
- Memova 根据 context 扩展出的背景、观点与行动线索；
- 可追溯的事实来源；
- 明确标记的推断与待确认表达；
- 不适合外部分享的敏感信息。

Private Page 的责任是忠实保存和组织用户 context，而不是提前把一切改写成对外内容。

### 权限原则

- 创建后保持私密；
- 生成分享页不等于公开；
- 连接社媒账号不等于允许发布；
- 撤回分享不删除 Private Page；
- 平台编辑不反向覆盖 Private Page。

## 2. Shared Page · 分享书页

### CURRENT · 确认后的 HTML 投影

用户选择要展示的内容，并确认潜在敏感信息与表达后，Memova 生成一个 HTML 书页。

MVP 的可见性选项包括：

- 仅自己；
- 已获授权的 Memova 好友；
- 持有密码的外部收件人；
- 用户明确设置的完全公开页面。

好友访问与密码访问可以同时开启；满足其中一种授权条件即可访问。私域页面默认不被搜索引擎收录。

### 一个分享快照

MVP 保持模型简单：

- 每张 Private Page 最多对应一个 Shared Page 快照；
- Private Page 更新后，Shared Page 保持原状；
- 只有用户点击更新并再次确认，外部内容才变化；
- 修改平台文案不会改变 Shared Page；
- 团队版、投资人版、家人版等多受众内容分支不在 MVP 中。

这避免“内部记忆被改动后，已经发出的页面在用户不知情时变化”。

## 3. Distribution Assets · 发行素材

### CURRENT · 渠道适配投影

Distribution Assets 从已确认的分享内容派生，而不是重新定义知识源。包括：

- 单文件 HTML 或稳定分享链接；
- 一张可分享的长图；
- 多张知识卡或图文页；
- LinkedIn 文案与多图；
- TikTok 图片轮播或已有视频适配包；
- X 单帖或 Thread；
- 图片序列生成的图文视频；
- 用户已有视频的剪裁、比例适配、字幕、封面和配文。

### 视频边界

MVP 可以重组用户已有的媒体，也可以用静态图片、文字、可选配音和简单转场制作图文视频。MVP 不直接生成全新的动态画面或新视频帧。

### 不反向污染

平台标题、字符限制、标签、图片裁切和视频比例是发行层决策。它们不应改变 Private Page 中的事实、结构和长期记忆。

## 4. Book · 书

### CURRENT · 持续演化的主题叙事

Memova 根据以下信号建议把 Private Page 归入一本书：

- 项目；
- 主题；
- 人物；
- 时间与阶段。

用户可以确认建议，也可以改名、移动、合并或拆分。自动归书减少整理负担，但不剥夺用户的最终控制权。

一本 Book 不是普通文件夹：

- 页面之间保留先后、来源与关联关系；
- 新页面可以调用此前页面提供的项目 context；
- 主题可以随用户持续工作而演化；
- 人和 Agent 都能通过摘要、状态和关系快速理解它。

MVP 首先完成私人自动归书。从一部分 Shared Pages 策展为一册对外分享的书，属于紧随其后的能力，不是当前 MVP 必须完成的对象。

## 权威与更新关系

| 对象 | 主要用途 | 默认可见性 | 是否为知识源 | 更新方式 |
|---|---|---|---|---|
| Private Page | 完整个人 context 与记忆 | 仅自己 | 是 | 用户和 Memova 在私人空间中持续完善 |
| Shared Page | 给指定读者阅读的 HTML 快照 | 私域，用户可明确公开 | 否 | 用户确认后创建或更新 |
| Distribution Assets | 面向具体平台的内容包 | 发布前仅自己 | 否 | 逐平台预览和确认 |
| Book | 组织相互关联的 Private Pages | 默认私密 | 是，作为组织层 | 自动建议，用户可调整 |

## 为什么 HTML 是投影而不是唯一知识源

HTML 适合人类阅读、私域分享、打印和跨设备打开，但它不应承载唯一的产品记忆：

- HTML 可能为某个受众删减敏感信息；
- 页面样式和平台格式会改变；
- 同一知识源需要供 Agent 结构化读取；
- 分享快照必须与不断演化的私人记忆解耦。

因此，本产品书自身也使用相同模型：Markdown 保存 canonical content，HTML 作为可重新生成的人类阅读书页。

## 来源与权威

- **Source of truth：** `docs/product-book/memova-product-book.md`
- **Canonical page：** `docs/product-book/content/product-model.md`
- **Projection：** `docs/product-book/current/product-model.html`
- **Decision boundary：** 所有未决产品选择只进入 `open-questions` 页面。

## 阅读路径

- **上一页：** [Memova Now](memova-now.md)
- **下一页：** [Experience & Sharing](experience-sharing.md)
- **相关页：** `product-system` · `memory-interfaces`
