import { ArrowUpRight } from "@phosphor-icons/react";
import "./DailyRecapPreview.css";

export function DailyRecapPreview({ lang, onOpen }) {
  const en = lang === "en";
  const src = `/examples/myday-daily-recap.html?lang=${en ? "en" : "zh"}`;
  return (
    <div className="daily-recap-preview">
      <iframe
        key={src}
        src={src}
        title={en ? "Daily Recap: summary, highlights, feedback and memories" : "每日回顾：总结、重点片段、沟通反馈与每日记忆"}
        loading="lazy"
      />
      <div className="daily-recap-preview-footer">
        <span>{en ? "Explore a sample day" : "浏览一天的回顾示例"}</span>
        <button type="button" onClick={onOpen}>
          {en ? "Open the full recap" : "打开完整回顾"}
          <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
