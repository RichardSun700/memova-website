import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, SquaresFour } from "@phosphor-icons/react";
import { MentorClassroom } from "./MentorClassroom";
import "./ProCampaignStage.css";

const ART = "/assets/pro-campaign-v2/";
const FEATURE_META = {
  recap: {
    art: "card-recap-calendar.webp", number: "01", label: ["每日回顾", "Daily recap"],
    subtitle: ["回看今日，知道下次怎么做。", "Review today. Find your next step."],
  },
  mentor: {
    art: "card-mentor-chat.webp", number: "02", label: ["个人导师", "Personal mentor"],
    subtitle: ["结合对话，获得具体建议。", "Advice for a real conversation."],
  },
  spark: {
    art: "card-spark-notebook.webp", number: "03", label: ["Spark", "Spark"],
    subtitle: ["把一个想法，写成文稿或计划。", "Turn ideas into drafts and plans."],
  },
  meeting: {
    art: "card-meeting-outcomes-v2.png", number: "04", label: ["会议成果", "Meeting outcomes"],
    subtitle: ["整理决定、分工与下一步。", "Decisions, owners and next steps."],
  },
};

function Lines({ text }) {
  return String(text || "").split("\n").map((line, index) => <span key={index}>{line}</span>);
}

function ProductPreview({ feature, en }) {
  if (feature.key === "mentor") {
    return <div className="pro-campaign-preview pro-campaign-preview--classroom"><MentorClassroom preview /></div>;
  }
  if (feature.key === "spark") {
    return <div className="pro-campaign-preview pro-campaign-preview--spark">
      <div className="pro-campaign-spark-case" aria-label="English translation of a real Spark conversation">
        <header><img src="/assets/memova-app-icon-liquid-blue.svg" width="21" height="21" alt="" /><span>Spark</span><small>Page &amp; Summary</small></header>
        <div className="pro-campaign-spark-idea"><small>YOUR IDEA</small><h4>Fridge clear-out assistant.</h4><p>I opened the fridge and found another box of mushrooms I’d forgotten to eat. Could I make a fridge clear-out assistant?</p></div>
        <div className="pro-campaign-spark-prompt">Explore this idea’s key questions <ArrowUpRight size={13} /></div>
        <div className="pro-campaign-spark-question"><small>QUESTION 01</small><p>Are the two dishes alternatives to choose between, or one meal to cook together?</p></div>
        <div className="pro-campaign-spark-reply">Two alternatives—choose one.</div>
        <p className="pro-campaign-spark-caption">Real conversation · English translation</p>
      </div>
    </div>;
  }
  if (feature.key === "meeting") {
    return <div className="pro-campaign-preview pro-campaign-preview--meeting">
      <div className="pro-campaign-browser">
        <div className="pro-campaign-browser-bar" aria-hidden="true"><i /><i /><i /><span>Memova · Launch Retrospective</span></div>
        <img src="/assets/meeting-library-preview.png" draggable="false" loading="lazy"
          alt="English meeting outcome: a centered headline and three report covers for Transcript, Highlights and Summary" />
      </div>
    </div>;
  }
  const mentor = feature.key === "mentor";
  return <div className={`pro-campaign-preview pro-campaign-preview--phone${mentor ? " pro-campaign-preview--mentor" : ""}`}>
    <div className="pro-campaign-phone-screen">
      <img className="pro-campaign-real-screen" src={ART + (mentor ? "myday-conversation-demo-hrv-v6.png" : "myday-cover-screen.webp")}
        draggable="false" loading="lazy" alt={mentor
          ? (en ? "Michael’s workplace conversation with a separately labelled Demo HRV curve and tentative interpretation" : "Michael 工作对话的原型界面，包含单独标明 Demo 的 HRV 模拟曲线与推测")
          : (en ? "Michael’s actual My Day page with its forest cover and Moments from Today" : "Michael 的真实 My Day 页面，包含森林封面和当天对话")} />
    </div>
    <img className="pro-campaign-phone-bezel" src={ART + "retrospective-phone-bezel.png"} alt="" aria-hidden="true" loading="lazy" draggable="false" />
  </div>;
}

function ProductReader({ feature, lang, onReturnToCards }) {
  const en = lang === "en";
  const pages = {
    recap: { file: "MyDay_Workplace_Conversation_Reference_Layout.html", title: en ? "Michael’s My Day" : "Michael 的 My Day" },
    mentor: { file: "../mentor-classroom.html", title: "Personal mentor · A little help with what to say next" },
    spark: { file: "spark-fridge-idea.html", title: "Spark · Fridge clear-out assistant" },
    meeting: { file: "meeting-outcome-library.html", title: "Launch Retrospective · Meeting outcomes" },
  };
  const page = pages[feature.key] || pages.recap;
  const params = new URLSearchParams({ lang, chimeLang: lang });
  if (page.entry) params.set("entry", page.entry);
  const src = `/examples/${page.file}?${params}`;
  return <div className="pro-campaign-reader-window" key={feature.key}>
    <div className="pro-campaign-reader-bar">
      <span className="pro-campaign-reader-dots" aria-hidden="true"><i /><i /><i /></span>
      <span>{page.title}</span>
    </div>
    <iframe key={src} className="pro-campaign-reader-frame" title={page.title} src={src}
      onLoad={(event) => {
        // Escape leaves the embedded example's keyboard loop for the feature cards.
        const doc = event.currentTarget.contentDocument;
        doc?.addEventListener("keydown", (keyEvent) => {
          if (keyEvent.key === "Escape" && !keyEvent.defaultPrevented) {
            keyEvent.preventDefault();
            onReturnToCards();
          }
        });
      }} />
  </div>;
}

export function ProCampaignStage({ features = [], active = 0, onSelect, lang = "zh", onOpenCase }) {
  const en = lang === "en";
  const index = Math.max(0, Math.min(active, features.length - 1));
  const feature = features[index];
  const meta = FEATURE_META[feature?.key] || FEATURE_META.recap;
  const id = useId();
  const cards = useRef([]);
  const strip = useRef(null);
  const touch = useRef(null);
  const blockClickUntil = useRef(0);
  const selectionStarted = useRef(false);
  const stage = useRef(null);
  const [reading, setReading] = useState(false);
  const L = (zh, english) => (en ? english : zh);

  function select(next, focus = false) {
    if (!features.length) return;
    const target = (next + features.length) % features.length;
    selectionStarted.current = true;
    setReading(true);
    onSelect?.(target);
    if (focus) cards.current[target]?.focus({ preventScroll: true });
  }

  useEffect(() => {
    const row = strip.current;
    const card = cards.current[index];
    if (reading || !row || !card || row.scrollWidth <= row.clientWidth + 1) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({
      left: Math.max(0, card.offsetLeft - (row.clientWidth - card.clientWidth) / 2),
      behavior: selectionStarted.current && !reduced ? "smooth" : "auto",
    });
  }, [index, reading]);

  useEffect(() => {
    if (!reading) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }, [reading]);

  function expandCards() {
    setReading(false);
    cards.current[index]?.focus({ preventScroll: true });
  }

  function onCardKey(event, cardIndex) {
    const next = event.key === "ArrowRight" ? cardIndex + 1
      : event.key === "ArrowLeft" ? cardIndex - 1
        : event.key === "Home" ? 0
          : event.key === "End" ? features.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  }

  if (!feature) return null;

  return <div className={`pro-campaign${reading ? " is-reading" : ""}`} data-language={en ? "en" : "zh"}>
    <header className="pro-campaign-header">
      <div>
        <p className="pro-campaign-eyebrow"><b>03</b> MEMOVA PRO</p>
        <h2 id="lower-pro-title"><span>Memova</span><span>Pro</span></h2>
      </div>
      <aside className="pro-campaign-annotation">
        <p><Lines text={L("从今天的对话，\n找到下一步。", "From today’s conversations\nto what comes next.")} /></p>
        <div aria-hidden="true" />
      </aside>
    </header>

    <div className="pro-campaign-stage" ref={stage}>
      <div className="pro-campaign-cards" ref={strip} role="tablist" id={`${id}-cards`} aria-label={L("选择 Memova Pro 功能", "Choose a Memova Pro feature")}
        onTouchStart={(event) => { touch.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY, index } : null; }}
        onTouchEnd={(event) => {
          const start = touch.current;
          touch.current = null;
          if (!start || !event.changedTouches.length) return;
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) <= 38 || Math.abs(dx) <= Math.abs(dy) * 1.3) return;
          blockClickUntil.current = Date.now() + 350;
          select(start.index + (dx < 0 ? 1 : -1));
        }}
        onTouchCancel={() => { touch.current = null; }}>
        {features.map((item, cardIndex) => {
          const itemMeta = FEATURE_META[item.key] || FEATURE_META.recap;
          const selected = index === cardIndex;
          return <button key={item.key} type="button" role="tab" id={`${id}-tab-${item.key}`}
            aria-selected={selected} aria-controls={`${id}-panel`} tabIndex={selected ? 0 : -1}
            style={{ "--card-index": cardIndex, "--dock-side": cardIndex < 2 ? 0 : 1, "--dock-row": cardIndex % 2, "--card-tilt": `${[-5, 4, 5, -4][cardIndex]}deg` }}
            className={`pro-campaign-card${selected ? " is-active" : ""}`} ref={(node) => { cards.current[cardIndex] = node; }}
            onClick={(event) => { if (Date.now() < blockClickUntil.current) { event.preventDefault(); return; } select(cardIndex); }}
            onKeyDown={(event) => onCardKey(event, cardIndex)}>
            <span className="pro-campaign-card-top"><span>{itemMeta.number} / MEMOVA</span><span className="pro-campaign-card-state">PRO</span></span>
            <img src={ART + itemMeta.art} alt="" aria-hidden="true" loading="lazy" draggable="false" />
            <strong>{itemMeta.label[en ? 1 : 0]}</strong>
            <span className="pro-campaign-card-subtitle" aria-hidden={reading ? "true" : undefined}>{itemMeta.subtitle[en ? 1 : 0]}</span>
          </button>;
        })}
      </div>

      <div className="pro-campaign-story" id={`${id}-panel`} role="tabpanel" tabIndex={0} aria-labelledby={`${id}-tab-${feature.key}`}>
        <div className="pro-campaign-context">
          <p className="pro-campaign-kicker">{meta.number} / {meta.label[en ? 1 : 0].toUpperCase()}</p>
          <h3><Lines text={feature.headline || feature.title} /></h3>
          <p className="pro-campaign-context-body">{feature.body}</p>
        </div>
        {reading ? <ProductReader feature={feature} lang={lang} onReturnToCards={() => cards.current[index]?.focus({ preventScroll: true })} />
          : <ProductPreview feature={feature} en={en} />}
      </div>


      <div className="pro-campaign-toolbar">
        <div className="pro-campaign-selected-info">
          <b>{meta.label[en ? 1 : 0]}</b><span className="pro-campaign-owner-divider" aria-hidden="true" />
          <div className="pro-campaign-case-actions">
            <button className="pro-campaign-case-action" type="button" onClick={() => onOpenCase?.(feature.case)}>
              {feature.action || L("查看完整示例", "Open the full example")}<ArrowUpRight size={14} aria-hidden="true" />
            </button>
            {feature.relatedCase && <button className="pro-campaign-case-action" type="button" onClick={() => onOpenCase?.(feature.relatedCase)}>
              {feature.relatedAction}<ArrowUpRight size={14} aria-hidden="true" />
            </button>}
          </div>
        </div>
        <div className="pro-campaign-controls">
          {reading && <button className="pro-campaign-expand" type="button" onClick={expandCards}
            aria-expanded="false" aria-controls={`${id}-cards`} aria-label={L("展开四个功能卡片", "Expand all four feature cards")}>
            <SquaresFour size={16} aria-hidden="true" /><span>{L("展开卡片", "All features")}</span>
          </button>}
          <span className="pro-campaign-counter" aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, "0")}<small>/ {String(features.length).padStart(2, "0")}</small></span>
          <button type="button" onClick={() => select(index - 1)} aria-label={L("上一个功能", "Previous feature")}><ArrowLeft size={17} aria-hidden="true" /></button>
          <button type="button" onClick={() => select(index + 1)} aria-label={L("下一个功能", "Next feature")}><ArrowRight size={17} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  </div>;
}

export default ProCampaignStage;
