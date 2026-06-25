import { useEffect } from "react";
import demoHtml from "./bay-area-agent-demo-2/demo.html?raw";

const PAGE_TITLE = "湾区买房首次咨询 for Violet";
const PAGE_DESCRIPTION =
  "为 Violet 整理的湾区 relocation first-time buyer 首次买房咨询：区域建议、术语扫盲、购房流程与行动清单。";

export default function BayAreaAgentDemo2() {
  useEffect(() => {
    const previousTitle = document.title;
    const previousLang = document.documentElement.lang;
    const description = getOrCreateMeta("description");
    const robots = getOrCreateMeta("robots");
    const previousDescription = description.getAttribute("content");
    const previousRobots = robots.getAttribute("content");

    document.title = PAGE_TITLE;
    document.documentElement.lang = "zh-CN";
    description.setAttribute("content", PAGE_DESCRIPTION);
    robots.setAttribute("content", "noindex, nofollow");

    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLang;
      restoreMeta(description, previousDescription);
      restoreMeta(robots, previousRobots);
    };
  }, []);

  return (
    <iframe
      srcDoc={demoHtml}
      title={PAGE_TITLE}
      className="fixed inset-0 h-dvh w-full border-0 bg-[#fefcf6]"
    />
  );
}

function getOrCreateMeta(name: string): HTMLMetaElement {
  const existing = document.head.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`
  );
  if (existing) return existing;

  const meta = document.createElement("meta");
  meta.name = name;
  meta.dataset.hiddenDemoMeta = "true";
  document.head.appendChild(meta);
  return meta;
}

function restoreMeta(meta: HTMLMetaElement, previousContent: string | null) {
  if (meta.dataset.hiddenDemoMeta === "true") {
    meta.remove();
    return;
  }

  if (previousContent === null) {
    meta.removeAttribute("content");
  } else {
    meta.setAttribute("content", previousContent);
  }
}
