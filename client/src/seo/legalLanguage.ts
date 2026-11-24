import { useEffect, useState } from "react";

export type LegalLanguage = "en" | "zh";

const STORAGE_KEY = "memova.site-language.v1";
const SITE_ORIGIN = "https://memova.ai";

type LanguageWindow = Window & {
  MemovaLanguage?: {
    readonly language: LegalLanguage;
    setLanguage: (language: LegalLanguage) => void;
  };
};

function normalizeLanguage(value: unknown): LegalLanguage | null {
  return value === "en" || value === "zh" ? value : null;
}

export function readLegalLanguage(): LegalLanguage {
  if (typeof window === "undefined") return "en";
  const fromUrl = normalizeLanguage(
    new URL(window.location.href).searchParams.get("lang")
  );
  if (fromUrl) return fromUrl;
  const shared = normalizeLanguage((window as LanguageWindow).MemovaLanguage?.language);
  if (shared) return shared;
  try {
    return normalizeLanguage(window.localStorage.getItem(STORAGE_KEY)) || "en";
  } catch {
    return "en";
  }
}

export function setLegalLanguage(language: LegalLanguage) {
  const shared = (window as LanguageWindow).MemovaLanguage;
  if (shared) {
    shared.setLanguage(language);
    return;
  }
  // The document remains usable if the shared script fails to load.
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Storage can be unavailable in a private browser session.
  }
  const url = new URL(window.location.href);
  url.searchParams.set("lang", language);
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  document.documentElement.dataset.siteLanguage = language;
  window.dispatchEvent(new CustomEvent("memova:languagechange", { detail: { language } }));
}

export function useLegalLanguage(): LegalLanguage {
  const [language, setLanguage] = useState<LegalLanguage>(readLegalLanguage);
  useEffect(() => {
    const sync = () => setLanguage(readLegalLanguage());
    const onLanguageChange = (event: Event) => {
      const next = normalizeLanguage((event as CustomEvent<{ language?: unknown }>).detail?.language);
      setLanguage(next || readLegalLanguage());
    };
    window.addEventListener("memova:languagechange", onLanguageChange);
    window.addEventListener("popstate", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("pageshow", sync);
    sync();
    return () => {
      window.removeEventListener("memova:languagechange", onLanguageChange);
      window.removeEventListener("popstate", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("pageshow", sync);
    };
  }, []);
  return language;
}

export function withLegalLanguage(href: string, language: LegalLanguage): string {
  const url = new URL(href, SITE_ORIGIN);
  if (url.origin !== SITE_ORIGIN || href.startsWith("#")) return href;
  url.searchParams.set("lang", language);
  return url.pathname + url.search + url.hash;
}

export function getLegalPageMetadata(pathname: string, language: LegalLanguage) {
  const path = pathname.split(/[?#]/)[0].replace(/\/$/, "");
  const privacy = path === "/privacy" || path === "/privacy-policy";
  if (!privacy && path !== "/terms") return null;
  return {
    title: privacy
      ? language === "zh"
        ? "隐私政策 | Memova – Apple Watch 录音 App"
        : "Privacy Policy | Memova – Apple Watch Voice Recorder"
      : language === "zh"
        ? "服务条款 — Memova"
        : "Terms of Service — Memova",
    description: language === "zh"
      ? privacy
        ? "了解 Memova Apple Watch 与 iPhone 录音 App 的本地离线功能、可选 Azure 云端处理、无需账号使用、健康数据单独许可及最长24小时临时留存与删除规则。"
        : "了解使用 Memova 网站、应用、账号、云端 AI、订阅和相关服务的条款。"
      : privacy
        ? "How Memova handles data: local recording, offline transcription and search, optional Azure cloud processing, and temporary retention of up to 24 hours."
        : "Review the terms that govern access to and use of Memova products, websites, software, integrations, and related services.",
    htmlLang: language === "zh" ? "zh-CN" : "en-US",
  };
}
