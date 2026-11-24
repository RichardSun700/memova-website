import { useState } from "react";
import {
  AppleLogo,
  ArrowUpRight,
  Plus,
} from "@phosphor-icons/react";
import "./lower.css";
import { CloudProcessingDemo } from "./CloudProcessingDemo";
import { ProOverview } from "./ProOverview";
import { PrivacyStory } from "./PrivacyStory";
import "./CloudProcessingSection.css";
import { APP_STORE_URL as APP_STORE, MCP_OVERVIEW_URL, BLOG_PAGE_URL } from "./siteLinks";

const ASSETS = {
  recap: "/assets/feature-recap.webp",
  mentor: "/assets/feature-mentor.webp",
  spark: "/assets/feature-spark.webp",
  meeting: "/assets/feature-meeting.webp",
  icon: "/assets/memova-app-icon-liquid-blue.svg",
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
      key: "travel", label: { zh: "行前会议纪要", en: "MEETING PAGE" },
      title: { zh: "大烟山行前讨论", en: "Smokies trip briefing" },
      image: "/assets/smoky-hero.webp", alt: "The actual Smoky Mountains travel-page cover",
      preview: {
        kind: "travel",
        label: { zh: "会议笔记", en: "MEETING NOTES" },
        heading: "Cades Cove",
        coverLines: { zh: ["大烟山", "行前讨论。"], en: ["Smokies", "trip briefing."] },
        coverCaption: { zh: "Cades Cove · 行前查询", en: "Cades Cove · trip research" },
        items: [
          { zh: "自驾环线与野生动物", en: "Scenic loop & wildlife" },
          { zh: "Michael · 进一步查询", en: "Michael · Research" },
        ],
        footer: { zh: "日期尚未确认", en: "Dates not confirmed" },
      },
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
      key: "myday", label: { zh: "每日回顾", en: "DAILY RECAP" },
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
      image: "/assets/day-photos-v1/09-meeting.webp",
      alt: { zh: "自然光下的会议桌与空椅，作为会议成果示例的封面。", en: "A sunlit conference table and empty chairs, illustrating the meeting outcome." },
      preview: {
        kind: "meeting",
        label: { zh: "会议笔记", en: "MEETING NOTES" },
        heading: { zh: "下一步", en: "Next steps" },
        coverLines: { zh: ["产品发布", "复盘纪要。"], en: ["Launch", "retrospective."] },
        coverCaption: { zh: "用户反馈 · 后续分工", en: "Feedback · next steps" },
        items: [
          { zh: "Michael · 用户反馈", en: "Michael · Feedback" },
          { zh: "Jordan · 界面探索", en: "Jordan · Design" },
        ],
        footer: { zh: "下次产品同步会复核", en: "Next product sync" },
      },
    },
  },
];

const COPY = {
  zh: {
    privacyLabel: "02 · 本地保存与云端处理",
    privacyTitle: "离线转写，\n默认本地保存。",
    privacyBody:
      "离线转写和搜索，也可选择由微软 Azure 提供的云端转写与 AI 处理，无需账号。",
    privacyNote: "转写与成果保存在本机，上传内容由你决定。",
    privacyMode: "使用云端处理以下内容",
    privacyModeDescription: "仅演示预设成果，不上传或分析对话。",
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
        headline: "一天的对话，\n一张值得留下的卡片。",
        body: "回看总结、重点片段、沟通反馈与每日记忆，随时展开相关原话。",
        action: "打开 My Day",
        image: ASSETS.recap,
        color: "#d6e6fa",
        case: "myday",
      },
      {
        key: "mentor",
        title: "个人导师",
        headline: "那句话让你不舒服，\n下次可以怎么回应？",
        body: "结合原话与你选择提供的 HRV 线索，梳理困惑，找到可以尝试的回应。",
        action: "查看沟通建议",
        image: ASSETS.mentor,
        color: "#dce9e3",
        case: "mentor",
      },
      {
        key: "spark",
        title: "Spark 探索与创作",
        headline: "随手记下一个想法，\n继续把它想清楚。",
        body: "从一次记录继续追问，把想法变成文章或计划。",
        action: "打开 Spark",
        image: ASSETS.spark,
        color: "#e7e0f2",
        case: "spark",
      },
      {
        key: "meeting",
        title: "会议成果与交互网页",
        headline: "会议说了什么，\n接下来谁来做。",
        body: "整理会议决定、负责人和后续事项，随时回看讨论依据。",
        action: "查看会议成果",
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
          "用已有的 Apple Watch 轻点录音，熄屏后继续；也支持 iPhone 录音。",
      },
      {
        question: "需要注册账号吗？",
        answer:
          "使用 App 无需账号，包括录音、本地与云端转写、搜索和 AI 功能。只有使用 MCP 时需要账号并单独授权；云端处理仍需要联网和你的许可。",
      },
      {
        question: "没有网络，也能使用吗？",
        answer:
          "可以。本地录音、转写和搜索支持离线；AI 分析与 Pro 生成内容需要联网和你的授权。",
      },
      {
        question: "我的所有对话都会上传吗？",
        answer:
          "不会。录音与转写默认本地保存；你可以选择要处理的内容，或主动开启自动云端处理。",
      },
      {
        question: "云端会长期保存我的录音和成果吗？",
        answer:
          "App 的转写、摘要、Ask、灵感和每日回顾保存在本机。云端音频转写、文字 AI 分析和配图均由微软 Azure 处理；上传的音频在转写完成后立即删除。其他任务内容与成果仅临时保存，最长 24 小时，以便 App 未打开时等待下载；下载到手机后立即删除。App 不提供云端资料同步。",
      },
      {
        question: "免费版与 Pro 有什么不同？",
        answer:
          "录音、转写和离线搜索免费。Pro 提供每日回顾、个人导师、Spark 和会议成果。",
      },
      {
        question: "今日观察和沟通建议从哪里来？",
        answer:
          "根据你选择提供的对话与背景生成。HRV 线索由你选择是否提供，建议可回到原话核对。",
      },
    ],
    footerTitle: "用已有的 Apple Watch，\n开始记录今天。",
    footerBody: "熄屏继续录音，离线转写，按关键词找回原话。",
    footerDownload: "免费下载 Memova",
    footerSubline: "本地录音 · 离线转写 · 关键词搜索",
    footerPrivacy: "隐私政策",
    footerSupport: "帮助与支持",
    footerTerms: "服务条款",
    footerCopyright: "© 2026 MEMOVA LLC",
  },
  en: {
    privacyLabel: "02 · LOCAL STORAGE & CLOUD PROCESSING",
    privacyTitle: "Transcribe offline.\nSave locally by default.",
    privacyBody:
      "Transcribe and search offline, or choose cloud transcription and AI processing on Microsoft Azure. No account required.",
    privacyNote: "Transcripts and results are saved on your phone. You choose what to upload.",
    privacyMode: "Use cloud processing for these conversations",
    privacyModeDescription:
      "Preset results only. No upload or cloud analysis.",
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
        headline: "Your day,\nin a card to keep.",
        body: "Revisit your summary, highlights, communication feedback and daily memories. Open the original words whenever you need them.",
        action: "Explore My Day",
        image: ASSETS.recap,
        color: "#d6e6fa",
        case: "myday",
      },
      {
        key: "mentor",
        title: "Personal mentor",
        headline: "That comment stayed with you.\nWhat could you say next time?",
        body: "Explore a difficult conversation with its original words and optional HRV context, then find a response to try.",
        action: "Explore the advice",
        image: ASSETS.mentor,
        color: "#dce9e3",
        case: "mentor",
      },
      {
        key: "spark",
        title: "Spark exploration & creation",
        headline: "Capture a thought.\nDevelop it with Spark.",
        body: "Explore a recorded thought and turn it into a draft or plan.",
        action: "Explore Spark",
        image: ASSETS.spark,
        color: "#e7e0f2",
        case: "spark",
      },
      {
        key: "meeting",
        title: "Meeting outcomes & webpages",
        headline: "What was decided.\nWho does what next.",
        body: "Review decisions, owners and next steps, with the original discussion close at hand.",
        action: "Explore the meeting",
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
          "Use your Apple Watch. Tap to record, even with the screen off. You can also record on iPhone.",
      },
      {
        question: "Do I need an account?",
        answer:
          "The app works without an account, including recording, local and cloud transcription, search and AI features. Only MCP requires an account and separate authorization. Cloud processing still needs an internet connection and your permission.",
      },
      {
        question: "Can I use Memova without a connection?",
        answer:
          "Yes. Record, transcribe and search offline. AI analysis and Pro-generated content need a connection and your authorization.",
      },
      {
        question: "Will all my conversations be uploaded?",
        answer:
          "No. Recordings and transcripts stay local by default. Select content for cloud processing, or opt into automatic processing.",
      },
      {
        question: "Does the cloud keep my recordings and results?",
        answer:
          "App transcripts, summaries, Ask responses, ideas and daily recaps are saved on your phone. Cloud audio transcription, text AI analysis and illustrations use Microsoft Azure. Uploaded audio is deleted immediately after transcription. Other task content and results are held temporarily for up to 24 hours so you can download them when you open the app, and are deleted immediately once downloaded to your phone. The app does not provide cloud content sync.",
      },
      {
        question: "What is included for free, and what does Pro add?",
        answer:
          "Recording, transcription and offline search are free. Pro adds daily recaps, a personal mentor, Spark and meeting outcomes.",
      },
      {
        question:
          "Where do daily observations and communication tips come from?",
        answer:
          "Suggestions use the conversations and context you choose to share, including optional HRV data. Check them against the original words.",
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
    footerCopyright: "© 2026 MEMOVA LLC",
  },
};

function Multiline({ children }) {
  return children
    .split("\n")
    .map((line, i) => <span key={`${line}-${i}`}>{line}</span>);
}

function PrivacySection({ copy, lang }) {
  const [phase, setPhase] = useState("selecting");
  return (
    <section
      className="cloud-processing-section"
      id="cloud-processing"
      data-cloud-phase={phase}
      aria-labelledby="cloud-processing-title"
    >
      <div className="section-shell lower-shell cloud-processing-section-shell">
        <header className="cloud-processing-section-intro">
          <div>
            <p className="lower-eyebrow">{copy.privacyLabel}</p>
            <h2 className="lower-heading" id="cloud-processing-title">
              <Multiline>{copy.privacyTitle}</Multiline>
            </h2>
          </div>
          <p className="lower-body">{copy.privacyBody}</p>
        </header>
        <div className="privacy-choice-demo" id="privacy-cloud-demo" aria-label={copy.privacyMode}>
          <CloudProcessingDemo
            lang={lang}
            copy={copy}
            quotes={QUOTES}
            onPhaseChange={setPhase}
          />
        </div>
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
          <img className="lower-footer-wordmark" src="/assets/memova-wordmark-blue.svg" alt="" />
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
          <a href={BLOG_PAGE_URL}>{lang === "zh" ? "博客" : "Blog"}</a>
          <a href={MCP_OVERVIEW_URL} aria-label={lang === "zh" ? "插件与 MCP · 查看完整连接指南" : "Plugins & MCP · Open the complete connection guide"}>MCP</a>
          <a href="/privacy/">
            {copy.footerPrivacy}
          </a>
          <a href="/support/">
            {copy.footerSupport}
          </a>
          <a href="/terms/">
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
    <>
      <PrivacyStory lang={normalizedLang} />
      <div className="lower-sections" data-lang={normalizedLang}>
        <PrivacySection copy={COPY[normalizedLang]} lang={normalizedLang} />
      </div>
    </>
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
