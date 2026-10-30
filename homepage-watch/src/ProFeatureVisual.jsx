import { ChatCircleText, Lightbulb, Sparkle, CheckCircle } from "@phosphor-icons/react";
import "./ProFeatureVisual.css";

const CAMPAIGN_ASSETS = "/assets/pro-campaign-v2/";

/** Large editorial displays made from existing Memova screens and source excerpts. */
export function ProFeatureVisual({ feature, lang = "zh" }) {
  const key = feature?.key || "recap";
  const en = lang === "en";
  const L = (zh, english) => (en ? english : zh);

  return (
    <figure className={`pro-feature-visual pro-feature-visual--${key}`}
      style={{ "--pro-canvas": feature?.color }} data-language={en ? "en" : "zh"}>
      {key === "recap" && <>
        <div className="pro-feature-device pro-feature-device--recap">
          <img src={CAMPAIGN_ASSETS + "myday-cover-screen.webp"} draggable="false" loading="lazy"
            alt={L("Michael 的 My Day 原型：森林封面与 Moments from Today", "Michael’s actual My Day prototype, with its forest cover and Moments from Today")} />
        </div>
        <aside className="pro-feature-excerpt pro-feature-excerpt--recap">
          <span className="pro-feature-excerpt-label"><Lightbulb size={17} aria-hidden="true" />
            {L("MICHAEL 的回顾 · 节选", "FROM MICHAEL’S RECAP")}</span>
          <h4>{L("把反馈，拉回具体工作。", "Ask for work-focused feedback.")}</h4>
          <p>{L("接受有用的批评，也为针对个人的评价划清界限。", "Make room for useful criticism while setting a limit on personal remarks.")}</p>
        </aside>
        <span className="pro-feature-source-tag">MY DAY <span>·</span> OCT 28</span>
      </>}

      {key === "mentor" && <>
        <div className="pro-feature-device pro-feature-device--mentor">
          <img src={CAMPAIGN_ASSETS + "myday-conversation-demo-hrv-v6.png"} draggable="false" loading="lazy"
            alt={L("Michael 对话时段的 Demo HRV 模拟曲线和心情变化推测", "Michael’s prototype conversation with a clearly labelled simulated Demo HRV curve and tentative mood interpretation")} />
        </div>
        <aside className="pro-feature-excerpt pro-feature-excerpt--mentor">
          <span className="pro-feature-excerpt-label"><ChatCircleText size={17} aria-hidden="true" />
            {L("可以尝试这样说 · 示例", "A RESPONSE TO TRY · EXAMPLE")}</span>
          <blockquote>“I appreciate the compliment. What made you think I couldn’t do it?”</blockquote>
          {en ? <p className="pro-feature-excerpt-source">From Michael’s workplace recap</p>
            : <p className="pro-feature-excerpt-source">谢谢你的夸奖。是什么让你觉得我做不到呢？</p>}
        </aside>
        <span className="pro-feature-source-tag">ORIGINAL WORDS <span>→</span> A PRACTICAL REPLY</span>
      </>}

      {key === "spark" && <>
        <span className="pro-feature-source-tag pro-feature-source-tag--spark"><Sparkle size={15} aria-hidden="true" />
          {L("从一条笔记开始", "START WITH A NOTE")}</span>
        <div className="pro-feature-spark-window">
          <img src={CAMPAIGN_ASSETS + "spark-tools-transparent.png"} draggable="false" loading="lazy"
            alt={L("Memova Spark 宣传实例：Building in public 笔记，以及 Enhance 改写、Explore 追问、Knowledge Base 来源和 Highlight 重点", "Memova Spark’s existing promotional example: a Building in public note, Enhance before and after, Explore follow-up, Knowledge Base source, and Highlight key idea")} />
        </div>
      </>}

      {key === "meeting" && <>
        <div className="pro-feature-browser">
          <div className="pro-feature-browser-bar" aria-hidden="true">
            <i /><i /><i /><span>Memova · Launch Retrospective</span>
          </div>
          <img src="/assets/meeting-library-preview.png" draggable="false" loading="lazy"
            alt="English meeting outcome with Transcript, Highlights and Summary report covers" />
        </div>
        <aside className="pro-feature-excerpt pro-feature-excerpt--meeting">
          <span className="pro-feature-excerpt-label"><CheckCircle size={17} aria-hidden="true" />
            {L("发布复盘 · 后续分工", "LAUNCH REVIEW · NEXT STEPS")}</span>
          <h4>{L("先收集证据，再评估方案。", "Collect evidence. Then evaluate.")}</h4>
          <p>{L("Michael · 用户反馈　 Jordan · 界面探索", "Michael · User feedback　 Jordan · Interface exploration")}</p>
        </aside>
      </>}

      <figcaption className="pro-feature-visual-caption">
        {L("Michael 案例与 Memova 产品示例。标注框用于放大说明已有内容。", "Michael’s case and existing Memova product examples. Excerpt panels enlarge the corresponding source content.")}
      </figcaption>
    </figure>
  );
}

export default ProFeatureVisual;
