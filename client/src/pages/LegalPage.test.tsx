import { Fragment, act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { parseHTML } from "linkedom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PrivacyPolicyPage, TermsOfServicePage, renderLegalInline } from "./LegalPage";
import SiteMetadata from "@/seo/SiteMetadata";
import { AuthProvider } from "@/contexts/AuthContext";

const route = vi.hoisted(() => ({ path: "/privacy" }));
vi.mock("wouter", () => ({ useLocation: () => [route.path] }));

const roots: Root[] = [];
afterEach(async () => {
  for (const root of roots.splice(0)) await act(() => root.unmount());
  vi.unstubAllGlobals();
});

async function fixture({
  url = "https://memova.ai/privacy",
  stored,
  blocked = false,
  metadataOnly = false,
}: { url?: string; stored?: string; blocked?: boolean; metadataOnly?: boolean } = {}) {
  const { document, window } = parseHTML('<html lang="en"><head><title>Memova</title></head><body><div id="root"></div></body></html>');
  const location = new URL(url);
  const data = new Map(stored ? [["memova.site-language.v1", stored]] : []);
  Object.assign(window, {
    location,
    history: {
      state: { retained: true },
      replaceState: vi.fn((_state: unknown, _title: string, path: string) => {
        location.href = new URL(path, location.href).href;
      }),
    },
    localStorage: {
      getItem: (key: string) => { if (blocked) throw new Error("blocked"); return data.get(key) || null; },
      setItem: (key: string, value: string) => { if (blocked) throw new Error("blocked"); data.set(key, value); },
      removeItem: (key: string) => data.delete(key),
    },
    matchMedia: vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    requestAnimationFrame: vi.fn(() => 1),
    cancelAnimationFrame: vi.fn(),
    MemovaLanguage: undefined,
  });
  route.path = location.pathname;
  vi.stubGlobal("window", window);
  vi.stubGlobal("document", document);
  vi.stubGlobal("localStorage", window.localStorage);
  vi.stubGlobal("requestAnimationFrame", window.requestAnimationFrame);
  vi.stubGlobal("cancelAnimationFrame", window.cancelAnimationFrame);
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  Object.defineProperty(document, "fonts", { value: { ready: Promise.resolve() }, configurable: true });
  vi.stubGlobal("CustomEvent", window.CustomEvent);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const root = createRoot(document.getElementById("root")!);
  roots.push(root);
  const page = route.path.startsWith("/terms") ? TermsOfServicePage : PrivacyPolicyPage;
  await act(() => root.render(createElement(AuthProvider, null,
    createElement(Fragment, null, createElement(SiteMetadata), metadataOnly ? null : createElement(page))
  )));
  return { document, window, location, data, root };
}

describe("complete bilingual legal documents", () => {
  it.each([
    ["privacy", "en", "Privacy Policy", "20. Contact Information"],
    ["privacy", "zh", "隐私协议", "20. 联系方式"],
    ["terms", "en", "Terms of Service", "21. Contact Us"],
    ["terms", "zh", "服务条款", "21. 联系我们"],
  ])("renders the full %s document in %s, including its final section", async (path, language, title, finalSection) => {
    const f = await fixture({ url: `https://memova.ai/${path}?lang=${language}` });
    const article = f.document.querySelector("article")!;
    expect(article.querySelector("h1")!.textContent).toBe(title);
    expect(article.textContent).toContain(finalSection);
    expect(article.textContent).toContain(language === "zh" ? "微软 Azure 云平台" : "Microsoft Azure");
    expect(article.querySelector("h1")!.nextElementSibling?.textContent).toBe(
      language === "zh"
        ? `${path === "privacy" ? "更新日期" : "最后更新"}：2026年11月5日`
        : "Last updated: November 5, 2026"
    );
    expect(article.textContent).not.toMatch(/预览修订稿|尚未上线|尚未生效|(?:review|preview) revision|not (?:yet )?(?:published|effective)/i);
    expect(article.querySelectorAll("h2")).toHaveLength(path === "privacy" ? 20 : 21);
    expect(article.getAttribute("lang")).toBe(language === "zh" ? "zh-CN" : "en");
    expect(article.hasAttribute("data-no-translate")).toBe(true);
    expect(f.document.documentElement.lang).toBe(language === "zh" ? "zh-CN" : "en-US");
    expect(f.document.title).toBe(`${title} — Memova`);
    expect(JSON.parse(f.document.querySelector("#memova-structured-data")!.textContent!).inLanguage).toBe(language === "zh" ? "zh-CN" : "en-US");
    for (const chrome of [f.document.querySelector("header")!, f.document.querySelector("footer")!]) {
      expect(chrome.querySelector('img[src="/brand/memova-app-icon-liquid-blue.svg"]')).not.toBeNull();
      expect(chrome.querySelector('img[src="/brand/memova-wordmark-blue.svg"]')).not.toBeNull();
      expect(chrome.querySelector("[src*=memova_logo_0eb30acc]")).toBeNull();
    }
  });

  it.each(["en", "zh"])("renders the recording and deletion rules with a readable cloud-service list in %s", async language => {
    const f = await fixture({ url: `https://memova.ai/privacy?lang=${language}` });
    const article = f.document.querySelector("article")!;
    const text = article.textContent!;
    const requiredCopy = language === "zh" ? [
      "原始录音在设备本地转写成文字",
      "云端仅处理您选择并授权的转写文字",
      "保存期限最长不超过30天",
      "该30天上限适用于 Memova 管理的原始音频",
      "删除一条转写，不会自动删除现有笔记、摘要",
      "其后续使用仍受相应功能及您的授权范围限制",
    ] : [
      "Recording and transcription take place on your device",
      "limited to transcript text and textual context you authorize",
      "retained for no more than 30 days",
      "This maximum applies only to app-managed original audio",
      "Deleting a transcript does not automatically delete existing notes, summaries",
      "Further use of retained content remains subject to the scope you authorize",
    ];
    for (const copy of requiredCopy) expect(text).toContain(copy);
    const services = Array.from(article.querySelectorAll("ul")).find(list => list.textContent?.includes("Azure Blob"));
    expect(services).toBeTruthy();
    expect(services!.querySelectorAll("li")).toHaveLength(12);
    expect(services!.textContent).not.toMatch(/Azure AI Speech|云端语音服务/);
    expect(text).not.toContain("|");
  });

  it.each(["en", "zh"])("renders third-party sign-in separately from connected-service permissions in %s", async language => {
    const f = await fixture({ url: `https://memova.ai/privacy?lang=${language}` });
    const text = f.document.querySelector("article")!.textContent!;
    const requiredCopy = language === "zh" ? [
      "17. 第三方登录与已连接服务",
      "Apple 登录。",
      "Microsoft 登录。",
      "隐藏邮件地址",
      "使用上述登录方式本身不构成对这些内容的访问授权",
      "谷歌邮箱权限。",
      "谷歌日历权限。",
      "有限使用要求",
      "使用 Azure 基础设施不自动授予 Memova 访问您 Microsoft 账号内容的权限",
    ] : [
      "17. Third-Party Sign-In and Connected Services",
      "Sign in with Apple.",
      "Microsoft sign-in.",
      "Hide My Email",
      "Using one of these sign-in methods does not itself authorize access to that content",
      "Gmail permissions.",
      "Google Calendar permissions.",
      "Limited Use requirements",
      "Using Azure infrastructure does not automatically authorize Memova to access the content of your Microsoft account",
    ];
    for (const copy of requiredCopy) expect(text).toContain(copy);
  });

  it("honors an explicit URL language ahead of a stored choice and switches the body, metadata and navigation together", async () => {
    const f = await fixture({ url: "https://memova.ai/privacy-policy?lang=en&source=review#health", stored: "zh" });
    expect(f.document.querySelector("h1")!.textContent).toBe("Privacy Policy");
    await act(() => (f.document.querySelector('main button[lang="zh-CN"]') as HTMLButtonElement).click());
    expect(f.document.querySelector("h1")!.textContent).toBe("隐私协议");
    expect(f.document.querySelector("article")!.textContent).toContain("健康测量不用于决定普通会议议题");
    expect(f.document.title).toBe("隐私协议 — Memova");
    expect(f.document.querySelector('meta[name="description"]')!.getAttribute("content")).toContain("健康关联");
    expect(f.document.documentElement.lang).toBe("zh-CN");
    expect(f.location.searchParams.get("source")).toBe("review");
    expect(f.location.hash).toBe("#health");
    expect(f.data.get("memova.site-language.v1")).toBe("zh");
    for (const link of Array.from(f.document.querySelectorAll("header a, footer a, main nav a"))) {
      const href = link.getAttribute("href") || "";
      if (href.startsWith("/")) expect(href).toContain("lang=zh");
    }
    await act(() => (f.document.querySelector('main button[lang="en"]') as HTMLButtonElement).click());
    expect(f.document.querySelector("article")!.textContent).not.toContain("健康测量不用于决定普通会议议题");
    expect(f.document.title).toBe("Privacy Policy — Memova");
  });

  it("uses the stored language without a URL choice and remains usable when storage is blocked", async () => {
    const stored = await fixture({ stored: "zh" });
    expect(stored.document.querySelector("h1")!.textContent).toBe("隐私协议");
    const blocked = await fixture({ blocked: true });
    await act(() => (blocked.document.querySelector('main button[lang="zh-CN"]') as HTMLButtonElement).click());
    expect(blocked.document.querySelector("h1")!.textContent).toBe("隐私协议");
  });

  it("responds to the existing shared language controller and browser navigation", async () => {
    const f = await fixture();
    const shared = {
      language: "en",
      setLanguage: vi.fn((language: string) => {
        shared.language = language;
        f.location.searchParams.set("lang", language);
        f.window.dispatchEvent(new f.window.CustomEvent("memova:languagechange", { detail: { language } }));
      }),
    };
    Object.assign(f.window, { MemovaLanguage: shared });
    await act(() => (f.document.querySelector('main button[lang="zh-CN"]') as HTMLButtonElement).click());
    expect(shared.setLanguage).toHaveBeenCalledWith("zh");
    expect(f.document.querySelector("h1")!.textContent).toBe("隐私协议");
    f.location.searchParams.set("lang", "en");
    await act(() => f.window.dispatchEvent(new f.window.Event("popstate")));
    expect(f.document.querySelector("h1")!.textContent).toBe("Privacy Policy");
  });

  it("renders authored emphasis and links without allowing executable URLs or raw HTML", () => {
    const html = renderToStaticMarkup(createElement("p", null, renderLegalInline(
      '**Google sign-in.** [Privacy](/privacy) [Unsafe](javascript:alert) [Broken](https://[) <img src=x onerror=alert(1)>', "zh"
    )));
    expect(html).toMatch(/<strong\b[^>]*>Google sign-in\.<\/strong>/);
    expect(html).toContain('href="/privacy?lang=zh"');
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain("&lt;img");
    expect(html).not.toContain("<img");
  });

  it("keeps the actual terms-to-privacy link in the current site and language", async () => {
    const f = await fixture({ url: "http://localhost:4173/terms?lang=zh" });
    const link = f.document.querySelector('article a[href="/privacy?lang=zh"]');
    expect(link?.textContent).toBe("隐私协议");
    expect(new URL(link!.getAttribute("href")!, f.location).origin).toBe(f.location.origin);
  });

  it("does not reset another page's translated metadata on a shared language change", async () => {
    const f = await fixture({ url: "https://memova.ai/", metadataOnly: true });
    f.document.documentElement.lang = "zh-CN";
    f.document.title = "Memova — 让你的经历与想法被真正理解";
    await act(() => f.window.dispatchEvent(new f.window.CustomEvent("memova:languagechange", { detail: { language: "zh" } })));
    expect(f.document.documentElement.lang).toBe("zh-CN");
    expect(f.document.title).toBe("Memova — 让你的经历与想法被真正理解");
  });
});
