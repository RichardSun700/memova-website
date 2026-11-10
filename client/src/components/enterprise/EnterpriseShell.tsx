import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { setLegalLanguage } from "@/seo/legalLanguage";

export function EnterpriseHeader({
  zh,
  contact,
}: {
  zh: boolean;
  contact: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const links = [
    ["#services", zh ? "企业服务" : "Services"],
    ["#data", zh ? "数据治理" : "Data governance"],
    ["#industrial", zh ? "工业 AI" : "Industrial AI"],
    ["#deployment", zh ? "私有部署" : "Deployment"],
    ["#applications", zh ? "应用场景" : "Applications"],
  ];
  useEffect(() => {
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <header className="ent-site-header" ref={root}>
      <div className="ent-shell ent-site-header-row">
        <a
          href="#top"
          className="ent-site-brand"
          aria-label={zh ? "Memova 企业站首页" : "Memova enterprise home"}
        >
          <img
            src="/brand/memova-app-icon-liquid-blue.svg"
            alt=""
            width="38"
            height="38"
          />
          <span>
            <img
              src="/brand/memova-wordmark-blue.svg"
              alt="Memova"
              width="108"
              height="16"
            />
            <small>FOR BUSINESS</small>
          </span>
        </a>
        <nav
          className="ent-site-desktop-nav"
          aria-label={zh ? "企业站导航" : "Enterprise navigation"}
        >
          {links.map(([href, label]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="ent-site-header-actions">
          <div
            className="ent-site-language"
            role="group"
            aria-label={zh ? "语言" : "Language"}
          >
            <button
              type="button"
              aria-pressed={!zh}
              onClick={() => setLegalLanguage("en")}
            >
              EN
            </button>
            <button
              type="button"
              aria-pressed={zh}
              onClick={() => setLegalLanguage("zh")}
            >
              中文
            </button>
          </div>
          <a className="ent-site-contact" href={contact}>
            {zh ? "联系团队" : "Contact us"}
            <ArrowUpRight size={15} />
          </a>
          <button
            className="ent-site-menu-button"
            type="button"
            ref={trigger}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="enterprise-mobile-nav"
            aria-label={zh ? "企业站菜单" : "Enterprise menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="enterprise-mobile-nav"
          className="ent-site-mobile-nav ent-shell"
          aria-label={zh ? "移动端企业导航" : "Mobile enterprise navigation"}
        >
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a href={contact} onClick={() => setOpen(false)}>
            {zh ? "咨询企业方案" : "Discuss your project"}
            <ArrowUpRight size={15} />
          </a>
        </nav>
      )}
    </header>
  );
}

export function EnterpriseFooter({
  zh,
  contact,
}: {
  zh: boolean;
  contact: string;
}) {
  return (
    <footer className="ent-site-footer">
      <div className="ent-shell">
        <div>
          <a href="#top" className="ent-site-footer-brand">
            Memova <span>FOR BUSINESS</span>
          </a>
          <p>
            {zh
              ? "企业知识、可信数据与本地 AI。"
              : "Company knowledge. Trusted data. Local AI."}
          </p>
        </div>
        <nav aria-label={zh ? "企业站页脚" : "Enterprise footer"}>
          <a href="#services">{zh ? "企业服务" : "Services"}</a>
          <a href="#data">{zh ? "数据与隐私" : "Data & privacy"}</a>
          <a href="#deployment">{zh ? "部署方案" : "Deployment"}</a>
          <a href={contact}>hello@memova.ai</a>
        </nav>
        <small>© {new Date().getFullYear()} Memova</small>
      </div>
    </footer>
  );
}
