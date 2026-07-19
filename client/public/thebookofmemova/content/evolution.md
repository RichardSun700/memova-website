---
page_id: evolution
book_id: memova-company-memory-book
chapter_id: how-we-got-here
state: EVIDENCE
updated: 2026-07-19
reading_time: "7 min"
summary: "Memova 从自然输入、结构化记忆和 Agent Hands 的基础架构，经过硬件接口、agent output 与用户对齐研究，在 2026-07-19 汇合为以 Page 为核心、可私域分享并自动成书的当前产品定义。"
sources:
  - docs/product-book/memova-product-book.md
  - memova_agent_notebook_market_research_2026-05-14.md
  - memova_pen_industrial_design_research_2026-05-18_zh.md
  - memova_product_layer_concept_2026-05-20.md
  - outputs/research/agent_output_html_knowledge_base_platforms_2026-05-26_zh.md
  - memova_user_metacognition_harness_2026-06-30.md
related_pages:
  - memova-now
  - product-model
  - company-foundations
  - product-system
  - library-home
---

# Product Evolution · 从自然输入到会生长的产品书

> **Purpose —** 用一条带权威状态的时间线解释 Memova 五月至七月的产品思考如何汇合为当前定义，并明确哪些洞见被保留、哪些仍只是证据或历史探索。

## Agent Quick Read · 30 秒

Memova 没有在 2026-07-19 从“笔记产品”突然变成“发布工具”。五月形成的基础是：人通过自然输入进入 Inbox & Brief，知识库组织人物、项目、决策和承诺，Agent Hands 准备行动，人类保持最终控制。随后，HTML artifact 研究说明 agent 输出需要稳定、私密、可引用的页面；用户元认知研究说明 agent 还必须标记意图、证据、置信度和行动边界。七月的当前定义把这些线索组合成 `Context → Private Page → Shared Page → Book → Library`，社交发行只是可选分支。硬件与工业设计继续作为历史探索，不是当前 MVP。

## Authority Note · 时间线不是投票

本页状态是 **EVIDENCE**。它解释当前产品从哪里来，但不能让较早的概念覆盖当前产品书。

```text
CURRENT · 2026-07-19 产品定义
  > FOUNDATION · 持续有效的公司原则
  > EVIDENCE · 研究与原型观察
  > HISTORICAL · 被保留但未承诺的探索
  > OPEN · 尚未解决的问题
```

旧文档中没有被当前产品书重申的指标、功能范围、硬件规格或市场说法，不应被视为当前事实。

## May 14 · 从 AI Notebook 市场看到 context 缺口

**EVIDENCE**

早期市场研究把 Memova 放在 AI notebook 与 agent notebook 的交界处。核心观察不是“再做一个转录器”，而是会议与笔记只有在进入持续 context、支持后续决策和行动时才产生长期价值。

这一阶段留下的有效问题是：

- 如何让真实互动成为 agent 可用的 context？
- 如何让知识在一次对话之后继续服务人物、项目和承诺？
- 如何避免用户自己搬运上下文、配置 prompt 和管理多个 agent？

市场研究提供方向证据，但不是用户需求已经验证的证明。

## May 18 · 把手写与音频想成环境化入口

**HISTORICAL / EXPLORATION**

Memova Pen 的工业设计研究尝试把书写、录音和传感器组合成“个人记忆仪器”。它强化了一个长期原则：AI 应进入人已经习惯的行为，而不是要求人改变思考方式。

当前仍值得保留的洞见包括：手写和音频可以互相补足语境；录音与同步状态必须可见；隐私控制不能藏在界面深处；硬件应是可选入口，而不是进入 Memova 的门槛。

具体造型、材料、尺寸和原型阶段均属于当时的探索，不代表当前硬件路线、供应链计划或上市承诺。

## May 20 · 形成端到端产品层

**FOUNDATION**

产品层概念明确了 Memova 的基础架构：

```text
Human
  → Inbox & Brief
  → Knowledge Base
  → Agent Hands
  → Outputs
  → Human confirmation
```

它确立了几个至今仍有效的原则：

- 用户通过笔记、语音、会议、手写和真实互动自然进入系统；
- Knowledge Base 组织人物、项目、决策、承诺和事件，而不只是存放文本；
- Agent 是执行伙伴，不应成为用户必须管理的主界面；
- 高影响动作由系统准备、用户确认；
- Memova 的战略位置是 context 与协调层，而不是替代每一种执行工具。

七月的 Page、Book 和 Library 是这个系统的新可见层，并没有替换它。

## May 26 · HTML 从临时输出变成记忆对象

**EVIDENCE**

对 agent output 平台的研究显示，一个正在形成的行为模式：agent 会产出报告、brief、dashboard 或 handoff 页面，人类需要稳定、私密、可浏览的链接，未来 agent 也需要重新引用这些结果。

研究中最重要的缺口不是“怎样托管 HTML”，而是：

- 这个输出关于谁、哪个项目和哪次决策？
- 它基于哪些来源，是否经过人确认？
- 它产生了哪些承诺、风险或下一步？
- 未来 agent 应在什么语境下检索它？

这使 HTML 不再只是漂亮交付物，而成为一个带 provenance、关系和行动面的记忆投影。具体产品与市场观察仅作为研究证据，不等于 Memova 已获得市场验证。

## June 30 · 从记住用户走向校准对用户的理解

**FOUNDATION / ARCHITECTURE EXPLORATION**

用户元认知研究提出：个人 agent 不仅要记住用户说过什么，还要知道自己对用户意图的判断有多确定、依据是什么、猜错的代价有多大，以及应该回答、询问、起草、规划、提醒还是等待。

它为当前页面流程补上了内部控制逻辑：

```text
当前输入 + 历史 context
  → 意图与证据
  → 置信度与风险
  → 响应模式与确认边界
  → 用户接受、修改或纠正
  → 更新可检查的用户模型
```

当前定义保留了其中的人类确认、来源优先级和反馈学习原则。具体训练方法、benchmark 规模和发布门槛仍需单独验证，不属于当前 MVP 承诺。

## July 19 · Page 成为核心产品对象

**CURRENT**

本次产品定义把此前的基础与证据收束为一个创业者能够直接感知的价值循环：

```text
完整 Context
  → 私密书页
  → 经确认的分享 HTML
  → 可选发行素材与平台发布
  → 自动归书
  → 个人图书馆
  → 为下一张书页提供更好的 Context
```

当前产品的关键收束包括：

- 第一位用户是创业者，第一种输入是语音和文字；
- 第一价值时刻是一张用户愿意保存或分享给某个人的书页；
- Page 是核心对象，Post 和文件夹都不是；
- 私密页面是知识源，分享 HTML 是确认后的快照；
- 不发布到公域也能获得完整产品价值；
- LinkedIn、TikTok 和 X 是可选发行目的地，并必须提供不能直发时的 fallback；
- 页面按项目、主题、人物和时间自动形成书，长期构成个人图书馆。

## What Stayed Stable · 没有改变的公司骨架

跨越这些阶段，以下原则保持连续：

1. **Context-first:** AI 应从人的真实互动中理解 context，而不是每次要求用户重新解释。
2. **Human-led:** 系统可以主动整理和准备，但重要发送、公开和承诺由用户确认。
3. **Actionable memory:** 记忆不仅回答发生了什么，也帮助判断接下来做什么。
4. **People and projects:** 人物、项目、决策与承诺比孤立文件更接近真实生活结构。
5. **Local-first and portable:** 长期记忆应可导出、可删除、对 agent 可读，并尽量减少平台锁定。
6. **Low cognitive load:** 用户看到的是平静、可理解的下一步，不是一个需要维护的 AI 控制台。

## What Changed · 当前定义新增的收束

| 过去较抽象的表达 | 当前可感知的产品对象 |
| --- | --- |
| Outputs | 一张可以保存或分享的 Page |
| Knowledge Base | 会自动形成的 Books 与 Library |
| Agent handoff | 带来源、状态和关系的 HTML 书页 |
| Action loop | 分享、发行、反馈与下一张书页的闭环 |
| 广泛候选用户 | 创业者优先，学生与 SMB 后续 |
| 多种可能入口 | 语音和文字优先，其他媒体补充 |

## What Did Not Become Current

以下内容仍不属于当前 MVP：

- 以硬件为前提的产品路线；
- AI 生成新的动态视频画面；
- 九个平台全部直接发布；
- 复杂团队审批和权限矩阵；
- 完整社交媒体日历和自动互动；
- 把历史研究中的指标、benchmark 或工业设计参数当作承诺。

## Evidence Gaps · 仍需真实使用回答

当前方向具有连续的内部逻辑，但仍需产品证据验证：

- 创业者是否愿意从一段短语音生成并保留第一张书页；
- 私域分享是否比公域发布更早、更频繁地产生价值；
- 自动归书是否让用户感到“图书馆正在形成”，而不是制造新的整理负担；
- 人工确认能否在隐私安全与低摩擦之间取得平衡；
- 至少一个平台的真实发行是否能成为增益，而不是分散核心体验。

这些是验证问题，不应被写成已经证明的结果。

## Source Labels

**Source of truth — CURRENT:** `docs/product-book/memova-product-book.md`

**Supporting foundation:** `memova_product_layer_concept_2026-05-20.md`; `memova_user_metacognition_harness_2026-06-30.md`

**Supporting evidence:** `memova_agent_notebook_market_research_2026-05-14.md`; `outputs/research/agent_output_html_knowledge_base_platforms_2026-05-26_zh.md`

**Historical exploration:** `memova_pen_industrial_design_research_2026-05-18_zh.md`

## Related Pages

- `memova-now` — 当前最高权威的产品闭环与创业者 wedge。
- `product-model` — Page、Shared Page、Distribution Assets 与 Book。
- `company-foundations` — 跨阶段保持稳定的公司原则。
- `product-system` — Page → Book → Library 如何扩展原有产品层。
- `library-home` — 从当前定义进入完整的公司记忆图书馆。
