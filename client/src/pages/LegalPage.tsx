import { Fragment, useEffect, useMemo, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import MemovaBrand from "@/components/MemovaBrand";
import privacyPolicyMarkdown from "@/content/privacy-policy.md?raw";
import privacyPolicyChinese from "@/content/privacy-policy.zh-CN.md?raw";
import termsOfServiceMarkdown from "@/content/terms-of-service.md?raw";
import termsOfServiceChinese from "@/content/terms-of-service.zh-CN.md?raw";
import {
  getLegalPageMetadata,
  setLegalLanguage,
  useLegalLanguage,
  withLegalLanguage,
  type LegalLanguage,
} from "@/seo/legalLanguage";

type LegalBlock =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

type LegalPageProps = {
  markdown: Record<LegalLanguage, string>;
  currentPath: "/privacy" | "/terms";
};

const headingPattern = /^(#{1,3})\s+(.+)$/;
const listPattern = /^-\s+(.+)$/;

function cleanMarkdownText(value: string) {
  return value.replace(/\\([\\`*_[\]{}()#+\-.!>])/g, "$1").trim();
}

function parseLegalMarkdown(markdown: string): LegalBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: LegalBlock[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) continue;

    const heading = line.match(headingPattern);
    if (heading) {
      const level = heading[1].length;
      blocks.push({
        type: level === 1 ? "h1" : level === 2 ? "h2" : "h3",
        text: cleanMarkdownText(heading[2]),
      });
      continue;
    }

    const listItem = line.match(listPattern);
    if (listItem) {
      const items = [cleanMarkdownText(listItem[1])];
      while (index + 1 < lines.length) {
        const nextLine = lines[index + 1].trim();
        const nextListItem = nextLine.match(listPattern);
        if (!nextListItem) break;
        items.push(cleanMarkdownText(nextListItem[1]));
        index += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    const paragraphLines = [line];
    while (index + 1 < lines.length) {
      const nextLine = lines[index + 1].trim();
      if (
        !nextLine ||
        headingPattern.test(nextLine) ||
        listPattern.test(nextLine)
      ) {
        break;
      }
      paragraphLines.push(nextLine);
      index += 1;
    }
    blocks.push({
      type: "p",
      text: cleanMarkdownText(paragraphLines.join(" ")),
    });
  }

  return blocks;
}

export function renderLegalInline(text: string, language: LegalLanguage): ReactNode {
  const tokens = text.split(/(\[[^\]]+\]\([^\s)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return tokens.map((token, index) => {
    const link = token.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
    if (link) {
      try {
        const url = new URL(link[2], "https://memova.ai");
        if (["https:", "http:", "mailto:"].includes(url.protocol)) {
          return <a key={index} className="underline underline-offset-2" href={withLegalLanguage(link[2], language)}>{renderLegalInline(link[1], language)}</a>;
        }
      } catch {
        // Invalid or unsafe links remain readable text.
      }
    }
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }
    return <Fragment key={index}>{token}</Fragment>;
  });
}

export function LegalPage({ markdown, currentPath }: LegalPageProps) {
  const language = useLegalLanguage();
  const blocks = useMemo(() => parseLegalMarkdown(markdown[language]), [markdown, language]);
  const metadata = getLegalPageMetadata(currentPath, language)!;
  const copy = language === "zh"
    ? { home: "首页", privacy: "隐私协议", terms: "服务条款", support: "支持", navigation: "法律文件" }
    : { home: "Home", privacy: "Privacy Policy", terms: "Terms of Service", support: "Support", navigation: "Legal documents" };

  useEffect(() => {
    document.title = metadata.title;
    document.documentElement.lang = metadata.htmlLang;
  }, [metadata.title, metadata.htmlLang]);

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-[#0F2B3C]" data-no-translate>
      <header className="border-b border-[#E8F0F8]/70 bg-white/85 backdrop-blur-xl">
        <div className="container flex min-h-[64px] items-center justify-between gap-4">
          <a href={withLegalLanguage("/", language)} aria-label={`Memova ${copy.home}`}>
            <MemovaBrand />
          </a>
          <a
            href={withLegalLanguage("/", language)}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#2E5B82]/65 transition-colors hover:text-[#0F2B3C]"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.home}
          </a>
        </div>
      </header>

      <main className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <nav className="flex flex-wrap gap-2" aria-label={copy.navigation}>
            <a
              href={withLegalLanguage("/privacy", language)}
              aria-current={currentPath === "/privacy" ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-[12px] font-bold transition-colors ${
                currentPath === "/privacy"
                  ? "border-[#0F2B3C] bg-[#0F2B3C] text-white"
                  : "border-[#DCEBF6] bg-white text-[#2E5B82] hover:bg-[#EDF5FC]"
              }`}
            >
              {copy.privacy}
            </a>
            <a
              href={withLegalLanguage("/terms", language)}
              aria-current={currentPath === "/terms" ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-[12px] font-bold transition-colors ${
                currentPath === "/terms"
                  ? "border-[#0F2B3C] bg-[#0F2B3C] text-white"
                  : "border-[#DCEBF6] bg-white text-[#2E5B82] hover:bg-[#EDF5FC]"
              }`}
            >
              {copy.terms}
            </a>
            </nav>
            <div className="flex gap-1 rounded-full border border-[#DCEBF6] bg-white p-1" role="group" aria-label="Language / 语言">
              {(["en", "zh"] as const).map(option => (
                <button key={option} type="button" lang={option === "zh" ? "zh-CN" : "en"} aria-pressed={language === option}
                  onClick={() => setLegalLanguage(option)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${language === option ? "bg-[#0F2B3C] text-white" : "text-[#2E5B82] hover:bg-[#EDF5FC]"}`}>
                  {option === "zh" ? "中文" : "EN"}
                </button>
              ))}
            </div>
          </div>

          <article lang={language === "zh" ? "zh-CN" : "en"} data-no-translate className="rounded-xl border border-[#DCEBF6] bg-white px-5 py-8 shadow-xl shadow-[#2E5B82]/[0.04] sm:px-8 md:px-10">
            {blocks.map((block, index) => {
              if (block.type === "h1") {
                return (
                  <h1
                    key={`${block.type}-${index}`}
                    className="font-serif text-[2.4rem] leading-tight text-[#0F2B3C] md:text-[3.2rem]"
                  >
                    {renderLegalInline(block.text, language)}
                  </h1>
                );
              }

              if (block.type === "h2") {
                return (
                  <h2
                    key={`${block.type}-${index}`}
                    className="mt-10 border-t border-[#E8F0F8] pt-8 text-[1.15rem] font-bold leading-tight text-[#0F2B3C] md:text-[1.35rem]"
                  >
                    {renderLegalInline(block.text, language)}
                  </h2>
                );
              }

              if (block.type === "h3") {
                return (
                  <h3
                    key={`${block.type}-${index}`}
                    className="mt-7 text-[0.98rem] font-bold leading-tight text-[#0F2B3C]"
                  >
                    {renderLegalInline(block.text, language)}
                  </h3>
                );
              }

              if (block.type === "ul") {
                return (
                  <ul
                    key={`${block.type}-${index}`}
                    className="mt-4 list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#2E5B82]/75 md:text-[15px]"
                  >
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{renderLegalInline(item, language)}</li>
                    ))}
                  </ul>
                );
              }

              return (
                <p
                  key={`${block.type}-${index}`}
                  className={`text-[14px] leading-7 text-[#2E5B82]/75 md:text-[15px] ${
                    index === 1 ? "mt-3" : "mt-5"
                  }`}
                >
                  {renderLegalInline(block.text, language)}
                </p>
              );
            })}
          </article>
        </div>
      </main>

      <footer className="border-t border-[#DCEBF6] bg-white/75 py-7">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <a href={withLegalLanguage("/", language)} aria-label={`Memova ${copy.home}`}><MemovaBrand compact /></a>
          <nav className="flex flex-wrap justify-center gap-6 text-[11px] font-semibold text-[#626A79]" aria-label={copy.navigation}>
            <a href={withLegalLanguage("/support", language)}>{copy.support}</a>
            <a href="mailto:hello@memova.ai">hello@memova.ai</a>
            <a href={withLegalLanguage("/privacy", language)}>{copy.privacy}</a>
            <a href={withLegalLanguage("/terms", language)}>{copy.terms}</a>
          </nav>
          <p className="text-[10px] font-semibold text-[#6B86E8]">© 2026 Memova</p>
        </div>
      </footer>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return <LegalPage markdown={{ en: privacyPolicyMarkdown, zh: privacyPolicyChinese }} currentPath="/privacy" />;
}

export function TermsOfServicePage() {
  return <LegalPage markdown={{ en: termsOfServiceMarkdown, zh: termsOfServiceChinese }} currentPath="/terms" />;
}
