---
type: product-book
title: Memova Product Book
subtitle: From private context to shareable pages, books, and a personal library
version: 0.1
date: 2026-07-19
status: team-review
canonical: true
audience: [memova-team, agents]
tags: [memova, product-strategy, page-first, personal-publisher, product-book]
---

# Memova Product Book

> Volume 01 · 从完整 Context 到书页、书与个人图书馆

**状态：** 团队评审版 0.1

**日期：** 2026-07-19

**权威源：** 本 Markdown 文件
**人类阅读投影：** `index.html`

## Agent Quick Context

Memova 正在进行一次小幅但关键的产品方向：从“笔记 → 记忆 → 行动”扩展为“Context → 书页 → 分享/发行 → 书 → 个人图书馆”。HTML 是书页的可视化投影，不是知识源本身。

MVP 面向创业者。用户说约三分钟，Memova 结合其已有项目 context 生成一张私密书页。用户可以只保存，也可以生成一个经过确认的分享 HTML；分享页可由 Memova 好友登录访问，或由外部收件人通过密码访问。用户还可以从同一分享页生成 LinkedIn、TikTok 和 X 的平台素材并确认发布。每张私密书页自动归入一本书，长期构成个人记忆与知识图书馆。

MVP 采用精简模型：每张私密书页最多一个分享快照，不做团队版、投资人版、家人版等多受众内容分支。私密书页更新不会自动改变已经分享的 HTML。平台指标能通过官方权限获取时同步，拿不到时只保存发布状态、时间、链接和 Post ID。

### Confirmed decisions

- Primary user: 创业者；后续扩展到学生和 SMB 老板。
- Primary input: 语音和文字；图片可作为素材。
- Primary output: HTML 书页、长图、多图图文。
- Video boundary: 可处理用户上传的视频，或把图片做成图文视频；不生成新的动态画面或视频帧。
- Core object: Page，不是 Post，也不是文件夹。
- Privacy: 私密书页默认仅用户本人可见。
- Private sharing: 同一分享 HTML 可允许 Memova 好友登录访问，或使用密码访问。
- Public distribution: 可选；用户不需要发布到公域才能获得产品价值。
- Direct-publish priority: LinkedIn → TikTok → X，具体取决于官方审核和权限。
- Book formation: Memova 按项目、主题、人物和时间自动归书，用户可确认、改名或移动。
- Feedback: 能拿到则同步基础指标；不能拿到则降级为发行记录。

### Explicitly later

- 同一私密书页的多受众版本。
- 完整社媒日历和批量排程。
- 评论正文同步、总结和自动回复。
- 九个平台全部直接发布。
- AI 生成全新视频画面。
- 复杂团队审批和权限矩阵。

---

## 1. 第一把尖刀

Memova 原来的核心链路仍然成立：

```text
自然输入 → 结构化记忆 → 行动
```

本次 方向 不是推翻它，而是增加一个更强的使用与增长闭环：

```text
完整 Context
  → 私密书页
  → 分享 HTML / 社媒发行
  → 外部阅读与反馈
  → 自动归书
  → 个人图书馆
  → 为下一张书页提供更好的 Context
```

用户不需要为了“维护知识库”而主动整理知识库。用户只需要继续说、写、学习、开会和经营；Memova 把这些活动转化为可以保存、分享和积累的书页。

### Product positioning

> Memova 是创业者的个人出版社：把每天产生的语音、会议、想法和项目进展，变成可以保存或分享的书页，并逐渐积累成一本本个人知识之书。

Memova 不是另一个社媒 scheduler。Buffer、Later、Publer、Hookle 和 Crosspost 解决“把 Post 发到多个平台”；Memova 解决“如何从一个人的完整 context 中产生值得保存和分享的 Page”。

---

## 2. First User and First Moment of Value

### Primary user

第一位用户是每天产生大量高价值 context、但没有时间把它整理为可分享成果的创业者。

典型输入包括：

- 会后语音复盘
- 产品决策和迭代思考
- 客户或行业观察
- 项目进展与关键转折
- 一段尚未整理的创始人观点

学生和 SMB 老板属于同一长期用户族群，但不是 MVP 首屏主叙事：

- 学生：课堂、论文、读书和项目变成学习书页与作品集。
- SMB 老板：产品知识、客户故事和经营经验变成品牌内容与案例。

### First moment of value

MVP 的成功时刻不是“连接了三个社媒账号”，也不是“创建了一个文件夹”。

> 用户第一次从约三分钟语音得到一张愿意保存或分享给某个人的书页。

公域发布是可选的进一步动作，而不是使用 Memova 的前提。

---

## 3. The Minimal Product Model

MVP 只有四个用户可理解的核心对象。

### 3.1 Private Page · 私密书页

私密书页是知识源和个人记忆的一部分。它可以包含：

- 原始语音及转录
- 用户补充的文字、图片、视频和文件
- 相关项目、人物和历史决策
- Memova 扩展出的背景、观点和行动线索
- 事实来源、推断标记和待确认内容
- 不适合外部分享的敏感信息

默认仅用户本人可见。

### 3.2 Shared Page · 分享书页

每张私密书页在 MVP 中最多只有一个分享快照。用户确认要展示的内容后，Memova 生成一个 HTML 书页。

分享页可见性：

- 仅自己
- 已获授权的 Memova 好友
- 持有密码的外部收件人
- 完全公开

好友访问与密码访问可以同时开启；满足任一条件即可进入。分享页默认不被搜索引擎收录，除非用户明确切换为公开。

### 3.3 Distribution Assets · 发行素材

从同一个分享书页派生：

- 单文件 HTML
- 一张长图
- 多张知识卡
- LinkedIn 文案与多图
- TikTok 图文轮播
- X 单帖或 Thread
- 图片转图文视频
- 用户已有视频的剪裁、字幕、封面和配文

这些素材不是新的知识源，不应反向污染私密书页。

### 3.4 Book · 书

Memova 根据项目、主题、人物和时间，把私密书页自动归入一本书。用户可以确认、改名、移动、合并或拆分。

一本书不是普通文件夹，而是一个持续演化的主题叙事。MVP 首先完成私人自动归书；从部分分享页策展成一册可分享的书，可以作为紧随其后的版本。

---

## 4. Core User Flow

### Step 1 · Capture

用户录制约三分钟语音，也可以补充文字、图片、已有视频或项目资料。

### Step 2 · Understand

Memova 识别相关项目、人物、历史决策、事实来源、可能的敏感信息和需要用户确认的表达。

### Step 3 · Generate the private page

生成完整扩展笔记。用户可以编辑、补充或只保存到私人图书馆。

### Step 4 · Choose a destination

用户选择：

```text
只保存
私域分享 HTML
公域分享 HTML
生成社媒发行素材
```

### Step 5 · Review the shared page

Memova 显示将被分享的最终内容，并提示可能的姓名、客户信息、内部数字、未公开计划和缺少来源的强陈述。用户确认后才生成或更新分享快照。

### Step 6 · Set access

用户选择 Memova 好友、设置访问密码、设置失效时间，或明确设为公开。用户可以随时撤回链接、修改密码或移除好友。

### Step 7 · Optional social distribution

用户预览 LinkedIn、TikTok、X 各自的文案和素材顺序，并逐个平台确认。平台发布失败不影响分享 HTML，也不影响私密书页。

### Step 8 · Auto-book

私密书页自动归入建议的书。用户可以接受或移动。

### Step 9 · Optional feedback

系统永远保存发行状态、时间、链接和 Post ID。平台权限允许时，再异步补充浏览、曝光、点赞、评论数和转发数。

---

## 5. Privacy and Version Rules

### Human-led by default

- 私密书页永远默认私密。
- 不因用户连接社媒账号而自动发布。
- 不因生成分享页而自动公开。
- 每个平台在发布前分别显示账号、内容、可见范围和声明选项。

### Minimal version rule

- 每张私密书页最多一个分享快照。
- 私密书页更新后，分享页保持原状。
- 用户点击“更新分享页”并再次确认后，外部内容才变化。
- 撤回分享页不会删除私密书页。
- 修改某个平台文案不会改变分享页或其他平台版本。
- 一页多受众版本属于后续能力。

### Access rule

- 好友访问每次检查当前 Memova 权限。
- 密码不以明文保存。
- 密码链接可以修改、撤销或设置失效时间。
- 私域页面默认 `noindex, nofollow`。
- 私域媒体不能通过可猜测的永久公开地址绕过页面权限。

---

## 6. Distribution Strategy

### Direct-publish order

1. **LinkedIn**：最符合创业者知识型内容；支持文字、视频、多图和 PDF 文档。
2. **TikTok**：支持视频和图片轮播，但 Direct Post 需要应用审核；未审核客户端受到私密发布和用户数量限制。
3. **X**：发布和指标读取可行，但 API 为付费能力，应纳入套餐成本。

### Graceful fallback

每个平台都必须有三个状态：

```text
Direct Publish     官方接口可用并已获批准
Assisted Publish   素材准备完成，打开平台由用户确认
Export Only        下载或复制平台适配包
```

审核、权限或 API 成本不应阻塞核心的 HTML 书页体验。

### Video boundary

MVP 支持：

- 用户上传已有视频
- 自动剪裁和比例适配
- 字幕、封面、配文
- 图片序列转图文视频
- 可选配音和简单转场

MVP 不支持直接生成全新的动态画面或视频帧。

---

## 7. Feedback Model

### Guaranteed baseline · A

所有平台都保存：

- 平台和账号
- 发布状态
- 发布时间
- Post ID
- 公开链接
- 错误信息和重试状态

### Permission-dependent enrichment · B

能通过官方接口获取时补充：

- 浏览或曝光
- 点赞或 reaction
- 评论数
- 转发或分享数
- 最近同步时间

已确认的能力边界：

- X 可通过 Post metrics 读取公开互动指标。
- TikTok 授权视频可读取播放、点赞、评论和分享数；图片轮播需实际验证。
- LinkedIn 可读取成员帖指标，但需要额外的 Community Management 权限和用户授权。

分析权限不可用时，产品自动退回 A，不显示错误的零数据，也不阻塞发布。

---

## 8. MVP Scope

### Must have

- 创业者语音/文字输入
- 结合现有项目 context 生成私密书页
- 人工编辑和确认
- 单一分享快照
- 单文件或稳定链接 HTML 书页
- Memova 好友访问
- 密码访问、撤回和可选失效时间
- HTML 长图和多图片导出
- LinkedIn、TikTok、X 平台适配预览
- 至少一个平台完成真实直接发布
- 其他平台具备 assisted/export fallback
- 自动归书建议
- 发布记录；指标可用则同步

### Not now

- 多受众分享版本
- 完整内容日历
- 批量账号运营
- 九个平台全部直接发布
- 评论正文回流和自动回复
- 自动社交互动
- 复杂团队审批
- 生成式视频画面
- 以分析仪表盘为主的产品首页

---

## 9. Competitive Position

### Existing category

Buffer、Later、Publer、Hookle、Crosspost、Socialync 等产品已经证明：iOS 端一次准备内容并发布到 LinkedIn、TikTok、X 等平台是可行的。

其中：

- Hookle 最接近移动优先的多平台发布。
- Crosspost 最接近“上传一次、逐平台预览、统一发布”。
- Socialync 最接近面向个人创作者的轻量一键发布。
- Buffer、Publer 和 Later 证明了平台接入、排程和内容库是成熟基础设施。

### Memova's wedge

竞品的基本对象：

```text
素材 → Post → Calendar → Social Platform
```

Memova 的基本对象：

```text
完整 Context → Private Page → Shared Page → Book → Library
                                  └→ Social Distribution
```

竞品是多平台邮局。Memova 应成为个人出版社和私人图书馆。

---

## 10. Success Criteria

### Activation

- 用户完成一次三分钟语音输入。
- 用户得到一张愿意保存或分享的书页。
- 用户完成一次私域分享或至少一个平台发布。

### Quality

- 分享页没有未经确认的敏感信息。
- 用户能理解哪些内容私密、哪些内容正在被分享。
- 私密书页更新不会静默改变外部页面。
- 手机端 HTML、长图和多图素材可读且无裁切。

### Retention signal

- 用户在一周内生成第二张书页。
- 第二张书页能复用第一张书页和项目历史 context。
- 用户开始看到一本书形成，而不需要手工整理文件夹。

### Distribution signal

- 用户愿意把生成的 HTML 发给同事、朋友、家人或投资人。
- 用户愿意把同一页的发行版本发布到 LinkedIn、TikTok 或 X。

---

## 11. Product Book Architecture

本产品书本身遵循 Memova 的产品原则：

```text
Canonical Markdown / structured data
        ↓
Generated HTML book page
        ↓
Team sharing / review / future publication
```

Markdown 是 agent-readable 权威源。HTML 是人类友好的书页投影，可以重新生成，不应成为唯一知识源。

### Planned chapters

1. **Volume 01 · Page-first Personal Publisher** — 本文，产品方向 与 MVP。
2. **Capture and Context** — 语音、文字、图片、视频如何进入私密书页。
3. **Page Generation Protocol** — 事实、推断、引用、敏感信息和人工确认。
4. **Sharing and Permissions** — 好友、密码、公开、撤回、失效和媒体访问。
5. **Books and Library** — 自动归书、跨页关联、策展与长期检索。
6. **Distribution Adapters** — LinkedIn、TikTok、X 与 fallback。
7. **Evaluation and Safety** — 质量、隐私、发布失败和回归测试。

---

## 12. Open Decisions

- 第一版直接发布平台最终是 LinkedIn，还是 LinkedIn + X？
- TikTok Content Posting 审核应在原型前还是原型后启动？
- 分享链接默认是否必须设置失效时间？
- Memova 好友关系如何建立和撤销？
- 分享页更新是否保留可见的版本历史？
- 自动归书的置信度低于多少时必须询问用户？
- 第一版“书”的首页需要哪些最小信息？

---

## 13. Source Notes

Primary official references used in this product direction:

- LinkedIn Posts API: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
- LinkedIn Member Post Statistics: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/members/post-statistics
- TikTok Content Posting API: https://developers.tiktok.com/products/content-posting-api
- TikTok Content Sharing Guidelines: https://developers.tiktok.com/doc/content-sharing-guidelines
- TikTok Video Query: https://developers.tiktok.com/doc/tiktok-api-v2-video-query
- X Create Post: https://docs.x.com/x-api/posts/create-post
- X Metrics: https://docs.x.com/x-api/fundamentals/metrics
- Buffer iOS: https://apps.apple.com/us/app/buffer-plan-schedule-posts/id490474324
- Later iOS: https://apps.apple.com/us/app/later-social-media-scheduler/id784907999
- Publer iOS: https://apps.apple.com/us/app/publer-social-media-tools/id1571680865
- Hookle iOS: https://apps.apple.com/us/app/hookle-social-media-manager/id1330557977
- Crosspost iOS: https://apps.apple.com/us/app/crosspost-social-media-tool/id6740201285
- Socialync iOS: https://apps.apple.com/us/app/socialync/id6758737546
