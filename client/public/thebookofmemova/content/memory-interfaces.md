---
page_id: memory-interfaces
book_id: memova-company-memory-book
chapter_id: why-memova
state: FOUNDATION
updated: 2026-07-19
reading_time: "7 min"
summary: "Memova 通过语音、文字、会议与手写接收人的自然输入，以可校准的用户理解组织人物、项目、决策和承诺，再把它们投影为可阅读的 HTML 书页；Memova Pen 仍只是探索中的输入接口。"
sources:
  - docs/product-book/memova-product-book.md
  - memova_user_metacognition_harness_2026-06-30.md
  - memova_product_layer_concept_2026-05-20.md
  - memova_pen_industrial_design_research_2026-05-18_zh.md
  - outputs/research/agent_output_html_knowledge_base_platforms_2026-05-26_zh.md
related_pages:
  - product-model
  - experience-sharing
  - product-system
  - company-foundations
---

# Memory & Interfaces · 记忆如何进入、被理解并成为书页

> **Purpose —** 解释 Memova 如何在不要求用户管理 prompt、agent 或文件夹的前提下，把自然输入转化为可追溯的个人记忆，以及语音、手写、HTML 和探索中的硬件分别处于什么位置。

## Agent Quick Read · 30 秒

Memova 的核心接口不是一个复杂的知识库后台，而是用户已经会做的事：说话、写字、开会、拍照和记录想法。系统把这些输入连接到人物、项目、决策、承诺和历史 context，同时保留来源、置信度与行动边界。当前输入和原始证据始终优先于旧记忆；系统存储可检查的判断字段，而不是隐藏的思维过程。HTML 是记忆的可分享投影，不是唯一知识源。Memova Pen 代表一种可能的手写与音频入口，但它是历史探索，不属于当前 MVP 承诺。

## Authority Boundary · 本页不会重新定义什么

**CURRENT — 以当前产品书为准。** 当前 MVP 面向创业者，首先接收语音和文字，图片作为补充素材；生成私密书页、一个经确认的分享快照、发行素材和自动归入的书。私密默认、公开发行可选、外部分享前由用户确认，均由当前产品定义决定。

**FOUNDATION — 本页的职责。** 本页解释支撑当前定义的记忆模型、用户理解原则和输入/输出接口。

**HISTORICAL / EXPLORATION — 不等于路线图。** 早期硬件、工业设计和训练架构研究只作为来源与设计约束保存，不能被 agent 解释成已经立项、量产或进入当前 MVP。

## 1. Natural Interfaces · 让人继续自然地生活和工作

Memova 的输入层应当贴近人原本的行为，而不是要求人先学会操作 AI。

- **语音与会议：** 捕捉复盘、观点、决策、人物关系和下一步线索。它们是当前创业者 MVP 的主要入口之一。
- **文字与快速笔记：** 允许用户补充事实、纠正推断、固定措辞，并标记哪些内容可以被分享。
- **图片、纸张与白板：** 作为上下文和证据进入书页；识别结果需要保留与原图的关联，不能把推断伪装成原文。
- **手写：** 长期上不仅是 OCR 文本，还可能包含笔画顺序、停顿、压力、位置和与音频同步的时序信息。这是一种有潜力的上下文接口，但不是当前 MVP 的必要依赖。
- **已有视频：** 可以成为页面素材或被重新剪裁、加字幕和封面；当前范围不包含凭空生成新的动态画面。

这些入口共同服务同一个原则：用户在说、写、学习、开会或经营，Memova 在后台把活动变成可阅读、可确认和可积累的记忆。

## 2. Durable Memory Objects · 记忆不是一堆转录

转录、OCR 和原始笔记是证据层，但长期记忆需要能被人和 agent 稳定引用的对象。

| 记忆对象 | 需要保留的内容 | 它帮助回答的问题 |
| --- | --- | --- |
| People · 人物 | 身份、关系历史、偏好、承诺、沟通语境 | 这件事关于谁？怎样的跟进才合适？ |
| Projects · 项目 | 目标、状态、约束、阻碍、相关页面 | 这条信息属于哪一段持续工作？ |
| Decisions · 决策 | 决定、理由、证据、变化时间 | 为什么当时这样做？现在是否仍有效？ |
| Commitments · 承诺 | 谁答应了什么、时间、状态、依赖 | 下一步应该发生什么？谁需要确认？ |
| Events · 事件 | 会议、对话、时间点和参与者 | 哪个场景产生了这段 context？ |
| Pages & Books · 书页与书 | 可阅读叙事、来源、关系、版本状态 | 如何让记忆被保存、分享和再次使用？ |

“书”不是普通文件夹。它把相关书页组织成一个持续演化的主题叙事，并把已经形成的知识重新提供给下一张书页。

## 3. Evidence and Authority · 当前证据优先于旧记忆

Memova 使用历史 context 帮助理解当下，但不能让旧记忆覆盖用户刚刚说过或写下的内容。

推荐的读取顺序是：

```text
当前用户输入与原始证据
  > 本次经过确认的页面事实
  > 近期项目、人物和决策记忆
  > 较旧的辅助记忆与模式推断
```

当来源冲突时，系统应展示冲突、降低置信度或询问用户，而不是静默选择一个答案。一个可复用的记忆至少应说明：它来自哪里、何时产生、关于谁或哪个项目、是事实还是推断、是否经过确认，以及未来 agent 应如何引用它。

## 4. User Metacognition · Agent 需要知道自己对用户理解得有多准

普通记忆回答“用户说过什么”。Memova 更进一步，需要维护一组可检查的用户理解字段：

- 用户明确提出了什么；
- 系统推测用户真正想完成什么；
- 哪些证据支持这个推测；
- 当前置信度和猜错的代价；
- 更合适的响应方式是回答、询问、起草、规划、提醒还是等待；
- 哪些动作必须先获得确认；
- 用户接受、修改、忽略、删除或纠正之后，系统学到了什么。

这些字段应以结构化、可审查的数据保存。产品不需要保存或展示模型的隐藏推理过程；它需要的是结论、证据、置信度和边界。

### Human-led policy

低风险的组织和草拟可以主动准备。发送、公开、排期、承诺或其他高影响动作必须显示最终内容并由用户确认。系统可以多问一次，但不能从低置信度推断直接跨越行动边界。

## 5. Page as an Interface · HTML 是投影，不是源头

Memova 的页面同时服务三类阅读者：

1. **用户本人**阅读完整私密书页，看到来源、背景、推断、敏感内容和下一步。
2. **被授权的人**阅读经用户确认的分享快照。
3. **Agent**通过 canonical Markdown、结构化数据、Page ID、关系和来源重新使用这段记忆。

因此需要保持清晰的方向：

```text
原始证据 + 结构化记忆 + 用户确认
                  ↓
             Canonical Page
                  ↓
         HTML / 长图 / 多图 / 视频 / 平台版本
```

分享 HTML 和社交素材是发行投影。它们可以调整长度、顺序和视觉形式，但不能反向覆盖私密书页，也不能成为事实的唯一存档。

## 6. Memova Pen · 一项被保留的接口探索

**HISTORICAL / EXPLORATION — 非当前产品承诺。** 早期研究设想过一支把手写轨迹、音频和上下文带入 Memova 的书写设备，并探索了“记忆脊柱”等工业设计语言。这些研究没有证明 Memova 应立即制造硬件，也没有进入当前 MVP。

值得保留的不是具体外形或规格，而是四个接口洞见：

- 手写与音频的时间关系可能比单独 OCR 更有语境；
- 录音和同步状态必须清楚可见，不能制造秘密录音感；
- 本地处理、导出和删除能力是信任的一部分；
- 硬件如果存在，应让人更自然地捕捉 context，而不是成为使用 Memova 的门槛。

在软件中的语音、文字和图片闭环得到验证之前，Pen 应继续作为研究分支，而不是公司当前叙事的前提。

## 7. Interface Quality Checks

一个符合 Memova 原则的记忆接口应当通过以下检查：

- 用户能分辨原始证据、系统推断和已确认事实。
- 用户能知道当前内容是私密、待分享还是已经形成分享快照。
- 旧记忆发生冲突时，系统不会覆盖当前证据。
- Agent 可以从 Page ID、来源、关系和状态中安全地重用内容。
- 页面离开原始会话后仍然有上下文，而不是一条孤立链接。
- 高影响动作清楚显示确认边界。
- 输入接口不会因为追求“智能感”而隐藏录音、上传或公开状态。

## Source Labels

**Source of truth — CURRENT:** `docs/product-book/memova-product-book.md`

**Supporting foundation:** `memova_user_metacognition_harness_2026-06-30.md`; `memova_product_layer_concept_2026-05-20.md`

**Supporting evidence:** `outputs/research/agent_output_html_knowledge_base_platforms_2026-05-26_zh.md`

**Historical exploration:** `memova_pen_industrial_design_research_2026-05-18_zh.md`

## Related Pages

- `product-model` — 当前四个核心对象及 source-of-truth 规则。
- `experience-sharing` — 私密页、分享快照和确认边界如何进入完整用户流程。
- `product-system` — 这些接口如何连接 Inbox & Brief、Knowledge Base、Agent Hands 与 Outputs。
- `company-foundations` — 这些接口所遵循的人类主导、local-first 与低认知负担原则。
