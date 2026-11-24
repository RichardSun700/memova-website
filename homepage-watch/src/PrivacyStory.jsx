import { useEffect, useRef, useState } from "react";
import { Cloud, Microphone, X } from "@phosphor-icons/react";
import "./PrivacyStory.css";

export function PrivacyStory({ lang = "en" }) {
  const zh = lang === "zh";
  const [expanded, setExpanded] = useState(false);
  const details = useRef(null);
  const detailsTitle = useRef(null);
  const trigger = useRef(null);
  const L = (chinese, english) => zh ? chinese : english;

  useEffect(() => {
    if (!expanded) return;
    const frame = requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      details.current?.scrollIntoView({ block: "start", behavior: reduce ? "instant" : "smooth" });
      detailsTitle.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [expanded]);

  const close = () => {
    setExpanded(false);
    trigger.current?.focus({ preventScroll: false });
  };

  return (
    <section className="privacy-story" id="privacy" data-narrative-block="2" aria-labelledby="privacy-story-title" data-lang={zh ? "zh" : "en"}>
      <div className="privacy-story-stage">
        <header className="privacy-story-header">
          <p className="privacy-story-eyebrow">{L("无需注册账号", "NO ACCOUNT NEEDED")}</p>
          <h2 id="privacy-story-title">
            {zh ? <>你的生活记录，<em>保存在你的手机。</em></> : <>Your journal lives <em>on your phone.</em></>}
          </h2>
          <p className="privacy-story-intro">{L("录音、笔记与 AI 成果，由你保存。", "Recordings, notes and AI results. Yours to keep.")}</p>
          <div className="privacy-story-actions">
            <button ref={trigger} type="button" aria-controls="privacy-story-details" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>
              {L("了解隐私如何工作", "See how privacy works")}
            </button>
            <a href={`/privacy/?lang=${zh ? "zh" : "en"}`}>{L("阅读隐私政策", "Read the privacy policy")}</a>
          </div>
        </header>

        <div className="privacy-story-scene">
          <aside className="privacy-story-note privacy-story-note--start">
            <Microphone size={48} weight="regular" aria-hidden="true" />
            <h3>{L(<>打开 App，<br />开始记录。</>, <>Open the app.<br />Start recording.</>)}</h3>
          </aside>
          <div className="privacy-story-phone">
            <img src={`/assets/privacy-v2/days-phone-${zh ? "zh" : "en"}.jpg`} width="820" height="1674" loading="lazy" decoding="async"
              alt={L("Memova Days 真实原型画面：当日事件、全部分类与同步图标。", "Actual Memova Days prototype: daily events, the All filter and sync icon.")} />
          </div>
          <aside className="privacy-story-note privacy-story-note--cloud">
            <Cloud size={56} weight="regular" aria-hidden="true" />
            <h3>{L(<>是否使用云端，<br />由你选择。</>, <>Cloud processing<br />is your choice.</>)}</h3>
            <p>{L("由 Azure 处理。音频转写完成即删除；其他任务内容下载后即删除，最多临时保留 24 小时。", "Processed by Azure. Audio deleted after transcription. Other content deleted on download, within 24 hours.")}</p>
          </aside>
          <p className="privacy-story-mcp">{L("MCP 连接需要独立账号与授权。", "MCP connections require an account.")}</p>
        </div>
      </div>

      <div className="privacy-story-details" id="privacy-story-details" ref={details} hidden={!expanded}>
        <div className="privacy-story-details-heading">
          <h3 ref={detailsTitle} tabIndex={-1}>{L("本机保存，云端按需处理。", "Saved on your phone. Cloud by choice.")}</h3>
          <button type="button" onClick={close} aria-label={L("收起隐私说明", "Close privacy details")}><X size={22} /></button>
        </div>
        <div className="privacy-story-rules">
          <div>
            <h4>{L("无需账号，也能使用云端功能", "No account, including cloud features")}</h4>
            <p>{L("录音、本地与云端转写、搜索及 App 内 AI 功能均无需 Memova 账号。云端处理仍需网络及你的许可；订阅与额度按 App 说明。", "Recording, local and cloud transcription, search and in-app AI work without a Memova account. Cloud processing still needs a connection and your permission; in-app subscription and usage limits apply.")}</p>
          </div>
          <div>
            <h4>{L("音频：转写完成即删除", "Audio: deleted after transcription")}</h4>
            <p>{L("本地转写在设备上完成。选择云端转写时，所选音频由微软 Azure 处理，完成转写后立即删除云端音频。", "On-device transcription stays on your device. If you choose cloud transcription, Microsoft Azure processes the selected audio and the cloud audio is deleted immediately when transcription completes.")}</p>
          </div>
          <div>
            <h4>{L("文字与成果：下载即删除，最长 24 小时", "Text and results: deleted on download, within 24 hours")}</h4>
            <p>{L("转写、摘要、Ask、灵感与每日回顾保存在手机。Azure 任务内容仅临时处理中转；App 未打开时可暂存待下载结果，最长 24 小时，下载到手机后立即删除。App 不提供云端资料同步。", "Transcripts, summaries, Ask, ideas and daily recaps are saved on your phone. Azure task content is temporary; results may wait for download while the app is closed, for at most 24 hours, and are deleted immediately after download. The app does not provide cloud content sync.")}</p>
          </div>
        </div>
        <button className="privacy-story-close" type="button" onClick={close}>{L("收起说明，继续浏览", "Close details and keep exploring")}</button>
      </div>
    </section>
  );
}
