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
                          打开记录，
                          <br />
                          查看本地转录。
                        </>,
                        <>
                          Open a recording.
                          <br />
                          Read its transcript.
                        </>,
                      )
                    : step === 1
                      ? L(
                          <>
                            查看 HRV 变化，
                            <br />
                            回看当时的对话。
                          </>,
                          <>
                            Review HRV changes.
                            <br />
                            Revisit the conversation.
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
                        "按小时查看原话、重点和总结，随时回到对话现场。",
                        "Open any hour to read the transcript, highlights and summary.",
                      )
                    : step === 1
                      ? L(
                          "对照你选择提供的 HRV 线索与当时的对话，获得复盘建议和相关阅读。",
                          "Connect the HRV context you choose to share with that conversation, practical advice and further reading.",
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
                    src="/assets/video/timeline-meeting-v6.mp4?v=248e74fe" poster="/assets/video/timeline-meeting-v6-poster.jpg?v=2efb079b"
                    description={L(
                      "Timeline 真实原型操作：选择 15:00–16:00 的产品复盘会议，查看用户问题、证据要求与下次评审三条重点，定位到 26:10 的原话，再查看同一小时的背景、决定、负责人、下次评审和待确认事项。",
                      "Actual Timeline prototype: choose the 15:00–16:00 launch review, read highlights about the user problem, evidence and next review, verify the original quote at 26:10, then check the same hour’s context, decision, owners, next review and open items.",
                    )}
                    caption={L("按时段回看对话。", "Revisit an hour of your day.")}
                    chapters={[
                      {time: 0, seekTime: 3.7, revisitAt: 38.366667, label: L("选择时段", "Selected hour")},
                      {time: 5.133333, seekTime: 5.833333, label: L("查看原话", "Transcript")},
                      {time: 6.866667, seekTime: 13.8, label: L("重点与原话", "Highlights")},
                      {time: 22.933333, seekTime: 26.533333, label: L("决定与分工", "Summary")},
                    ]}
                  />
                )}
                {step === 1 && (
                  <ProductDemoVideo
                    lang={lang} active={chapter === 1} suspended={suspended} kind="myday"
                    src="/assets/video/myday-context-comic-v8.mp4?v=f06c5056" poster="/assets/video/myday-context-comic-v8-poster.jpg?v=e1b1c35c"
                    description={L(
                      "My Day 真实原型操作：展开 Demo HRV 曲线，对照同一时段的原话和上下文解读，查看今日观察、回应建议与相关阅读，为类似情境做准备。HRV 数值、时间与参考基线均为模拟数据。",
                      "Actual My Day prototype: review the Demo HRV interval alongside the original conversation and contextual interpretation, then explore Today’s Observation, practical advice and further reading. HRV values, sample times and the reference baseline are simulated.",
                    )}
                    caption={L("结合对话，回顾今天。", "Review your day in context.")}
                    chapters={[
                      {time: 0, seekTime: 4.8, revisitAt: 31.5, label: L("打开回顾", "Open My Day")},
                      {time: 7.148, seekTime: 10.5, label: L("模拟 HRV", "Demo HRV")},
                      {time: 12.5, seekTime: 15.2, label: L("结合上下文", "Review the context")},
                      {time: 19.026, seekTime: 21.7, label: L("今日观察", "Observation")},
                      {time: 25.005, seekTime: 27.4, label: L("回应建议", "Practical advice")},
                      {time: 28.2, seekTime: 29.5, label: L("相关阅读", "Further reading")},
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
