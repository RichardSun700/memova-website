import { FileText, Highlighter, ListBullets } from "@phosphor-icons/react";
import "./CloudOutcomeCover.css";

const text = (value, lang) => typeof value === "string" ? value : value?.[lang] || value?.en || "";

// The two meeting examples share a full editorial page composition.
// These are static covers; the footer describes the actual report's three tabs.
export function CloudOutcomeCover({ preview, lang, image, alt, loading }) {
  const lines = preview.coverLines?.[lang] || preview.coverLines?.en || [text(preview.heading, lang)];
  return (
    <span className="cloud-cover-document cloud-result-image" aria-hidden="true">
      <span className="cloud-cover-editorial">
        <span className="cloud-cover-copy">
          <span className="cloud-cover-kicker">{text(preview.label, lang)}</span>
          <strong className="cloud-cover-title">{lines.map((line, index) => <span key={index}>{line}</span>)}</strong>
          <span className="cloud-cover-caption">{text(preview.coverCaption, lang)}</span>
        </span>
        <span className="cloud-cover-photo"><img src={image} alt={alt} loading={loading} /></span>
        <span className="cloud-cover-footer">
          <span><FileText size={11} />Transcript</span>
          <span><Highlighter size={11} />Highlights</span>
          <span><ListBullets size={11} />Summary</span>
        </span>
      </span>
    </span>
  );
}
