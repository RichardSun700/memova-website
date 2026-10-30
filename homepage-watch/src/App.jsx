import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Play,
  X,
  Check,
  BookOpen,
  Globe,
  ArrowLeft,
  List,
  UsersThree,
} from "@phosphor-icons/react";
import { LowerSections, PrivacyBlock } from "./LowerSections";
import { OpeningExperience } from "./OpeningExperience";
import { ExperienceJourney } from "./ExperienceJourney";
import { useSiteNavigation } from "./useSiteNavigation";
import { useCompactLayout } from "./useCompactLayout";
import { ProFeatureVisual } from "./ProFeatureVisual";
import storyPages from "./storyPages.json";
import { APP_STORE_URL as STORE, COMMUNITY_URL, COMMUNITY_QR, MCP_OVERVIEW_URL } from "./siteLinks";
import "./lower.css";
const A = "/assets/";
export function App() {
  const [lang, setLang] = useState("zh"),
    [modal, setModal] = useState(null),
    [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButton = useRef(null);
  const compact = useCompactLayout();
  const { headerRef, activeNav } = useSiteNavigation();
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) setMobileMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        mobileMenuButton.current?.focus({ preventScroll: true });
      }
    };
    const wide = matchMedia("(min-width:850px) and (min-height:501px), (min-width:1001px)");
    const closeOnWide = () => { if (wide.matches) setMobileMenuOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    wide.addEventListener("change", closeOnWide);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
      wide.removeEventListener("change", closeOnWide);
    };
  }, [mobileMenuOpen, headerRef]);
  const closeRef = useRef(),
    returnRef = useRef(),
    L = (zh, en) => (lang === "zh" ? zh : en);
  const activeStory = storyPages.find((story) => story.id === modal);
  const activeStoryIndex = storyPages.findIndex((story) => story.id === modal);
  const timeline = [
    [
      "09:30",
      L("和 George 聊起大烟山", "Talking Smokies with George"),
      "“Have you ever been?”",
    ],
    [
      "12:15",
      L("关于项目反馈的对话", "A conversation about feedback"),
      "“I also put a lot of work into getting this done.”",
    ],
    [
      "15:00",
      L("一起复盘产品发布", "A launch retrospective"),
      "“If people have to figure out where their notes went, we’re making them work too hard.”",
    ],
  ];
  const caseTitles = {
    myday: L("Michael 的 My Day", "Michael’s My Day"),
    meeting: "Launch Retrospective · Meeting outcomes",
    travel: L("根据对话整理旅行计划", "A travel plan from a conversation"),
    spark: "Spark · Fridge clear-out assistant",
    mentor: L("个人导师", "Your personal mentor"),
    birthday: L("生日关键词搜索", "Birthday keyword search"),
    day: L("Michael 的一天", "A day with Michael"),
  };
  const pageFor = {
    myday: "MyDay_Workplace_Conversation_Reference_Layout.html",
    travel: "smoky-travel-page.html",
    meeting: "meeting-outcome-library.html",
    spark: "spark-fridge-idea.html",
    mentor: "../mentor-classroom.html",
  };
  useEffect(() => {
    const initialHash = window.location.hash;
    let active = true;
    const scrollToInitialSection = () => {
      if (!active || !initialHash || window.location.hash !== initialHash)
        return;
      document
        .getElementById(decodeURIComponent(initialHash.slice(1)))
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    };
    const frame = requestAnimationFrame(scrollToInitialSection);
    document.fonts.ready.then(scrollToInitialSection);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = L(
      "Memova — Apple Watch 全天记录与个人知识库",
      "Memova — Record all day. Build your personal knowledge base.",
    );
  }, [lang]);
  useEffect(() => {
    if (!modal) return;
    returnRef.current = document.activeElement;
    document.body.style.overflow = "hidden";
    setTimeout(() => closeRef.current?.focus(), 30);
    const key = (e) => {
      if (e.key === "Escape") setModal(null);
      if (e.key === "Tab") {
        const nodes = [
            ...document.querySelectorAll(
              ".modal a,.modal button,.modal input,.modal iframe,.modal video",
            ),
          ].filter((n) => !n.disabled),
          first = nodes[0],
          last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key);
      returnRef.current?.focus();
    };
  }, [modal]);
  return (
    <>
      <a className="skip-link" href="#main">
        {L("跳到正文", "Skip to content")}
      </a>
      <header className="site-header" ref={headerRef}>
        <a className="brand" href="#top" aria-label="Memova home">
          <img src={A + "memova-icon-transparent.png"} alt="" />
          <img
            className="brand-wordmark"
            src={A + "memova-wordmark-tight.png"}
            alt="Memova"
          />
        </a>
        <nav className="desktop-navigation" aria-label="Main navigation">
          <a href="#experience" aria-current={activeNav === "experience" ? "location" : undefined}>{L("体验 Memova", "Experience Memova")}</a>
          <a href="#privacy" aria-current={activeNav === "privacy" ? "location" : undefined}>{L("隐私与离线", "Privacy & offline")}</a>
          <a href="#pro" aria-current={activeNav === "pro" ? "location" : undefined}>Memova Pro</a>
          <a className="header-mcp" href={MCP_OVERVIEW_URL} target="_blank" rel="noreferrer" aria-label={L("插件与 MCP · 查看完整连接指南", "Plugins & MCP · Open the complete connection guide")}>
            MCP<ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="language-button"
            onClick={() => {
              setLang(lang === "zh" ? "en" : "zh");
            }}
            aria-label={L("Switch to English", "切换到中文")}
          >
            <Globe size={16} />
            {L("EN", "中文")}
          </button>
          <button
            className="button ghost compact header-community"
            aria-haspopup="dialog"
            aria-label={L("加入社区", "Join the community")}
            onClick={() => setModal("community")}
          >
            <UsersThree size={17} aria-hidden="true" />
            <span className="community-button-label">{L("加入社区", "Join the community")}</span>
          </button>
          <a
            className="button dark compact"
            href={STORE}
            target="_blank"
            rel="noreferrer"
            aria-label={L("在 App Store 下载 Memova AI", "Download Memova AI on the App Store")}
          >
            {L("免费下载", "Download free")}
            <ArrowUpRight size={15} />
          </a>
          <button
            ref={mobileMenuButton}
            className="mobile-menu-toggle"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={L(mobileMenuOpen ? "关闭导航菜单" : "打开导航菜单", mobileMenuOpen ? "Close navigation menu" : "Open navigation menu")}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={23} /> : <List size={23} />}
          </button>
        </div>
        <nav id="mobile-navigation" className="mobile-navigation" aria-label={L("手机导航", "Mobile navigation")} hidden={!mobileMenuOpen}>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)} aria-current={activeNav === "experience" ? "location" : undefined}>{L("体验 Memova", "Experience Memova")}<ArrowDown size={16} /></a>
          <a href="#privacy" onClick={() => setMobileMenuOpen(false)} aria-current={activeNav === "privacy" ? "location" : undefined}>{L("隐私与离线", "Privacy & offline")}<ArrowDown size={16} /></a>
          <a href="#pro" onClick={() => setMobileMenuOpen(false)} aria-current={activeNav === "pro" ? "location" : undefined}>Memova Pro<ArrowDown size={16} /></a>
          <a className="mobile-menu-mcp" href={MCP_OVERVIEW_URL} target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)}>{L("插件与 MCP", "Plugins & MCP")}<ArrowUpRight size={16} aria-hidden="true" /></a>
          <button className="mobile-menu-community" aria-haspopup="dialog" onClick={() => {
            mobileMenuButton.current?.focus({ preventScroll: true });
            setMobileMenuOpen(false);
            setModal("community");
          }}>{L("加入社区", "Join the community")}<UsersThree size={18} aria-hidden="true" /></button>
          <a className="mobile-menu-download" href={STORE} target="_blank" rel="noreferrer" aria-label={L("在 App Store 下载 Memova AI", "Download Memova AI on the App Store")} onClick={() => setMobileMenuOpen(false)}>{L("免费下载 Memova", "Download Memova free")}<ArrowUpRight size={16} /></a>
        </nav>
      </header>
      <main id="main">
        <div className="opening-section">
          <OpeningExperience
            lang={lang}
            stories={storyPages}
            onOpen={setModal}
            frozen={!!modal}
            compact={compact}
          />
        </div>
        <PrivacyBlock lang={lang} onOpenCase={setModal} />
        <ExperienceJourney lang={lang} onOpen={setModal} suspended={Boolean(modal)} />
        <LowerSections lang={lang} onOpenCase={setModal} />
      </main>
      {modal && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <section
            className={
              "modal " +
              (modal === "community" ? "community-modal" : modal === "video" ? "video-modal" : "case-modal") +
              (activeStory ? " story-case-modal" : "")
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button
              className="modal-close"
              ref={closeRef}
              onClick={() => setModal(null)}
              aria-label={modal === "community" ? L("关闭社区邀请", "Close community invitation") : L("关闭预览", "Close preview")}
            >
              <X size={22} />
            </button>
            {modal === "community" ? (
              <>
                <span className="eyebrow">MEMOVA COMMUNITY</span>
                <h2 id="modal-title">{L("一起聊聊你的想法。", "Join the conversation.")}</h2>
                <p className="community-intro">{L(
                  "扫码或打开 Discord，交流想法、认识其他用户，一起参与 Memova 的成长。",
                  "Scan the code or open Discord to share ideas, meet early users, and help shape Memova.",
                )}</p>
                <a className="community-qr" href={COMMUNITY_URL} target="_blank" rel="noreferrer" aria-label={L("打开 Memova Discord 社区", "Open the Memova Discord community")}>
                  <img src={COMMUNITY_QR} alt={L("Memova Discord 社区二维码", "QR code for the Memova Discord community")} width="600" height="600" />
                </a>
                <a className="button dark community-action" href={COMMUNITY_URL} target="_blank" rel="noreferrer">
                  {L("打开 Discord", "Open Discord")}<ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <p className="community-invite-address">discord.gg/E9u5FFvhdu</p>
              </>
            ) : modal === "video" ? (
              <>
                <h2 id="modal-title">
                  {L(
                    "Memova for Apple Watch · 产品短片",
                    "Memova for Apple Watch · Product film",
                  )}
                </h2>
                <video src="/memova-launch.mp4" controls autoPlay playsInline />
              </>
            ) : activeStory ? (
              <>
                <aside className="modal-copy">
                  <span className="eyebrow">MY DAY STORIES</span>
                  <h2 id="modal-title">
                    {L(activeStory.titleZh, activeStory.titleEn)}
                  </h2>
                  <p>
                    {L(activeStory.descriptionZh, activeStory.descriptionEn)}
                  </p>
                  <div className="modal-source-note">
                    <BookOpen size={17} />
                    <span>
                      {L(
                        "原话 · 今日观察 · 一个小提示",
                        "Original words · An observation · A small tip",
                      )}
                    </span>
                  </div>
                  <p className="story-meta">
                    {L(
                      "Memova My Day 示例故事",
                      "A Memova My Day example story",
                    )}
                  </p>
                  <a
                    className="text-link story-page-link"
                    href={activeStory.page}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {L("在新窗口阅读完整网页", "Open the complete page")}
                    <ArrowUpRight size={15} />
                  </a>
                  <div className="story-pager">
                    <span>
                      {String(activeStoryIndex + 1).padStart(2, "0")} /{" "}
                      {String(storyPages.length).padStart(2, "0")}
                    </span>
                    <button
                      aria-label={L("上一个故事", "Previous story")}
                      onClick={() =>
                        setModal(
                          storyPages[
                            (activeStoryIndex - 1 + storyPages.length) %
                              storyPages.length
                          ].id,
                        )
                      }
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      aria-label={L("下一个故事", "Next story")}
                      onClick={() =>
                        setModal(
                          storyPages[(activeStoryIndex + 1) % storyPages.length]
                            .id,
                        )
                      }
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </aside>
                <div className="modal-content">
                  <iframe
                    key={activeStory.id}
                    src={activeStory.page + "?chimeLang=" + lang}
                    title={L(activeStory.titleZh, activeStory.titleEn)}
                    onLoad={(e) => {
                      try {
                        e.currentTarget.contentWindow.addEventListener(
                          "keydown",
                          (event) => {
                            if (event.key === "Escape") setModal(null);
                          },
                        );
                      } catch {}
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <aside className="modal-copy">
                  <span className="eyebrow">
                    {modal === "spark" ? "A REAL SPARK CONVERSATION" : modal === "meeting" ? "MEMOVA / MEETING OUTCOME" : modal === "birthday" ||
                    modal === "mentor"
                      ? L("MEMOVA 产品示例", "A MEMOVA PRODUCT EXAMPLE")
                      : L("MICHAEL 的示例记录", "A SAMPLE DAY WITH MICHAEL")}
                  </span>
                  <h2 id="modal-title">
                    {modal === "meeting"
                      ? caseTitles[modal]
                      : modal === "travel"
                        ? L(
                            <>
                              用同事的推荐，
                              <br />
                              整理旅行计划。
                            </>,
                            caseTitles[modal],
                          )
                        : caseTitles[modal]}
                  </h2>
                  <p>
                    {modal === "day"
                      ? L(
                          "2026 年 10 月 28 日的三段示例记录。打开旅行推荐、职场对话或会议复盘，查看原话及对应结果。",
                          "Three sample records from October 28, 2026. Open the travel recommendation, workplace conversation, or launch review to read its words and results.",
                        )
                      : modal === "meeting"
                        ? "One launch review, organized into original words, highlights and four clear follow-ups. Open each report and check the discussion behind the next step."
                        : modal === "travel"
                          ? L(
                              "从 George 提到的 Cades Cove 出发，查看大烟山旅行计划和地点介绍。",
                              "Read a Smokies travel plan based on George’s recommendation of Cades Cove.",
                            )
                          : modal === "spark"
                            ? "Follow a real Spark exchange, translated into English: capture an idea, explore questions, clarify a choice and review suggested additions."
                            : modal === "mentor"
                              ? L(
                                  "在黑板上打开一张 My Day 提示卡，读一句下次可以尝试的回应。轻拨风铃，还能展开一张小纸条。",
                                  "Open a My Day tip on the blackboard. Find words to try next time, or touch a chime to unfold a little note.",
                                )
                              : L(
                                  "查看原始对话、今日观察和小提示。分析与建议都可以对照原话阅读。",
                                  "Read the original conversation, today’s observation, and a small tip. Check the analysis and suggestions against the original words.",
                                )}
                  </p>
                  <div className="modal-source-note">
                    <BookOpen size={17} />
                    <span>
                      {modal === "spark" ? "English translation of the supplied conversation." : modal === "meeting" ? "Original conversation and follow-up, together." : L(
                        "原话和整理结果一起查看。",
                        "Read the original words alongside the result.",
                      )}
                    </span>
                  </div>
                </aside>
                <div className="modal-content">
                  {pageFor[modal] ? (
                    <iframe
                      onLoad={(e) => {
                        try {
                          e.currentTarget.contentWindow.addEventListener(
                            "keydown",
                            (event) => {
                              if (event.key === "Escape") setModal(null);
                            },
                          );
                        } catch {}
                      }}
                      title={caseTitles[modal]}
                      src={"/examples/" + pageFor[modal] + (modal === "myday" ? "?chimeLang=" + lang : "")}
                    />
                  ) : modal === "birthday" ? (
                    <div className="birthday-preview">
                      <img
                        src={A + "search-birthday.webp"}
                        alt="Birthday search results"
                      />
                      <p>
                        {L(
                          "搜索“生日”，查看相关对话及原始记录。",
                          "Search “birthday” to find the conversations and their original records.",
                        )}
                      </p>
                    </div>
                  ) : modal === "mentor" ? (
                    <div className="spark-preview mentor-preview">
                      <ProFeatureVisual feature={{ key: "mentor", color: "#dce9e3" }} lang={lang} />
                      <span className="tiny-label">
                        {L(
                          "个人导师 · 产品示例",
                          "PERSONAL MENTOR · PRODUCT EXAMPLE",
                        )}
                      </span>
                      <h3>
                        {L(
                          "为什么这段对话让我不舒服？",
                          "Why did that conversation feel uncomfortable?",
                        )}
                      </h3>
                      <p>
                        {L(
                          "个人导师会参考你选择的原话和 HRV 等线索，提供具体沟通建议。打开来源，查看建议所依据的对话。",
                          "Your personal mentor uses the conversations and HRV context you choose to provide to offer communication guidance. Open the sources to read the words behind a suggestion.",
                        )}
                      </p>
                      <button
                        className="button dark"
                        onClick={() => setModal("myday")}
                      >
                        {L(
                          "查看 Michael 的原话与建议",
                          "Read Michael’s conversation and guidance",
                        )}
                        <ArrowUpRight size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="day-detail">
                      <span className="eyebrow">OCTOBER 28, 2026</span>
                      <h3>{caseTitles.day}</h3>
                      {timeline.map((r, i) => (
                        <article key={r[0]}>
                          <time>{r[0]}</time>
                          <h4>{r[1]}</h4>
                          <blockquote>{r[2]}</blockquote>
                          <button
                            className="text-link"
                            onClick={() =>
                              setModal(
                                i === 0
                                  ? "travel"
                                  : i === 2
                                    ? "meeting"
                                    : "myday",
                              )
                            }
                          >
                            {L(
                              "查看这段原话与结果",
                              "Read this conversation and result",
                            )}
                            <ArrowUpRight size={15} />
                          </button>
                        </article>
                      ))}
                      <img
                        src={A + "michael-today.jpg"}
                        alt="Michael day screenshot"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
