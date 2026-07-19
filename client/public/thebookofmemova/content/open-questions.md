---
page_id: open-questions
book_id: memova-company-memory-book
chapter_id: how-we-got-here
state: OPEN
updated: 2026-07-19
reading_time: "6 min"
summary: "本页只记录尚未解决的产品选择与验证门槛，并同时列出已经确认和明确延后的边界，防止团队或 agent 把问题、建议或旧探索误读为当前决定。"
sources:
  - docs/product-book/memova-product-book.md
  - docs/superpowers/specs/2026-07-19-memova-company-memory-book-design.md
  - memova_product_layer_concept_2026-05-20.md
  - memova_user_metacognition_harness_2026-06-30.md
related_pages:
  - memova-now
  - product-model
  - experience-sharing
  - product-system
  - library-home
---

# Open Questions · 下一轮需要回答什么

> **Purpose —** 把当前产品定义中的未决选择、所需证据和 review gate 放在一个明确的 OPEN 页面中，同时保护已经确认的决定不被反复打开。

## Agent Quick Read · 30 秒

本页所有问题都处于 **OPEN** 状态，不能被 agent 写成产品事实。创业者优先、语音/文字输入、Page 核心对象、私密默认、一个分享快照、公域可选、自动归书和 LinkedIn → TikTok → X 的发行优先序已经确认。当前仍要决定的是：第一版真实直发做到哪一平台、TikTok 审核何时开始、分享链接默认是否失效、好友关系怎样建立和撤销、分享页是否展示版本历史、低置信度归书何时询问用户，以及第一版 Book 首页最少显示什么。每个问题必须通过相应 review gate，而不是由旧文档或实现便利自动决定。

## How to Read This Page

- **Question** 表示当前产品定义留下的选择，不是建议已经获批。
- **Fixed boundary** 表示讨论不能悄悄推翻的已确认前提。
- **Evidence needed** 表示做决定前需要看到的产品、技术或平台证据。
- **Review gate** 表示最迟在哪个阶段必须作出决定。

如果新证据改变了当前定义，应先更新 canonical product book 和 decision history，再把这里的问题转为有日期、有理由的决定。

## A. Before the Core Prototype

### OQ-01 · 第一版 Book 首页需要显示什么？

**Question — OPEN:** 一本自动形成的书，首页最少需要哪些信息，才能让用户理解它不是普通文件夹？

**Fixed boundary:** Book 按项目、主题、人物和时间形成；用户可以确认、改名、移动、合并或拆分。系统应减少整理负担，而不是制造新的信息架构工作。

**Evidence needed:** 用少量真实页面测试标题、摘要、时间范围、关键人物、页面序列、最新变化和未决问题中哪些真正帮助用户继续工作。

**Review gate:** 在首次展示“自动成书”体验前决定最小信息集；高级封面、复杂目录和公开策展不应阻塞原型。

### OQ-02 · 自动归书在多大不确定性下必须询问用户？

**Question — OPEN:** 系统应该直接接受建议书、给出轻量提示，还是在可能跨项目、跨人物或涉及敏感主题时要求确认？

**Fixed boundary:** 用户拥有最终移动和改名权；低置信度推断不能被静默写成事实。

**Evidence needed:** 真实页面中的误归书类型、用户纠正成本，以及“多问一次”和“先放入建议位置”之间的摩擦差异。阈值应来自评估，而不是在文档中随意设定一个数字。

**Review gate:** 在自动归书从演示进入真实个人资料前明确行为规则和回退位置。

## B. Before Private Sharing Alpha

### OQ-03 · 分享链接是否默认必须失效？

**Question — OPEN:** 密码分享页应默认永久有效、提供可选失效时间，还是对某些敏感类别默认短期有效？

**Fixed boundary:** 用户必须能撤回链接、修改密码或设置失效时间；私密页面默认不被搜索引擎收录；媒体访问不能绕过页面权限。

**Evidence needed:** 创业者实际分享给同事、朋友、家人或投资人时的持续访问需要，以及用户能否理解“撤回链接”和“删除私密书页”是不同动作。

**Review gate:** 在首个外部收件人能够访问分享页之前决定默认值和清晰文案。

### OQ-04 · Memova 好友关系如何建立和撤销？

**Question — OPEN:** 好友访问是通过邀请、现有账号匹配、单向授权，还是其他低摩擦方式建立？撤销后既有页面和未来页面分别怎样处理？

**Fixed boundary:** 好友访问每次检查当前授权；密码访问和好友访问可以并存；当前版本不需要复杂团队角色或权限矩阵。

**Evidence needed:** 最小账号流程、错误邀请与身份混淆风险、撤销后的可解释行为，以及不注册的外部收件人是否可以顺利使用密码路径。

**Review gate:** 好友访问进入实现前。若答案会显著扩大账号或权限系统，第一轮可以先验证密码分享，但不能宣称好友能力已经完成。

### OQ-05 · 分享页更新是否展示版本历史？

**Question — OPEN:** 用户确认“更新分享页”后，收件人是否只看到最新快照，还是需要看到更新时间、变化说明或可访问的旧版本？

**Fixed boundary:** MVP 每张私密书页最多一个当前分享快照；私密页变化不会静默改变外部 HTML；更新外部内容必须再次确认。

**Evidence needed:** 分享给协作者与只读收件人的不同需求、错误更新的恢复方式，以及版本 UI 是否会让“一页一个快照”的简单模型变复杂。

**Review gate:** 在实现分享页更新操作前。可恢复性需要被设计，但多受众分支仍属于 later。

## C. Before Social Distribution Integration

### OQ-06 · 第一版真实直接发布只做 LinkedIn，还是 LinkedIn + X？

**Question — OPEN:** 哪个范围最能验证创业者发行价值，同时不让平台工程压过书页体验？

**Fixed boundary:** LinkedIn → TikTok → X 是当前产品优先序；至少一个平台需要真实直发验证；任何平台都必须有 Direct Publish、Assisted Publish 或 Export Only 的明确 fallback。

**Evidence needed:** 官方应用权限与审核路径、当前 API 成本、图片/多图支持、失败恢复和测试账号条件，以及目标创业者最愿意发布的内容形式。

**Review gate:** 在开始平台 OAuth 和发布适配器实现前。平台可行性结论应来自当时的官方文档与真实测试，而不是旧研究记忆。

### OQ-07 · TikTok Content Posting 审核何时启动？

**Question — OPEN:** 应在产品原型前尽早申请，还是先用 assisted/export 流程验证图文需求后再进入审核？

**Fixed boundary:** TikTok 不是核心 HTML 闭环的前置依赖；未获审核或权限时不能把受限能力描述为完整直发；当前视频范围不包含生成新的动态画面。

**Evidence needed:** 最新官方审核要求、沙箱能力、图片轮播的真实行为、审核周期对路线图的影响，以及用户对 TikTok 图文和图片转视频的实际需求。

**Review gate:** 在承诺任何 TikTok 直发时间之前；原型可以先采用 Export Only 或 Assisted Publish。

## D. Before MVP Evaluation

### OQ-08 · 什么证据足以把“方向成立”升级为“值得继续构建”？

**Question — OPEN:** 激活、质量、留存和发行信号需要怎样组合，才能证明 Page → Book → Library 不是一次性的新鲜感？

**Fixed boundary:** 第一价值时刻是一张用户愿意保存或分享的书页；核心留存信号是用户继续生成页面并复用已有 context；公域发布不是成功前提。

**Evidence needed:** 用户是否完成短语音输入、是否保存或私域分享、是否在之后生成下一页、是否接受或纠正自动归书、是否理解私密页与分享快照的区别。数字阈值应在确定测试规模和使用周期后制定。

**Review gate:** 在 founder prototype 开始前定义记录方式，在首轮真实使用后共同评审，而不是事后选择有利指标。

### OQ-09 · 产品书自己的当前决定如何被更新？

**Question — OPEN:** 当前产品定义变化时，是原位更新并记录 change note，还是发布新的版本页面并保留旧页为 HISTORICAL？

**Fixed boundary:** Markdown / structured data 是权威源，HTML 是可重新生成的阅读投影；agent 必须能够分辨 CURRENT、FOUNDATION、EVIDENCE、HISTORICAL 和 OPEN。

**Evidence needed:** 团队实际评审频率、外部分享链接是否需要稳定、agent 如何引用旧决策，以及原位更新对 provenance 的影响。

**Review gate:** 在下一次改变 CURRENT 产品定义之前。无论采用哪种方式，都不能只改 HTML 而不更新 canonical source。

## Confirmed, Not Open · 当前不要重新讨论

以下内容在当前产品书中是 **CURRENT**，除非出现新证据并正式修改权威源，否则不应被本页重新打开：

- 第一位用户是创业者；学生和 SMB 老板属于后续扩展。
- 主要输入是语音和文字，图片作为补充素材。
- Page 是核心对象；第一价值时刻是一张愿意保存或分享的书页。
- 私密书页默认仅用户本人可见。
- MVP 每张私密书页最多一个当前分享快照。
- 好友登录或密码可以成为私域访问路径；公开发行不是获得价值的前提。
- 私密页更新不会自动改变已经分享的内容。
- Memova 自动建议归书，用户拥有最终编辑权。
- 平台指标不可用时，系统降级为保存发行记录，而不是显示错误的零数据。
- 用户上传视频和图片转图文视频可以支持；生成新的动态画面不在当前范围。

## Explicitly Later, Not an MVP Question

以下能力已经明确延后。它们不是当前 review gate，除非用户重新扩大范围：

- 同一私密书页的多受众内容分支；
- 完整内容日历和批量排程；
- 评论正文同步、总结与自动回复；
- 九个平台全部直接发布；
- 复杂团队审批和权限矩阵；
- AI 生成全新视频画面；
- 以分析仪表盘为主的产品首页；
- 以 Memova Pen 或其他专用硬件作为使用前提。

## Review Gates · 建议的决策顺序

### Gate 1 · Core Prototype

确认 Book 首页最小结构、自动归书的低置信度行为，以及语音/文字到私密书页的完整路径。

### Gate 2 · Private Sharing Alpha

确认密码默认与失效、好友关系的最小实现、更新分享页和恢复错误更新的行为。

### Gate 3 · Distribution Validation

根据最新官方条件选择第一个真实直发平台；为其他平台验证 assisted/export fallback；决定 TikTok 审核时机。

### Gate 4 · Founder Learning Review

共同查看保存、私域分享、下一页生成、context 复用、归书纠正和可选发行信号，再决定是否扩大平台、用户或权限范围。

## Source Labels

**Source of truth — CURRENT:** `docs/product-book/memova-product-book.md`

**Implementation contract — APPROVED:** `docs/superpowers/specs/2026-07-19-memova-company-memory-book-design.md`

**Supporting foundation:** `memova_product_layer_concept_2026-05-20.md`; `memova_user_metacognition_harness_2026-06-30.md`

## Related Pages

- `memova-now` — 已确认的方向、创业者 wedge 与当前循环。
- `product-model` — 不能被开放问题悄悄改变的四个核心对象。
- `experience-sharing` — 分享、隐私、发行和成功标准的当前规则。
- `product-system` — 开放问题所在的产品层与边界。
- `library-home` — 回到全书的权威阅读入口。
