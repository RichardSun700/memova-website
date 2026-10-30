import { useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { ProCampaignStage } from "./ProCampaignStage";
import "./ProOverview.css";

export function ProOverview({
  copy,
  lang = "zh",
  billing,
  setBilling,
  price,
  onOpenCase,
  appStoreUrl,
}) {
  const language = lang === "en" ? "en" : "zh";
  const L = (zh, en) => (language === "zh" ? zh : en);
  const features = copy.proFeatures || [];
  const [selected, setSelected] = useState(0);
  const active = Math.min(selected, Math.max(0, features.length - 1));
  return (
    <div className="pro-overview" data-lang={language}>
      <ProCampaignStage
        features={features} active={active} lang={language}
        onSelect={setSelected} onOpenCase={onOpenCase}
      />

      <div className="pro-overview-plan">
        <div className="pro-overview-purchase">
        <p className="pro-overview-paid-label">MEMOVA PRO</p>
        <div className="pro-overview-controls">
          <div className="pro-overview-billing" role="group" aria-label={copy.billingLabel}>
            <button type="button" aria-pressed={billing === "monthly"}
              onClick={() => setBilling("monthly")}>{copy.monthly}</button>
            <button type="button" aria-pressed={billing === "annual"}
              onClick={() => setBilling("annual")}>{copy.annual}</button>
          </div>
        </div>
        <div className="pro-overview-price-action">
          <p className="pro-overview-price" aria-live="polite" aria-atomic="true">
            <strong>{price}</strong>
            <span>{billing === "annual" ? copy.perYear : copy.perMonth}</span>
          </p>
          <a className="pro-overview-download" href={appStoreUrl} target="_blank" rel="noreferrer" aria-label={L("在 App Store 下载 Memova AI", "Download Memova AI on the App Store")}>
            {L("下载 Memova", "Get Memova")}<ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        </div>
        <p className="pro-overview-terms">
          {L(
            "以上以美元展示，实际价格与自动续订条款请在 App 内确认。",
            "Prices shown in USD. Confirm the price and auto-renewal terms in the app.",
          )}
        </p>
      </div>
    </div>
  );
}

export default ProOverview;
