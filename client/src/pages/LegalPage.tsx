import { useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import privacyPolicyMarkdown from "@/content/privacy-policy.md?raw";
import termsOfServiceMarkdown from "@/content/terms-of-service.md?raw";

type LegalBlock =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

type LegalPageProps = {
  markdown: string;
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

function renderInlineText(text: string) {
  const italic = text.match(/^\*(.+)\*$/);
  if (italic) {
    return <em>{italic[1]}</em>;
  }
  return text;
}

function LegalPage({ markdown, currentPath }: LegalPageProps) {
  const blocks = useMemo(() => parseLegalMarkdown(markdown), [markdown]);
  const titleBlock = blocks.find(block => block.type === "h1");
  const title =
    titleBlock && "text" in titleBlock ? titleBlock.text : "Memova";

  useEffect(() => {
    document.title = `${title} | Memova`;
  }, [title]);

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-[#0F2B3C]">
      <header className="border-b border-[#E8F0F8]/70 bg-white/85 backdrop-blur-xl">
        <div className="container flex min-h-[64px] items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2.5">
            <img
              alt="MEMOVA"
              className="h-[1.8rem] w-[5.6rem] shrink-0 object-cover object-[50%_69%] mix-blend-multiply"
              src="/manus-storage/memova_logo_0eb30acc.png"
            />
            <span className="text-[13px] font-bold tracking-[0.18em] text-[#0F2B3C]">
              MEMOVA
            </span>
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#2E5B82]/65 transition-colors hover:text-[#0F2B3C]"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </a>
        </div>
      </header>

      <main className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-wrap gap-2">
            <a
              href="/privacy"
              className={`rounded-full border px-4 py-2 text-[12px] font-bold transition-colors ${
                currentPath === "/privacy"
                  ? "border-[#0F2B3C] bg-[#0F2B3C] text-white"
                  : "border-[#DCEBF6] bg-white text-[#2E5B82] hover:bg-[#EDF5FC]"
              }`}
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className={`rounded-full border px-4 py-2 text-[12px] font-bold transition-colors ${
                currentPath === "/terms"
                  ? "border-[#0F2B3C] bg-[#0F2B3C] text-white"
                  : "border-[#DCEBF6] bg-white text-[#2E5B82] hover:bg-[#EDF5FC]"
              }`}
            >
              Terms of Service
            </a>
          </div>

          <article className="rounded-xl border border-[#DCEBF6] bg-white px-5 py-8 shadow-xl shadow-[#2E5B82]/[0.04] sm:px-8 md:px-10">
            {blocks.map((block, index) => {
              if (block.type === "h1") {
                return (
                  <h1
                    key={`${block.type}-${index}`}
                    className="font-serif text-[2.4rem] leading-tight text-[#0F2B3C] md:text-[3.2rem]"
                  >
                    {block.text}
                  </h1>
                );
              }

              if (block.type === "h2") {
                return (
                  <h2
                    key={`${block.type}-${index}`}
                    className="mt-10 border-t border-[#E8F0F8] pt-8 text-[1.15rem] font-bold leading-tight text-[#0F2B3C] md:text-[1.35rem]"
                  >
                    {block.text}
                  </h2>
                );
              }

              if (block.type === "h3") {
                return (
                  <h3
                    key={`${block.type}-${index}`}
                    className="mt-7 text-[0.98rem] font-bold leading-tight text-[#0F2B3C]"
                  >
                    {block.text}
                  </h3>
                );
              }

              if (block.type === "ul") {
                return (
                  <ul
                    key={`${block.type}-${index}`}
                    className="mt-4 list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#2E5B82]/75 md:text-[15px]"
                  >
                    {block.items.map(item => (
                      <li key={item}>{item}</li>
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
                  {renderInlineText(block.text)}
                </p>
              );
            })}
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export function PrivacyPolicyPage() {
  return <LegalPage markdown={privacyPolicyMarkdown} currentPath="/privacy" />;
}

export function TermsOfServicePage() {
  return <LegalPage markdown={termsOfServiceMarkdown} currentPath="/terms" />;
}
