import { useRef, useState } from "react";
import {
  AppleLogo,
  ArrowUpRight,
  LockSimple,
  Plus,
} from "@phosphor-icons/react";
import "./lower.css";
import { CloudProcessingDemo } from "./CloudProcessingDemo";
import { ProOverview } from "./ProOverview";
import { APP_STORE_URL as APP_STORE, MCP_OVERVIEW_URL } from "./siteLinks";

const ASSETS = {
  recap: "/assets/feature-recap.webp",
  mentor: "/assets/feature-mentor.webp",
  spark: "/assets/feature-spark.webp",
  meeting: "/assets/feature-meeting.webp",
  icon: "/assets/memova-icon-transparent.png",
};

// Dialogue stays in its original language when the interface language changes.
const QUOTES = [
  {
    id: "trip-04",
    source: {
      zh: "大烟山旅行推荐 · Cades Cove",
      en: "Smoky Mountains recommendation · Cades Cove",
    },
    speaker: "George",
    quote:
      "Definitely. You should check out Cades Cove. It's a great place to spot white-tailed deer, and you might even see black bears if you're lucky.",
    result: {
      key: "travel", label: { zh: "旅行计划", en: "TRAVEL PAGE" },
      title: { zh: "大烟山旅行计划", en: "Smokies travel plan" },
      image: "/assets/smoky-hero.webp", alt: "The actual Smoky Mountains travel-page cover",
    },
  },
  {
    id: "workplace-michael-clarification",
    source: {
      zh: "工作沟通 · Michael 的追问",
      en: "Work conversation · Michael’s question",
    },
    speaker: "Michael",
    quote: "What do you mean by that?",
    result: {
      key: "myday", label: { zh: "每日复盘", en: "MY DAY" },
      title: { zh: "Michael 的 My Day", en: "Michael’s My Day" },
      image: "/assets/myday-forest-cover.webp", alt: "The actual forest cover from Michael’s My Day",
    },
  },
  {
    id: "retro-06",
    source: {
      zh: "发布复盘 · 查找录音笔记",
      en: "Launch review · Finding recording notes",
    },
    speaker: "Michael",
    quote: "If people have to figure out where their notes went, we're making them work too hard.",
    result: {
      key: "meeting", label: { zh: "可交互会议网页", en: "MEETING PAGE" },
      title: { zh: "发布复盘与后续分工", en: "Launch review & follow-up" },
      image: "/assets/meeting-library-preview.png", alt: "The English meeting-outcome webpage with three report covers",
    },
  },
];

const COPY = {
  zh: {
    privacyLabel: "02 · 本地保存与云端处理",
    privacyTitle: "离线转写，\n默认本地保存。",
    privacyBody:
      "飞行模式下也能离线转写。录音与转写默认保存在本地；需要增强 AI 分析时，再选择要上传的对话。",
    privacyNote: "默认本地保存，上传内容由你决定。",
    privacyMode: "使用云端处理以下内容",
    privacyModeDescription: "下方为原话节选；交互仅展示预设成果，不上传或分析对话。",
    privacySelection: (n) => `已选择 ${n} 段对话`,
    privacyRemaining: (n) =>
      n ? `其余 ${n} 段继续留在本机` : "仅你选择的内容参与处理",
    privacyChoose: "处理所选",
    privacyPrepared: "已确认所选",
    privacyReset: "重新选择",
    privacyFeedback: "已确认所选对话。此示例不会上传或触发云端分析。",
    proLabel: "03 · MEMOVA PRO",
    proTitle: "让 Apple Watch 成为你的第二记忆。",
    proBody:
      "从当天的原话出发，回顾重要对话，获得下次可以尝试的沟通建议。",
    proFeatures: [
      {
        key: "recap",
        title: "每日回顾",
        headline: "回顾今天，\n想好下次怎么做。",
        body: "回看当天原话，读今日观察和一条可以尝试的沟通建议。Michael 的回顾里，重点是怎样把反馈拉回具体工作。",
        action: "打开 Michael 的 My Day",
        image: ASSETS.recap,
        color: "#d6e6fa",
        case: "myday",
      },
      {
        key: "mentor",
        title: "个人导师",
        headline: "那句话让你不舒服，\n下次可以怎么回应？",
        body: "带着困惑继续提问。结合原话和你允许提供的 HRV 等线索，获得可尝试的回应，也能回到原话核对。",
        action: "查看个人导师示例",
        image: ASSETS.mentor,
        color: "#dce9e3",
        case: "mentor",
      },
      {
        key: "spark",
        title: "Spark 探索与创作",
        headline: "随手记下一个想法，\n继续把它想清楚。",
        body: "一盒忘记吃掉的蘑菇，带来了“冰箱清空助手”的想法。跟随真实 Spark 对话：探讨关键问题，澄清二选一，再查看知识库与搜索补充。案例全文为英文。",
        action: "打开真实 Spark 对话",
        image: ASSETS.spark,
        color: "#e7e0f2",
        case: "spark",
      },
      {
        key: "meeting",
        title: "会议成果与交互网页",
        headline: "会议说了什么，\n接下来谁来做。",
        body: "把发布复盘整理成会议重点、四位负责人的后续事项和原话。打开全英文会议成果网页，逐项查看讨论依据。",
        action: "打开发布复盘网页",
        image: ASSETS.meeting,
        color: "#f2e6d8",
        case: "meeting",
      },
    ],
    proOpenFeature: (title) => `查看${title}示例`,
    freePlanLabel: "免费版",
    freeTitle: "免费基础能力",
    freeFeatures: ["本地录音", "本地转写", "离线搜索"],
    freeBody:
      "先免费录音、转写和搜索原话。需要每日回顾、个人导师、Spark 或会议成果时，再选择 Pro。",
    billingLabel: "选择订阅周期",
    monthly: "月付",
    annual: "年付",
    perMonth: "/ 月",
    perYear: "/ 年",
    subscriptionNote: "订阅与自动续订条款在 App 内确认。",
    proAction: "下载 Memova，查看 Pro",
    faqLabel: "常见问题",
    faqTitle: "设备、离线与订阅。",
    faqs: [
      {
        question: "还需要再买一件录音设备吗？",
        answer:
          "使用已有的 Apple Watch，轻点开始录音，熄屏后继续。也可以用 iPhone 记录会议与想法。",
      },
      {
        question: "没有网络，也能使用吗？",
        answer:
          "可以。飞行模式下也能本地录音、转写和搜索原话。云端分析、每日回顾、Spark 与会议成果需要联网，并选择相应内容进行处理。",
      },
      {
        question: "我的所有对话都会上传吗？",
        answer:
          "不会。录音与转写默认保存在本地。你可以手动选择要处理的对话，或主动开启自动云端处理；会议原音的云端增强会单独说明和确认。",
      },
      {
        question: "免费版与 Pro 有什么不同？",
        answer:
          "本地录音、转写、文字回看与离线搜索免费。Pro 提供每日回顾、个人导师、Spark 探索与创作，以及会议成果与交互网页。",
      },
      {
        question: "今日观察和沟通建议从哪里来？",
        answer:
          "根据你选择提供的对话与背景，整理今日观察和可尝试的沟通小提示。你可以回到原话核对，也可以选择是否提供 HRV 等身体线索。",
      },
    ],
    footerTitle: "用已有的 Apple Watch，\n开始记录今天。",
    footerBody: "熄屏继续录音，离线转写，按关键词找回原话。",
    footerDownload: "免费下载 Memova",
    footerSubline: "本地录音 · 离线转写 · 关键词搜索",
    footerPrivacy: "隐私政策",
    footerSupport: "帮助与支持",
    footerTerms: "服务条款",
    footerCopyright: "© 2026 Memova",
  },
  en: {
    privacyLabel: "02 · LOCAL STORAGE & CLOUD PROCESSING",
    privacyTitle: "Transcribe offline.\nSave locally by default.",
    privacyBody:
      "Transcribe offline, even in airplane mode. Recordings and transcripts stay locally by default. Choose conversations to upload for enhanced AI analysis.",
    privacyNote: "Saved locally by default. You choose what to upload.",
    privacyMode: "Use cloud processing for these conversations",
    privacyModeDescription:
      "Source excerpts below. This demo shows preset results without uploading or analyzing conversations.",
    privacySelection: (n) =>
      `${n} ${n === 1 ? "conversation" : "conversations"} selected`,
    privacyRemaining: (n) =>
      n
        ? `The other ${n} ${n === 1 ? "stays" : "stay"} on your device`
        : "Only your selected conversations are included",
    privacyChoose: "Process selected",
    privacyPrepared: "Selection confirmed",
    privacyReset: "Choose again",
    privacyFeedback:
      "Selection confirmed. This example does not upload conversations or run cloud analysis.",
    proLabel: "03 · MEMOVA PRO",
    proTitle: "Turn your Apple Watch\ninto your second memory.",
    proBody:
      "Revisit the conversations that mattered, with practical guidance on what you could try next time.",
    proFeatures: [
      {
        key: "recap",
        title: "Daily recap",
        headline: "Look back on today.\nKnow what to try next.",
        body: "Revisit the original words, read an observation and find a practical communication tip. Michael’s recap focuses on keeping feedback about the work.",
        action: "Open Michael’s My Day",
        image: ASSETS.recap,
        color: "#d6e6fa",
        case: "myday",
      },
      {
        key: "mentor",
        title: "Personal mentor",
        headline: "That comment stayed with you.\nWhat could you say next time?",
        body: "Ask a follow-up question with the original conversation and context you choose to share, such as HRV. Get a response to try, with a way back to the source words.",
        action: "See the mentor example",
        image: ASSETS.mentor,
        color: "#dce9e3",
        case: "mentor",
      },
      {
        key: "spark",
        title: "Spark exploration & creation",
        headline: "Capture a thought.\nDevelop it with Spark.",
        body: "A forgotten box of mushrooms sparked a fridge clear-out assistant. Follow the real conversation: explore key questions, clarify a choice and review the suggested additions.",
        action: "Open the real Spark conversation",
        image: ASSETS.spark,
        color: "#e7e0f2",
        case: "spark",
      },
      {
        key: "meeting",
        title: "Meeting outcomes & webpages",
        headline: "What was decided.\nWho does what next.",
        body: "A launch review, organized into key points, four owners and the original conversation. Browse the follow-ups and check the words behind each one.",
        action: "Open the launch review",
        image: ASSETS.meeting,
        color: "#f2e6d8",
        case: "meeting",
      },
    ],
    proOpenFeature: (title) => `View a ${title.toLowerCase()} example`,
    freePlanLabel: "FREE",
    freeTitle: "Free essentials",
    freeFeatures: ["Local recording", "Local transcription", "Offline search"],
    freeBody:
      "Start with free recording, transcription and keyword search. Choose Pro for daily recaps, a personal mentor, Spark and meeting outcomes.",
    billingLabel: "Choose a billing period",
    monthly: "Monthly",
    annual: "Yearly",
    perMonth: "/ month",
    perYear: "/ year",
    subscriptionNote: "Review subscription and auto-renewal terms in the app.",
    proAction: "Download Memova and view Pro",
    faqLabel: "COMMON QUESTIONS",
    faqTitle: "Devices, offline use and Pro.",
    faqs: [
      {
        question: "Do I need another recording device?",
        answer:
          "Use the Apple Watch you already have. Tap to record, and recording continues with the screen off. You can also record meetings and ideas on your iPhone.",
      },
      {
        question: "Can I use Memova without a connection?",
        answer:
          "Yes. Record, transcribe and search locally in airplane mode. Cloud analysis, daily recaps, Spark and meeting outcomes need a connection and your selection of content to process.",
      },
      {
        question: "Will all my conversations be uploaded?",
        answer:
          "No. Recordings and transcripts stay locally by default. Select conversations for manual processing, or choose to enable automatic cloud processing. Cloud enhancement of meeting audio is explained and confirmed separately.",
      },
      {
        question: "What is included for free, and what does Pro add?",
        answer:
          "Local recording, transcription, text review and offline search are free. Pro adds daily recaps, a personal mentor, Spark exploration and creation, and meeting outcomes with interactive webpages.",
      },
      {
        question:
          "Where do daily observations and communication tips come from?",
        answer:
          "They use the conversations and context you choose to provide to suggest daily observations and communication tips. Return to the original words to check the context. You choose whether to include body signals such as HRV.",
      },
    ],
    footerTitle: "Use your Apple Watch.\nStart recording today.",
    footerBody:
      "Record with the screen off. Transcribe offline. Find the original words with keywords.",
    footerDownload: "Download Memova for free",
    footerSubline: "LOCAL RECORDING · OFFLINE TRANSCRIPTION · KEYWORD SEARCH",
    footerPrivacy: "Privacy policy",
    footerSupport: "Help & support",
    footerTerms: "Terms of service",
    footerCopyright: "© 2026 Memova",
  },
};

function Multiline({ children }) {
  return children
    .split("\n")
    .map((line, i) => <span key={`${line}-${i}`}>{line}</span>);
}

function PrivacySection({ copy, lang }) {
  const [phase, setPhase] = useState("selecting");
  const introRef = useRef(null);
  return (
    <section
      className={"lower-privacy cloud-transform-section" + (phase !== "selecting" ? " cloud-has-results" : "")}
      id="privacy"
      data-narrative-block="2"
      data-cloud-phase={phase}
      aria-labelledby="lower-privacy-title"
    >
      <div className="section-shell lower-shell lower-privacy-layout">
        <div className="lower-privacy-copy" ref={introRef}>
          <p className="lower-eyebrow">{copy.privacyLabel}</p>
          <h2 className="lower-heading" id="lower-privacy-title">
            <Multiline>{copy.privacyTitle}</Multiline>
          </h2>
          <p className="lower-body">{copy.privacyBody}</p>
          <p className="lower-trust-note">
            <LockSimple size={18} weight="regular" aria-hidden="true" />
            {copy.privacyNote}
          </p>
        </div>
        <CloudProcessingDemo
          lang={lang}
          copy={copy}
          quotes={QUOTES}
          introRef={introRef}
          onPhaseChange={setPhase}
        />
      </div>
    </section>
  );
}

function ProSection({ copy, lang, onOpenCase }) {
  const [billing, setBilling] = useState("annual");
  const price = billing === "annual" ? "US$39.99" : "US$4.99";

  return (
    <section
      className="lower-pro lower-pro-unified"
      id="pro"
      style={{ scrollMarginTop: 0 }}
      data-narrative-block="3"
      aria-labelledby="lower-pro-title"
    >
      <div className="section-shell lower-shell">
        <ProOverview
          copy={copy} lang={lang}
          billing={billing} setBilling={setBilling}
          price={price} onOpenCase={onOpenCase}
          appStoreUrl={APP_STORE}
        />
        <FaqSection copy={copy} />
        <FooterSection copy={copy} lang={lang} />
      </div>
    </section>
  );
}

function FaqSection({ copy }) {
  const [open, setOpen] = useState(null);
  return (
    <div
      className="lower-faq lower-faq-embedded"
      id="faq"
      aria-labelledby="lower-faq-title"
    >
      <div className="lower-faq-layout">
        <header className="lower-faq-heading">
          <img className="lower-faq-question-mark" src="/assets/faq/question-mark-handdrawn.png" alt="" aria-hidden="true" width="78" height="78" loading="lazy" />
          <h2 id="lower-faq-title">FAQ</h2>
        </header>
        <div className="lower-faq-list">
          {copy.faqs.map((item, index) => (
            <article
              className={`lower-faq-item${open === index ? " is-open" : ""}`}
              key={index}
            >
              <h3>
                <button
                  type="button"
                  id={`lower-faq-question-${index}`}
                  aria-expanded={open === index}
                  aria-controls={`lower-faq-answer-${index}`}
                  onClick={() =>
                    setOpen((current) => (current === index ? null : index))
                  }
                >
                  <span>{item.question}</span>
                  <Plus size={21} weight="regular" aria-hidden="true" />
                </button>
              </h3>
              <div
                className="lower-faq-answer"
                id={`lower-faq-answer-${index}`}
                role="region"
                aria-labelledby={`lower-faq-question-${index}`}
                hidden={open !== index}
              >
                <p>{item.answer}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterSection({ copy, lang }) {
  return (
    <footer className="lower-footer lower-footer-compact" id="download">
      <span id="waitlist" aria-hidden="true" style={{ display: "block", height: 0, scrollMarginTop: 80 }} />
      <div className="lower-footer-bottom">
        <a className="lower-footer-brand" href="#top" aria-label="Memova">
          <img src={ASSETS.icon} alt="" />
          <span>MEMOVA</span>
        </a>
        <a
          href={APP_STORE}
          className="lower-footer-download"
          target="_blank"
          rel="noreferrer"
          aria-label={lang === "zh" ? "在 App Store 下载 Memova AI" : "Download Memova AI on the App Store"}
        >
          <AppleLogo size={17} weight="fill" aria-hidden="true" />
          {copy.footerDownload}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <nav aria-label={copy.footerSupport}>
          <a href={MCP_OVERVIEW_URL} target="_blank" rel="noreferrer" aria-label={lang === "zh" ? "插件与 MCP · 查看完整连接指南" : "Plugins & MCP · Open the complete connection guide"}>MCP</a>
          <a href="https://memova.ai/privacy/" target="_blank" rel="noreferrer">
            {copy.footerPrivacy}
          </a>
          <a href="https://memova.ai/support/" target="_blank" rel="noreferrer">
            {copy.footerSupport}
          </a>
          <a href="https://memova.ai/terms/" target="_blank" rel="noreferrer">
            {copy.footerTerms}
          </a>
        </nav>
        <p>{copy.footerCopyright}</p>
      </div>
    </footer>
  );
}

export function PrivacyBlock({ lang = "zh" }) {
  const normalizedLang = lang === "en" ? "en" : "zh";
  return (
    <div className="lower-sections" data-lang={normalizedLang}>
      <PrivacySection copy={COPY[normalizedLang]} lang={normalizedLang} />
    </div>
  );
}

export default function LowerSections({ lang = "zh", onOpenCase }) {
  const normalizedLang = lang === "en" ? "en" : "zh";
  const copy = COPY[normalizedLang];
  return (
    <div className="lower-sections" id="possibilities" data-lang={normalizedLang}>
      <ProSection copy={copy} lang={normalizedLang} onOpenCase={onOpenCase} />
    </div>
  );
}

export { LowerSections };
