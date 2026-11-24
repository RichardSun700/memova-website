import React from "react";
import { ArrowUpRight, Microphone, Check } from "@phosphor-icons/react";
import { SearchVideo } from "./SearchVideo";
import { ProductDemoVideo } from "./ProductDemoVideo";
import { useExperienceJourney } from "./useExperienceJourney";

export function ExperienceJourney({ lang, onOpen, suspended = false }) {
  const L = (zh, en) => lang === "zh" ? zh : en;
  const { runwayRef, stickyRef, chapter, reduced, scrollDriven, navigate, onTabKeyDown } = useExperienceJourney({ count: 3 });
  const chapterNames = L(["按时间回看", "My\u00a0Day 回顾", "离线搜索"], ["Timeline", "My\u00a0Day", "Offline search"]);
  return (
        <section className="experience-section" id="experience">
          <span id="capture" aria-hidden="true" style={{ display: "block", height: 0, scrollMarginTop: 80 }} />
          <span id="act" aria-hidden="true" style={{ display: "block", height: 0, scrollMarginTop: 80 }} />
          <div className="section-shell">
            <div className="section-heading">
              <span className="eyebrow">
                {L(
                  "时间轴 · 每日回顾 · 离线搜索",
                  "TIMELINE · MY DAY · OFFLINE SEARCH",
                )}
              </span>
              <h2>
                {L(
                  <>
                    按时间查看对话，
                    <br />
                    回看当天的重点。
                  </>,
                  <>
                    Read your conversations.
                    <br />
                    Review the key moments.
                  </>,
                )}
              </h2>
              <p>
                {L(
                  "从原话到重点，按需回看与搜索。",
                  "Find the words, revisit the highlights and review your day.",
                )}
              </p>
            </div>
            <div className="experience-runway" ref={runwayRef}>
              <div
                className="journey-sticky"
                ref={stickyRef}
                data-scroll-driven={scrollDriven}
                data-reduced={reduced}
              >
            <div
              className="chapter-tabs"
              role="tablist"
              aria-label="Memova experience"
            >
              {["Timeline", "My Day", "Search"].map((n, i) => (
                <button
                  key={n}
                  role="tab"
                  id={"chapter-tab-" + i}
                  aria-controls={"chapter-panel-" + i}
                  tabIndex={chapter === i ? 0 : -1}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  aria-selected={chapter === i}
                  onClick={() => navigate(i)}
                >
                  <span>0{i + 1}</span>
                  {chapterNames[i]}
                  <span className="chapter-english">{n === "My Day" ? "My\u00a0Day" : n}</span>
                </button>
              ))}
            </div>
            <div className="journey-panels">
              {[0, 1, 2].map((step) => (
            <div
              className="experience-layout journey-panel"
              key={step}
              style={{ "--panel-index": step }}
              data-front={chapter === step}
              inert={chapter !== step}
              aria-hidden={chapter !== step}
              role="tabpanel"
              id={"chapter-panel-" + step}
              aria-labelledby={"chapter-tab-" + step}
            >
              <aside className="experience-copy">
                <span className="tiny-label">
                  {["TIMELINE", "MY\u00a0DAY", "OFFLINE SEARCH"][step]}
                </span>
                <h3>
                  {step === 0
                    ? L(
                        <>
                          点开事件，
                          <br />
                          回看对话重点。
                        </>,
                        <>
                          Open an event.
                          <br />
                          Review the key points.
                        </>,
                      )
                    : step === 1
                      ? L(
                          <>
                            把今天的对话，
                            <br />
                            留成每日回顾。
                          </>,
                          <>
                            Review your day.
                            <br />
                            Keep what matters.
                          </>,
                        )
                      : L(
                          <>
                            模糊搜索，
                            <br />
                            找回原话。
                          </>,
                          <>
                            Search a clue.
                            <br />
                            Find the original words.
                          </>,
                        )}
                </h3>
                <p>
                  {step === 0
                    ? L(
                        "直接打开当天事件，展开摘要，再查看对应原话。",
                        "Open an event from your day, expand a key point and check the original words.",
                      )
                    : step === 1
                      ? L(
                          "从一张明信片开始，回看总结、重点片段、沟通反馈与每日记忆。想了解更多，随时展开原话与来源。",
                          "Start with a postcard. Revisit your summary, highlights, communication feedback and daily memories, with the original words close at hand.",
                        )
                      : L(
                          "输入记得的几个词，离线找回相关原话和时间。",
                          "Search a few remembered words to find the original conversation and its time, even offline.",
                        )}
                </p>
                {step === 0 ? (
                  <>
                    <a className="text-link" href="#watch-demo">
                      <Microphone size={16} />{L("体验手表记录", "Try recording on Watch")}
                    </a>
                    <button
                      className="text-link secondary-link"
                      onClick={() => onOpen("meeting")}
                    >
                      {L("查看会议原话", "Read the original conversation")}
                      <ArrowUpRight size={15} />
                    </button>
                  </>
                ) : step === 1 ? (
                  <>
                    <button
                      className="text-link"
                      onClick={() => onOpen("myday")}
                    >
                      {L("打开 My\u00a0Day", "Explore My\u00a0Day")}
                      <ArrowUpRight size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="offline-tag">
                      <Check size={14} />
                      {L("离线也能找回", "Available offline")}
                    </div>
                  </>
                )}
              </aside>
              <div className="experience-stage">
                {step === 0 && (
                  <ProductDemoVideo
                    lang={lang} active={chapter === 0} suspended={suspended} kind="timeline"
                    src="/assets/video/timeline-events-v7.mp4?v=4ee12fab" poster="/assets/video/timeline-events-v7-poster.jpg?v=130e6c90"
                    description={L(
                      "Timeline 最新原型操作（英文界面）：从 Days 打开 15:00–15:30 的发布复盘事件，查看 Summary，展开摘要并核对对应 Transcript 原话，再回到会话总览与原事件列表。内容为原型示例。",
                      "Latest Timeline prototype demo in English: open the 15:00–15:30 Launch Retrospective from Days, read Summary, expand a digest and check the corresponding Transcript passages, then return to the conversation overview and original event list. Uses prototype sample content.",
                    )}
                    caption={L("按事件回看对话。", "Revisit a conversation from your day.")}
                    chapters={[
                      {time: 3.033333, seekTime: 6.033333, label: L("选择事件", "Selected event")},
                      {time: 11.1, seekTime: 12.1, label: L("对话摘要", "Summary")},
                      {time: 21.233333, seekTime: 22.733333, label: L("查看原话", "Original words")},
                      {time: 30.966667, seekTime: 32.566667, label: L("返回时光", "Back to Days")},
                    ]}
                  />
                )}
                {step === 1 && (
                  <ProductDemoVideo
                    lang={lang} active={chapter === 1} suspended={suspended} kind="myday"
                    src="/assets/video/myday-four-sections-v9.mp4?v=4467c03e" poster="/assets/video/myday-four-sections-v9-poster.jpg?v=e1e1a508"
                    description={L(
                      "My Day 最新原型操作（英文界面）：从 Days 信封揭晓进入每日回顾，浏览总结、重点片段、沟通反馈与每日记忆，展开重点片段的原话并核对独立反馈示例的来源，最后返回记录页的每日回顾。每日记忆为待选择保存的候选，内容为原型示例。",
                      "Latest My Day prototype demo in English: open the Daily Recap from its Days envelope, explore Summary, Highlights, Feedback and Memories, expand the words behind a highlight and check the separate feedback example’s source, then return to Record’s Daily Recap collection. Memories are candidates to review before saving. Uses prototype sample content.",
                    )}
                    caption={L("浏览一天的四栏目回顾。", "Review your day across four sections.")}
                    chapters={[
                      {time: 5.233333, seekTime: 7.033333, label: L("总结", "Summary")},
                      {time: 9.233333, seekTime: 10.333333, label: L("重点片段", "Highlights")},
                      {time: 20.7, seekTime: 21.9, label: L("沟通反馈", "Feedback")},
                      {time: 28.6, seekTime: 29.9, label: L("每日记忆", "Memories")},
                    ]}
                  />
                )}
                {step === 2 && <SearchVideo lang={lang} active={chapter === 2 && !suspended} />}
              </div>
            </div>
              ))}
            </div>
            <div className="experience-bottom">
              <span>{L("产品操作演示", "Product demos")}</span>
            </div>
              </div>
            </div>
          </div>
        </section>
  );
}
