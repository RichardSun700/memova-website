---
page_id: experience-sharing
book_id: memova-company-memory-book
chapter_id: first-wedge
state: CURRENT
updated: 2026-07-19
reading_time: 4 minutes
summary: "Memova 先生成私密书页，再由用户决定保存、私域分享或平台发行；确认、版本隔离、访问控制、降级发布与自动归书共同构成 MVP 体验。"
sources:
  - "docs/product-book/memova-product-book.md — 核心流程、隐私、发行、反馈、MVP 与成功标准"
  - "LinkedIn Posts API — https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api"
  - "TikTok Content Posting API — https://developers.tiktok.com/products/content-posting-api"
  - "X Create Post — https://docs.x.com/x-api/posts/create-post"
related_pages:
  - product-model
  - memova-now
  - library-home
  - evolution
  - open-questions
---

# Experience & Sharing

> **Page 03 · CURRENT · Direct Link · Noindex**
> 从一次输入到一张私密书页，再到可选分享、发行与自动归书。

## 本页目的

定义 Chapter 02 的端到端体验、隐私与版本规则、平台降级策略、MVP 范围以及验证产品是否成立的信号。

## Agent Quick Read · 30 秒

用户以约三分钟语音或文字开始，并可补充图片、已有视频与项目资料。Memova 结合历史 context 识别项目、人物、来源、敏感信息和需要确认的表达，先生成默认私密的完整书页。用户可以到此为止，也可以确认一个 Shared Page，并设置 Memova 好友、密码、失效时间或明确公开。用户还可为 LinkedIn、TikTok、X 分别预览并确认平台素材；直发不可用时降级为 Assisted Publish 或 Export Only，不阻塞 HTML。Private Page 自动获得归书建议。系统始终记录发行状态、时间、链接和 Post ID，官方权限允许时再同步基础互动指标。MVP 不做多受众版本、九平台直发、复杂团队审批或生成式动态视频。

## 端到端体验

### Step 1 · Capture

用户录制约三分钟语音或输入文字，也可以补充图片、已有视频和项目资料。

### Step 2 · Understand

Memova 使用用户已有 context，识别：

- 相关项目、人物与前序书页；
- 历史决策和当前阶段；
- 事实来源与推断；
- 可能的姓名、客户信息、内部数字和未公开计划；
- 需要用户确认的强陈述或缺少来源的表达。

### Step 3 · Generate the Private Page

系统生成完整扩展笔记。用户可以编辑、补充，也可以只保存到私人图书馆。

这一步已经完成核心价值，不以分享或发布作为成功前提。

### Step 4 · Choose a Destination

```text
只保存
私域分享 HTML
公域分享 HTML
生成社媒发行素材
```

这些是从同一 Private Page 出发的选择，不是强制漏斗。

### Step 5 · Review the Shared Page

Memova 展示即将对外出现的最终内容，并显式提示潜在敏感信息、未经确认的推断和缺少来源的强陈述。用户确认后才创建或更新分享快照。

### Step 6 · Set Access

用户可以：

- 授权 Memova 好友登录访问；
- 为外部收件人设置访问密码；
- 设置失效时间；
- 明确切换为公开；
- 随时撤回链接、修改密码或移除好友权限。

好友与密码可同时开启；满足任一授权条件即可访问。

### Step 7 · Optional Social Distribution

用户分别预览 LinkedIn、TikTok 和 X 的账号、文案、素材顺序、可见范围及必要声明，再逐个平台确认。任一平台失败都不影响 Shared Page、Private Page 或其他平台。

### Step 8 · Auto-book

Private Page 自动获得一本书的归类建议。用户可以接受、改名或移动；长期由相互关联的页面形成个人记忆与知识图书馆。

### Step 9 · Optional Feedback

系统始终保存发行事实。官方权限允许时，再异步补充可获得的基础互动指标；权限不可用时保持真实的发行记录，不以错误的零数据代替未知数据。

## 隐私与版本规则

### Human-led by default

- Private Page 永远默认私密。
- 连接社媒账号不会触发自动发布。
- 生成 Shared Page 不会自动将其公开。
- 更新 Private Page 不会静默改变已经分享的 HTML。
- 每个平台在发布前分别显示账号、内容、可见范围和声明选项。
- 用户可以在不删除私人记忆的情况下撤回外部访问。

### Minimal version rule

- 每张 Private Page 最多一个 Shared Page 快照。
- 用户点击“更新分享页”并再次确认后，外部内容才变化。
- 修改某个平台文案不会改变 Shared Page 或其他平台版本。
- 同一 Private Page 的团队版、投资人版、家人版等多受众分支不属于 MVP。

### Access rule

- 好友访问每次检查当前 Memova 权限。
- 密码不以明文保存。
- 密码可以修改、撤销，并可设置失效时间。
- 私域页面默认使用 `noindex, nofollow`。
- 私域媒体不能通过可猜测的永久公开地址绕过页面权限。

本地产品书网站只演示这些规则的结构与叙事，不声称已经实现真实身份验证、密码保护或生产访问控制。

## 发行策略

### Direct-publish priority

1. **LinkedIn** — 最符合创业者的知识型内容场景。
2. **TikTok** — 适合图文轮播与已有视频；直接发布受官方审核和权限约束。
3. **X** — 适合短观点与 Thread；接口成本必须计入产品约束。

这是一条当前产品优先级，不是对外部平台长期能力的保证。实现时必须以当时的官方文档、应用审核状态和实际账户权限为准。

### Graceful fallback

每个平台都必须支持三种可识别状态：

```text
Direct Publish     官方接口可用、应用已获批准且用户已授权
Assisted Publish   素材准备完成，打开平台由用户最终确认
Export Only        下载或复制平台适配包
```

平台审核、权限或成本不能阻塞核心 HTML 书页体验。

### Video boundary

MVP 支持用户上传已有视频，并进行剪裁、比例适配、字幕、封面和配文；也支持把图片序列、文字、可选配音和简单转场组合成图文视频。MVP 不生成全新的动态画面或新视频帧。

## 反馈模型

### A · Guaranteed baseline

所有发行都保存：

- 平台和账号；
- 发布状态与发布时间；
- Post ID；
- 公开链接；
- 错误信息和重试状态。

### B · Permission-dependent enrichment

仅在官方接口、应用权限和用户授权允许时，补充平台实际返回的基础互动指标及最近同步时间。

若不可用，产品自动退回 A：

- 不显示虚假的零数据；
- 不把“未知”写成“没有互动”；
- 不阻塞分享或发布；
- 不通过非官方抓取绕过平台权限。

## MVP 范围

### Must have · CURRENT

- 创业者的语音和文字输入；
- 结合现有项目 context 生成 Private Page；
- 人工编辑、敏感信息提示和最终确认；
- 每张 Private Page 一个 Shared Page 快照；
- 单文件或稳定链接 HTML；
- Memova 好友访问；
- 密码访问、撤回与可选失效时间；
- HTML 长图和多图片导出；
- LinkedIn、TikTok、X 平台适配预览；
- 至少一个平台完成真实 Direct Publish；
- 其余平台具备 Assisted Publish 或 Export Only；
- 自动归书建议，用户可确认或移动；
- 完整发行记录，权限允许时同步基础指标。

### Explicitly later · 不是当前承诺

- 同一 Private Page 的多受众版本；
- 完整社媒日历和批量排程；
- 九个平台全部 Direct Publish；
- 评论正文回流、总结与自动回复；
- 自动社交互动；
- 复杂团队审批和权限矩阵；
- AI 生成全新动态视频画面；
- 以分析仪表盘为主的产品首页；
- 从多张 Shared Pages 策展公开书籍的完整体验。

## 成功标准

### Activation

- 用户完成一次约三分钟语音或等价文字输入。
- 用户得到一张愿意保存或分享的书页。
- 用户完成一次私域分享，或至少一个平台发布。

### Quality

- 分享页没有未经用户确认的敏感信息。
- 用户能理解哪些内容仍然私密、哪些内容正在被分享。
- Private Page 更新不会静默改变外部页面。
- 手机端 HTML、长图和多图素材清楚可读且没有关键内容裁切。

### Retention signal

- 用户在一周内生成第二张书页。
- 第二张书页能够复用第一张书页和项目历史 context。
- 用户开始看到一本书形成，而不需要手工整理文件夹。

### Distribution signal

- 用户愿意把生成的 HTML 发给同事、朋友、家人或投资人。
- 用户愿意把同一页的发行版本发布到 LinkedIn、TikTok 或 X。

## 本产品书就是体验验证

这套内部网站以 Memova 自己为用户：

- 原始公司 context 被整理为 canonical Markdown；
- 每个主题成为带 ID、状态、来源和关系的 Page；
- Page 被组成 Chapter 02、Chapter 03 和 Chapter 04；
- HTML 页面成为团队可以阅读和传递的投影；
- `manifest.json` 与 `llms.txt` 让 Agent 沿同一结构快速读取。

因此，团队评审的不只是产品说明，也是在评审 Page → Book → Library 是否真的让人和 Agent 更快理解一个复杂主体。

## 来源与权威

- **Source of truth：** `docs/product-book/memova-product-book.md`
- **Canonical page：** `docs/product-book/content/experience-sharing.md`
- **Projection：** `docs/product-book/current/experience-sharing.html`
- **External dependencies：** 平台能力只以实现时的官方文档、审核状态和账户权限为准。
- **Open decisions：** 统一位于 `open-questions` 页面，不在本页当作已确认功能。

## 阅读路径

- **上一页：** [The Product Model](product-model.md)
- **回到书架：** [Library Home](library-home.md)
- **相关页：** `evolution` · `open-questions`
