import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Database,
  FileCheck2,
  Fingerprint,
  FolderOpen,
  KeyRound,
  Layers3,
  LockKeyhole,
  Network,
  ScanLine,
  Server,
  ShieldCheck,
  Clock3,
  GitBranch,
  Search,
} from "lucide-react";
import {
  EnterpriseHeader,
  EnterpriseFooter,
} from "@/components/enterprise/EnterpriseShell";
import { useLegalLanguage } from "@/seo/legalLanguage";
import { KnowledgeFlow } from "@/components/enterprise/KnowledgeFlow";
import { WorkflowTimeline } from "@/components/enterprise/WorkflowTimeline";
import { PermissionDemo } from "@/components/enterprise/PermissionDemo";
import { InstitutionBanner } from "@/components/enterprise/InstitutionBanner";
import { LocalModelLifecycle } from "@/components/enterprise/LocalModelLifecycle";
import "@/styles/enterprise.css";

export default function Enterprise() {
  const language = useLegalLanguage();
  const zh = language === "zh";
  const L = (cn: string, en: string) => (zh ? cn : en);
  const [deployment, setDeployment] = useState(0);
  const [scenario, setScenario] = useState(0);
  const contact = zh ? "/contact?lang=zh" : "/contact";
  const services = [
    {
      icon: BookOpen,
      title: L("企业知识库搭建", "Enterprise knowledge bases"),
      body: L(
        "把分散的文档、会议、客户和项目资料，组织成可追溯、可更新、可供企业 Agent 使用的上下文。",
        "Organize documents, meetings, customers and projects into traceable, updatable context for your teams and enterprise agents."
      ),
      points: [
        L(
          "梳理业务对象、关系与知识结构",
          "Map business objects, relationships and knowledge structure"
        ),
        L(
          "保留原文、版本、引用与来源",
          "Preserve original sources, versions and citations"
        ),
        L(
          "按权限检索，持续更新与纠错",
          "Retrieve within permissions and maintain knowledge over time"
        ),
      ],
    },
    {
      icon: Server,
      title: L("本地模型训练与部署", "Local model training & deployment"),
      body: L(
        "围绕业务与工程任务，选择、训练或微调适合的模型，并将通过验证的算法部署到企业私有环境、厂内服务器或边缘设备。",
        "Select, train or fine-tune models for business and engineering tasks, then deploy validated algorithms in private environments, on site servers or at the edge."
      ),
      points: [
        L(
          "预测、识别与异常检测模型的训练评测",
          "Train and evaluate prediction, recognition and anomaly-detection models"
        ),
        L(
          "专属模型适配、本地推理与接口集成",
          "Dedicated model adaptation, local inference and workflow integration"
        ),
        L(
          "验证效果与延迟，交付监控与版本回退",
          "Validate quality and latency; hand over monitoring and rollback"
        ),
      ],
    },
    {
      icon: Fingerprint,
      title: L("数据收集与授权治理", "Data collection & authorization"),
      body: L(
        "从采集开始确定谁拥有数据、谁可以使用、为了什么目的使用，以及何时停止使用。",
        "Define who owns the data, who can use it, for which purpose and when that access ends, before collection begins."
      ),
      points: [
        L(
          "来源登记、授权范围与用途记录",
          "Source registration, permission scope and purpose records"
        ),
        L(
          "个人、企业与第三方数据分域",
          "Separate personal, company and third-party data"
        ),
        L(
          "撤权、到期与删除规则设计",
          "Design revocation, expiry and deletion rules"
        ),
      ],
    },
    {
      icon: ScanLine,
      title: L("隐私处理与数据工程", "Privacy processing & data engineering"),
      body: L(
        "把文档、影像、传感器与运行记录整理成适合检索、分析或经授权训练的数据集，同时保留处理过程和来源。",
        "Prepare documents, images, sensor readings and operating records for retrieval, analysis or authorized training, with provenance and processing history."
      ),
      points: [
        L(
          "解析、转写／OCR、去重与格式统一",
          "Parsing, transcription / OCR, deduplication and normalization"
        ),
        L(
          "敏感信息识别、脱敏与人工复核",
          "Sensitive-data detection, redaction and human review"
        ),
        L(
          "标注、质量抽检与可追溯交付",
          "Annotation, quality sampling and traceable delivery"
        ),
      ],
    },
  ];
  const stages = [
    {
      icon: FolderOpen,
      title: L("授权采集", "Collect"),
      name: L("先界定可用的数据", "Start with authorized sources"),
      text: L(
        "盘点文档、业务系统、现场传感器与多模态资料；记录来源、责任人、采集目的和授权范围。先从一个明确业务或工程问题开始。",
        "Inventory documents, business systems, site sensors and multimodal material. Record each source, owner, purpose and permission scope. Start with one defined business or engineering problem."
      ),
      output: L(
        "交付：数据目录与授权范围",
        "Output: source inventory & permission scope"
      ),
    },
    {
      icon: ShieldCheck,
      title: L("隐私处理", "Protect"),
      name: L("让隐私边界进入处理流程", "Make privacy part of processing"),
      text: L(
        "按约定规则识别并遮盖敏感内容，将身份映射与处理数据分开保存。对高风险样本安排人工复核，明确保留周期和删除范围。",
        "Identify and redact sensitive content against agreed rules. Separate identity mappings from processed data. Review high-risk samples and define retention and deletion scope."
      ),
      output: L(
        "交付：处理规则与复核记录",
        "Output: processing rules & review records"
      ),
    },
    {
      icon: Layers3,
      title: L("清洗整理", "Prepare"),
      name: L("让数据可用，也可核对", "Make data usable and inspectable"),
      text: L(
        "解析与转写、去重、统一格式，补充标签与业务对象。保留原始证据、处理版本和质量记录，让每次修改都能回查。",
        "Parse, transcribe, deduplicate and normalize data. Add labels and business entities while retaining source evidence, processing versions and quality records."
      ),
      output: L(
        "交付：带来源与版本的数据集",
        "Output: versioned, source-linked datasets"
      ),
    },
    {
      icon: Network,
      title: L("知识建库", "Organize"),
      name: L("从文件集合变成业务上下文", "Connect knowledge to your business"),
      text: L(
        "围绕人员、客户、项目、事件与约束组织知识。检索索引可重建；权限、来源与修订跟随内容，模型输出不能自动替代正式记录。",
        "Organize knowledge around people, customers, projects, events and constraints. Keep indexes rebuildable, with permissions, sources and revisions attached. Model output does not automatically replace approved records."
      ),
      output: L(
        "交付：知识结构与检索证据",
        "Output: knowledge structure & retrieval evidence"
      ),
    },
    {
      icon: FileCheck2,
      title: L("受控应用", "Apply"),
      name: L(
        "把必要的知识交给合适的模型",
        "Send the right context to the right model"
      ),
      text: L(
        "按任务和权限提供必要证据，用于问答、报告、业务辅助或经单独授权的数据应用。检索授权、对外分享与模型训练分别确认。",
        "Supply the necessary evidence for an authorized task: Q&A, reporting, business assistance or separately approved data applications. Retrieval, external sharing and model training require distinct decisions."
      ),
      output: L(
        "交付：应用试点、评测与审计方案",
        "Output: application pilot, evaluation & audit plan"
      ),
    },
  ];
  const modes = [
    {
      name: L("本地／边缘", "On premises / edge"),
      title: L("在你控制的环境内处理", "Process within your environment"),
      text: L(
        "评估在企业内网、厂内服务器或边缘设备部署存储、检索与模型推理，匹配现场算力、接口与维护条件。离线范围需覆盖模型、依赖、日志与全部处理组件，并逐项验证。",
        "Evaluate storage, retrieval and inference on company networks, site servers or edge devices, matching compute, integration and maintenance needs. Verify offline behavior across models, dependencies, logs and every processing component."
      ),
      facts: [
        L("企业设备与网络边界", "Company-controlled devices and network"),
        L(
          "目标硬件上的效果与延迟评测",
          "Quality and latency tests on target hardware"
        ),
        L(
          "分阶段上线、回退与运维交接",
          "Staged release, rollback and operations handover"
        ),
      ],
    },
    {
      name: L("企业私有环境", "Private environment"),
      title: L(
        "统一服务，隔离数据与访问",
        "Shared services, controlled access"
      ),
      text: L(
        "按企业要求规划专属服务器或私有云环境，将身份、权限、数据存储与模型执行分层部署。明确租户隔离、管理员职责、密钥管理和网络出站范围。",
        "Plan dedicated servers or a private cloud environment. Separate identity, permissions, storage and model execution. Agree tenant isolation, administrator responsibilities, key management and network egress."
      ),
      facts: [
        L(
          "专属服务与身份接入设计",
          "Dedicated services and identity integration"
        ),
        L(
          "传输／存储加密与密钥管理",
          "Transport / storage encryption and key management"
        ),
        L(
          "容量、并发与可恢复性验证",
          "Capacity, concurrency and recovery validation"
        ),
      ],
    },
    {
      name: L("受控混合部署", "Controlled hybrid"),
      title: L(
        "本地知识，按需调用云端模型",
        "Local knowledge, approved cloud inference"
      ),
      text: L(
        "保留本地或私有环境中的原始知识，仅向指定云端模型发送本次任务批准的上下文。明确接收方、日志、保留策略和成本；本地加密不等于云端推理不可见。",
        "Keep source knowledge locally or privately and send only task-approved context to a selected cloud model. Specify recipients, logging, retention and cost. Local encryption does not make submitted content invisible to cloud inference."
      ),
      facts: [
        L("任务级模型路由", "Task-level model routing"),
        L("发送前最小化与脱敏", "Minimization and redaction before sending"),
        L("单独确认外部处理范围", "Explicit approval for external processing"),
      ],
    },
  ];
  const cases = [
    {
      label: L("企业运营", "Business operations"),
      title: L(
        "项目与客户知识，不随交接丢失",
        "Keep project knowledge through every handover"
      ),
      input: L(
        "会议、项目资料、客户记录与业务规则",
        "Meetings, project files, customer records and business rules"
      ),
      process: L(
        "按项目关联来源、决策、责任人与待办，区分已确认信息和待核实结论。",
        "Connect sources, decisions, owners and actions by project; distinguish confirmed information from conclusions awaiting review."
      ),
      outcome: L(
        "有来源的项目简报、交接材料与内部问答",
        "Source-linked briefs, handover material and internal Q&A"
      ),
    },
    {
      label: L("研发与专业服务", "Research & professional teams"),
      title: L(
        "让专业资料成为可验证的回答",
        "Turn specialist material into verifiable answers"
      ),
      input: L(
        "技术文档、研究资料、历史方案与经验记录",
        "Technical documentation, research, previous proposals and team experience"
      ),
      process: L(
        "统一版本和术语，保留出处、日期与冲突信息，按团队权限组织检索证据。",
        "Align versions and terminology; retain dates, sources and conflicts; organize retrieval evidence within team permissions."
      ),
      outcome: L(
        "带引用的检索、方案对照与研究报告草稿",
        "Cited search, proposal comparisons and research drafts"
      ),
    },
    {
      label: L("工业与工程", "Industrial & engineering"),
      title: L("让现场数据服务生产效率", "Put operational data to work."),
      input: L(
        "设备与传感器数据、检测影像、运行记录与工程规程",
        "Equipment and sensor data, inspection images, operating records and engineering procedures"
      ),
      process: L(
        "关联现场数据与工程知识，完成清洗标注、算法训练和独立评测，在厂内或边缘环境分阶段验证。",
        "Connect operating data with engineering knowledge. Prepare and label datasets, train and independently evaluate algorithms, then validate in stages on site or at the edge."
      ),
      outcome: L(
        "质量检测、设备状态预警与工程分析辅助；以现场质量、响应时间和运行成本检验价值。",
        "Quality inspection, equipment condition alerts and engineering analysis, assessed through site quality, response time and operating cost."
      ),
    },
    {
      label: L("具身与多模态数据", "Embodied & multimodal data"),
      title: L(
        "把情境、授权和质量一起交付",
        "Deliver context, permissions and quality together"
      ),
      input: L(
        "经授权的语音、视频、动作示范与环境事件",
        "Authorized audio, video, action demonstrations and environment events"
      ),
      process: L(
        "按任务规划采集、时间对齐、敏感片段处理与标注，保留授权范围和质量记录。",
        "Scope collection, temporal alignment, sensitive-segment treatment and annotation by task, retaining permission scope and quality records."
      ),
      outcome: L(
        "用于约定研究或应用的可追溯数据集",
        "Traceable datasets for the agreed research or application"
      ),
    },
  ];
  const faqs = [
    [
      L(
        "知识库搭建一定需要训练专属模型吗？",
        "Does a knowledge base require a custom-trained model?"
      ),
      L(
        "不一定。可以先采用授权数据整理与 RAG 检索，让现有模型使用可追溯的证据。模型微调属于独立范围，需要另外确认数据使用权、目标、评测和成本。",
        "No. Start with authorized data preparation and RAG so an existing model can work with traceable evidence. Fine-tuning is a separate scope with its own data rights, objectives, evaluation and cost."
      ),
    ],
    [
      L(
        "本地训练和本地部署是一回事吗？",
        "Are local training and local deployment the same?"
      ),
      L(
        "不是。训练或微调用授权数据调整模型；部署是在目标设备运行已验证的模型。知识库检索、任务算法与大语言模型适配分别评估，不默认从零训练大模型。训练地点、算力、数据是否出站与上线验收在项目中分别约定。",
        "No. Training or fine-tuning changes a model using authorized data; deployment runs a validated model on target hardware. Knowledge retrieval, task-specific algorithms and language-model adaptation are evaluated separately, without assuming foundation-model training from scratch. Agree the training location, compute, data egress and release criteria separately."
      ),
    ],
    [
      L(
        "个人资料会自动进入公司知识库吗？",
        "Does personal data automatically enter the company knowledge base?"
      ),
      L(
        "不会把个人使用理解为企业授权。方案需要分别界定个人、企业及第三方资料的权属与用途，共享内容按明确范围接入。",
        "Personal use is not company authorization. Define ownership and purpose separately for personal, company and third-party material, and connect shared content only within an explicit scope."
      ),
    ],
    [
      L(
        "加密、脱敏与离线部署如何确认？",
        "How are encryption, redaction and offline operation verified?"
      ),
      L(
        "在项目方案中逐项列明存储与传输、密钥责任、可访问的角色、外部处理方、脱敏规则和备份范围，并用业务样例验证。脱敏可能遗漏，离线需要覆盖完整链路，不能只凭某个模型在本地运行作判断。",
        "Specify storage and transport controls, key responsibilities, authorized roles, external processors, redaction rules and backup scope in the project plan, then verify against business examples. Redaction can miss content; offline operation requires validating the entire chain, not just a local model."
      ),
    ],
    [
      L("如何开始一个企业项目？", "How do we start an enterprise project?"),
      L(
        "先确定一个业务场景、数据来源和授权范围，再约定试点交付与验收标准。企业建库、专属模型和多模态数据服务按项目评估，具体功能与安全控制以双方确认的方案为准。",
        "Choose one workflow, its sources and permission scope, then agree pilot deliverables and acceptance criteria. Knowledge-base, dedicated model and multimodal data services are scoped per project; features and security controls follow the agreed solution."
      ),
    ],
  ];
  return (
    <div className="enterprise-page" data-no-translate id="top">
      <EnterpriseHeader zh={zh} contact={contact} />
      <main>
        <section className="ent-hero">
          <div className="ent-shell">
            <p className="ent-eyebrow">
              <span className="ent-status-dot" />
              MEMOVA FOR BUSINESS
            </p>
            <h1>
              {L("企业知识库与私有 AI", "Enterprise knowledge.")}
              <br />
              <span>
                {zh ? (
                  <>
                    <span className="ent-hero-phrase">让经验成为</span>
                    <span className="ent-hero-phrase">下一步的力量。</span>
                  </>
                ) : (
                  "Built for your next move."
                )}
              </span>
            </h1>
            <p className="ent-lead">
              {L(
                "连接企业知识与现场数据，从授权治理到模型训练、本地部署，让团队与 AI 一起推进业务。",
                "Connect company knowledge and operational data, from permission-aware preparation to model training and local deployment."
              )}
            </p>
            <div className="ent-actions">
              <a className="ent-button" href={contact}>
                {L("咨询企业方案", "Discuss your project")}
                <ArrowUpRight size={17} />
              </a>
              <a className="ent-text-link" href="#applications">
                {L("探索应用场景", "Explore applications")}
                <ArrowDown size={16} />
              </a>
            </div>
          </div>
        </section>
        <section
          className="ent-flow-band"
          aria-label={L(
            "从资料到业务结果",
            "From sources to business outcomes"
          )}
        >
          <div className="ent-shell">
            <KnowledgeFlow zh={zh} />
            <div className="ent-principles">
              <span>
                <ShieldCheck size={17} />
                {L("授权先于使用", "Permission before use")}
              </span>
              <span>
                <BookOpen size={17} />
                {L("知识保留来源", "Knowledge with provenance")}
              </span>
              <span>
                <Server size={17} />
                {L("部署按需设计", "Deployment by design")}
              </span>
            </div>
          </div>
        </section>

        <section className="ent-benefits ent-shell" id="benefits">
          <div className="ent-section-heading ent-heading-centered">
            <p className="ent-eyebrow">KNOWLEDGE THAT WORKS FOR YOU</p>
            <h2>
              {L("不是再存一份文件，", "Not another place to store files.")}
              <br />
              <span>
                {L(
                  "而是让已有的知识产生价值。",
                  "A better way to put knowledge to work."
                )}
              </span>
            </h2>
            <p>
              {L(
                "让资料查找、经验交接与工程分析持续复用，用可核对的数据改进工作与生产流程。",
                "Reuse information, team experience and engineering analysis. Improve work and production workflows with inspectable data."
              )}
            </p>
          </div>
          <div className="ent-benefit-grid">
            {[
              {
                icon: Search,
                title: L("少找资料，多推进工作", "Find answers. Keep moving."),
                text: L(
                  "让分散文档与业务对象关联，找到答案，也找到负责的人与原始出处。",
                  "Connect scattered material to projects and people. Find the answer, its source and its owner."
                ),
                metric: L(
                  "试点验证：资料查找耗时",
                  "Pilot measure: time to find information"
                ),
              },
              {
                icon: GitBranch,
                title: L(
                  "经验复用，工程更高效",
                  "Reuse expertise. Improve operations."
                ),
                text: L(
                  "关联工程规程、运行记录与模型分析，辅助排查与质量判断，减少重复整理和从头分析。",
                  "Connect procedures, operating records and model analysis to support troubleshooting and quality decisions, with less repeated preparation."
                ),
                metric: L(
                  "试点验证：工程响应、返工与质量",
                  "Pilot measure: response time, rework and quality"
                ),
              },
              {
                icon: ShieldCheck,
                title: L(
                  "让该用的数据用起来",
                  "Unlock data without losing control."
                ),
                text: L(
                  "按人员、用途与期限提供必要资料，读取、分享与训练分别授权。",
                  "Provide the necessary data by person, purpose and time. Authorize retrieval, sharing and training separately."
                ),
                metric: L(
                  "试点验证：越权与撤权测试",
                  "Pilot measure: access and revocation tests"
                ),
              },
            ].map(item => (
              <article key={item.title}>
                <div className="ent-benefit-icon">
                  <item.icon size={23} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span>
                  <Clock3 size={14} />
                  {item.metric}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="ent-services ent-shell" id="services">
          <div className="ent-section-heading">
            <p className="ent-eyebrow">01 / {L("服务范围", "WHAT WE BUILD")}</p>
            <h2>
              {L(
                "从数据基础，到企业应用",
                "From data foundations to useful applications."
              )}
            </h2>
            <p>
              {L(
                "以一个明确的业务问题为起点，组合知识、数据与模型服务。",
                "Start with a defined business problem. Bring together the knowledge, data and model services it needs."
              )}
            </p>
          </div>
          <div className="ent-service-grid">
            {services.map((s, i) => (
              <article key={s.title}>
                <div className="ent-service-top">
                  <s.icon size={24} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <ul>
                  {s.points.map(point => (
                    <li key={point}>
                      <Check size={15} />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="ent-pipeline-band" id="data">
          <div className="ent-shell">
            <div className="ent-section-heading">
              <p className="ent-eyebrow">
                02 / {L("数据生命周期", "THE DATA LIFECYCLE")}
              </p>
              <h2>
                {L(
                  "授权跟随数据，贯穿每一步",
                  "Permissions travel with the data."
                )}
              </h2>
              <p>
                {L(
                  "从采集到应用，来源、用途、权限与版本都应当能被核对。",
                  "Make sources, purpose, permissions and revisions inspectable from collection through application."
                )}
              </p>
            </div>
            <WorkflowTimeline stages={stages} />
            <div className="ent-authorization-note">
              <LockKeyhole size={21} />
              <div>
                <h4>
                  {L(
                    "读取、分享、训练，分别授权",
                    "Read, share and train: separate permissions."
                  )}
                </h4>
                <p>
                  {L(
                    "采集授权不自动等于训练授权。个人上下文不自动成为组织资产。撤权与删除也需要覆盖索引、缓存和约定的备份范围。",
                    "Permission to collect is not permission to train. Personal context does not automatically become company property. Revocation and deletion must address indexes, caches and the agreed backup scope."
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="ent-shell ent-knowledge">
          <div className="ent-knowledge-copy">
            <p className="ent-eyebrow">THE MEMOVA CONTEXT LAYER</p>
            <h2>
              {L(
                "知识持续积累，模型按需选择",
                "Knowledge that lasts beyond a model."
              )}
            </h2>
            <p>
              {L(
                "知识库承载企业的资料、关系和历史，模型承担具体任务。更换模型，不应意味着重新建立全部业务上下文。",
                "Your knowledge base holds business material, relationships and history. Models handle specific tasks. Changing a model should not mean rebuilding all that context."
              )}
            </p>
            <dl>
              <div>
                <dt>{L("来源与事实层", "Sources & records")}</dt>
                <dd>
                  {L(
                    "原文、责任人、修订与引用",
                    "Original material, owners, revisions and citations"
                  )}
                </dd>
              </div>
              <div>
                <dt>{L("知识与检索层", "Knowledge & retrieval")}</dt>
                <dd>
                  {L(
                    "业务对象、稳定链接与权限过滤",
                    "Business entities, stable links and permission filtering"
                  )}
                </dd>
              </div>
              <div>
                <dt>{L("模型与应用层", "Models & applications")}</dt>
                <dd>
                  {L(
                    "必要证据、任务路由与反馈复核",
                    "Necessary evidence, task routing and reviewed feedback"
                  )}
                </dd>
              </div>
            </dl>
          </div>
          <PermissionDemo zh={zh} />
        </section>

        <section className="ent-industrial-band" id="industrial">
          <div className="ent-shell">
            <div className="ent-section-heading">
              <p className="ent-eyebrow">INDUSTRIAL & ENGINEERING AI</p>
              <h2>
                {L(
                  "从现场数据，到生产力",
                  "From operational data to productive work."
                )}
              </h2>
              <p>
                {L(
                  "知识库保留经验，算法处理现场信号。把数据采集、模型训练与本地部署连成可验证、可迭代的工程流程。",
                  "Knowledge bases retain expertise. Algorithms process operational signals. Connect collection, training and local deployment in an engineering workflow that can be tested and improved."
                )}
              </p>
            </div>
            <LocalModelLifecycle zh={zh} />
          </div>
        </section>

        <section className="ent-deployment-band" id="deployment">
          <div className="ent-shell">
            <div className="ent-section-heading">
              <p className="ent-eyebrow">
                03 / {L("专属部署", "YOUR DEPLOYMENT")}
              </p>
              <h2>
                {L("让模型适配你的数据边界", "Fit AI to your data boundaries.")}
              </h2>
              <p>
                {L(
                  "从业务需求、数据敏感度和运维条件出发，选择合适的部署方式。",
                  "Choose a deployment based on the workload, data sensitivity and operational requirements."
                )}
              </p>
            </div>
            <div
              className="ent-mode-tabs"
              role="tablist"
              aria-label={L("部署方式", "Deployment options")}
            >
              {modes.map((mode, i) => (
                <button
                  type="button"
                  role="tab"
                  id={`mode-${i}`}
                  aria-controls="mode-panel"
                  aria-selected={deployment === i}
                  onClick={() => setDeployment(i)}
                  key={mode.name}
                >
                  {mode.name}
                </button>
              ))}
            </div>
            <div
              className="ent-mode-detail"
              role="tabpanel"
              id="mode-panel"
              aria-labelledby={`mode-${deployment}`}
            >
              <div>
                <Server size={28} />
                <h3>{modes[deployment].title}</h3>
                <p>{modes[deployment].text}</p>
              </div>
              <ul>
                {modes[deployment].facts.map(fact => (
                  <li key={fact}>
                    <Check size={18} />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
            <p className="ent-scope-note">
              <KeyRound size={16} />
              {L(
                "加密方式、密钥归属、外部处理方、模型许可与验收标准，在项目方案中逐项确认。",
                "Encryption, key ownership, external processors, model licenses and acceptance criteria are agreed in the project plan."
              )}
            </p>
          </div>
        </section>

        <section className="ent-shell ent-usecases" id="applications">
          <div className="ent-section-heading">
            <p className="ent-eyebrow">04 / {L("应用场景", "APPLICATIONS")}</p>
            <h2>
              {L(
                "为真实业务，组织可用的上下文",
                "Context for the work that matters."
              )}
            </h2>
          </div>
          <div
            className="ent-case-tabs"
            role="tablist"
            aria-label={L("应用场景", "Application scenarios")}
          >
            {cases.map((item, i) => (
              <button
                type="button"
                role="tab"
                id={`case-${i}`}
                aria-controls="case-panel"
                aria-selected={scenario === i}
                onClick={() => setScenario(i)}
                key={item.label}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div
            className="ent-case-detail"
            role="tabpanel"
            id="case-panel"
            aria-labelledby={`case-${scenario}`}
          >
            <h3>{cases[scenario].title}</h3>
            <div className="ent-case-flow">
              {[
                [L("业务输入", "INPUT"), cases[scenario].input, Database],
                [L("组织与处理", "PROCESS"), cases[scenario].process, Network],
                [L("应用交付", "OUTPUT"), cases[scenario].outcome, FileCheck2],
              ].map(([label, text, Icon]) => {
                const ItemIcon = Icon as typeof Database;
                return (
                  <div key={label as string}>
                    <ItemIcon size={21} />
                    <h4>{label as string}</h4>
                    <p>{text as string}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="ent-industry-band" id="industry">
          <div className="ent-shell">
            <div className="ent-section-heading">
              <p className="ent-eyebrow">INDUSTRY PERSPECTIVE</p>
              <h2>
                {L(
                  "成熟企业，如何让知识流动",
                  "How enterprise knowledge becomes useful."
                )}
              </h2>
              <p>
                {L(
                  "来自公开行业实践的方法参考。以下不是 Memova 的客户案例；上方为 Memova 拟议应用场景。",
                  "Lessons from public industry practices. These are not Memova customer projects; the applications above are proposed Memova scenarios."
                )}
              </p>
            </div>
            <div className="ent-industry-grid">
              <article>
                <span>PALANTIR / AIRBUS</span>
                <h3>{L("连接数据与业务对象", "Connect data to operations")}</h3>
                <p>
                  {L(
                    "Skywise 把工单、零部件与机队等数据关联，服务运营与维护。启发：先组织业务关系，再设计 AI 应用。",
                    "Skywise brings together work orders, parts and fleet data for operations and maintenance. The lesson: organize business relationships before adding AI applications."
                  )}
                </p>
                <a
                  href="https://www.airbus.com/en/newsroom/press-releases/2017-06-airbus-launches-skywise-aviations-open-data-platform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {L("Airbus 官方资料", "Airbus source")}
                  <ArrowUpRight size={15} />
                </a>
              </article>
              <article>
                <span>MORGAN STANLEY / OPENAI</span>
                <h3>
                  {L(
                    "把检索与评测一起设计",
                    "Design retrieval with evaluation"
                  )}
                </h3>
                <p>
                  {L(
                    "专业团队从内部知识中检索证据，并围绕真实任务评测。启发：答案可引用，效果也要可验证。",
                    "Professional teams retrieve evidence from internal knowledge and evaluate it against real tasks. The lesson: answers need sources, and performance needs testing."
                  )}
                </p>
                <a
                  href="https://openai.com/index/morgan-stanley/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {L("OpenAI 官方案例", "OpenAI source")}
                  <ArrowUpRight size={15} />
                </a>
              </article>
              <article>
                <span>GITLAB / GLEAN</span>
                <h3>
                  {L(
                    "统一入口，不绕过权限",
                    "One entry point, source permissions"
                  )}
                </h3>
                <p>
                  {L(
                    "跨系统查找遵循原始资料权限，记录仍留在来源系统。启发：让检索方便，不意味着所有数据对所有人开放。",
                    "Cross-system search respects source permissions while records remain in their original systems. The lesson: easier discovery does not mean universal access."
                  )}
                </p>
                <a
                  href="https://handbook.gitlab.com/handbook/eta/ai/tools/glean/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {L("GitLab 官方手册", "GitLab handbook")}
                  <ArrowUpRight size={15} />
                </a>
              </article>
            </div>
          </div>
        </section>

        <InstitutionBanner zh={zh} />

        <section className="ent-shell ent-faq">
          <div>
            <p className="ent-eyebrow">{L("项目合作", "WORKING TOGETHER")}</p>
            <h2>
              {L("先对齐边界，再验证价值", "Agree the scope. Prove the value.")}
            </h2>
          </div>
          <div>
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <ChevronDown size={18} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="ent-contact-band" id="contact">
          <div className="ent-shell">
            <div>
              <p className="ent-eyebrow">LET'S BUILD YOUR CONTEXT LAYER</p>
              <h2>
                {L(
                  "从一个具体业务场景开始",
                  "Start with one real business workflow."
                )}
              </h2>
              <p>
                {L(
                  "告诉我们你的数据来源、业务目标和部署要求，一起明确试点与交付范围。",
                  "Tell us about your sources, business goal and deployment requirements. We will define a pilot and its deliverables together."
                )}
              </p>
            </div>
            <a className="ent-button" href={contact}>
              {L("联系企业服务", "Talk to Memova")}
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </main>
      <EnterpriseFooter zh={zh} contact={contact} />
    </div>
  );
}
