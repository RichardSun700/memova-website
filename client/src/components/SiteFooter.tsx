import MemovaBrand from "@/components/MemovaBrand";
import { useLegalLanguage, withLegalLanguage } from "@/seo/legalLanguage";

export default function SiteFooter() {
  const language = useLegalLanguage();
  const L = (zh: string, en: string) => language === "zh" ? zh : en;
  const local = (path: string) => language === "zh" ? withLegalLanguage(path, language) : path;
  return (
    <footer data-no-translate className="memova-site-footer border-t border-[rgba(36,54,93,0.14)] bg-[#FFFFFF]/75 py-7 backdrop-blur-xl">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <a href={local("/")} aria-label="Memova home" className="flex items-center">
            <MemovaBrand compact />
          </a>
          <div className="flex items-center gap-6">
            <a
              href={local("/support")}
              className="text-[11px] font-semibold text-[#626A79] transition-colors hover:text-[#566CE5]"
            >
              {L("帮助与支持", "Support")}
            </a>
            <a
              href="mailto:hello@memova.ai"
              className="text-[11px] font-semibold text-[#626A79] transition-colors hover:text-[#566CE5]"
            >
              hello@memova.ai
            </a>
            <a
              href={local("/privacy")}
              className="text-[11px] font-semibold text-[#626A79] transition-colors hover:text-[#566CE5]"
            >
              {L("隐私政策", "Privacy")}
            </a>
            <a
              href={local("/terms")}
              className="text-[11px] font-semibold text-[#626A79] transition-colors hover:text-[#566CE5]"
            >
              {L("服务条款", "Terms")}
            </a>
          </div>
          <p className="text-[10px] font-semibold text-[#6B86E8]">
            © 2026 Memova
          </p>
        </div>
      </div>
    </footer>
  );
}
