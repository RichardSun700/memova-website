import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { ArrowUpRight, Globe, List, UsersThree, X } from "@phosphor-icons/react";
import "./WatchSiteHeader.css";

export type SiteLanguage = "en" | "zh";
export type WatchSiteHeaderProps = {
  language?: SiteLanguage;
  onLanguageChange?: (language: SiteLanguage) => void;
  home?: boolean;
  current?: string | null;
  headerRef?: RefObject<HTMLElement | null>;
  onOpenCommunity?: () => void;
  account?: ReactNode;
  mobileAccount?: ReactNode;
  resolveUrl?: (path: string) => string;
};

// Full-site entry points keep local URLs. A partial host may supply its routing
// policy without changing the navigation or patching rendered DOM links.
export default function WatchSiteHeader({ language = "en", onLanguageChange, home = false, current, headerRef, onOpenCommunity, account, mobileAccount, resolveUrl = path => path }: WatchSiteHeaderProps) {
  const ownHeader = useRef<HTMLElement>(null);
  const header = headerRef || ownHeader;
  const menuButton = useRef<HTMLButtonElement>(null);
  const communityDialog = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const L = (zh: string, en: string) => language === "zh" ? zh : en;
  const local = (path: string) => {
    if (language === "en") return resolveUrl(path);
    const url = new URL(path, "https://memova.ai");
    url.searchParams.set("lang", language);
    return resolveUrl(url.pathname + url.search + url.hash);
  };
  const section = (id: string) => home ? `#${id}` : local(`/#${id}`);
  const links = [
    ["experience", section("experience"), L("体验 Memova", "Experience Memova")],
    ["privacy", section("privacy"), L("隐私与离线", "Privacy & offline")],
    ["pro", section("pro"), "Memova Pro"],
    ["journal", local("/journal/"), L("博客", "Blog")],
    ["mcp", local("/mcp/"), "MCP"],
  ];
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setMenuOpen(false); };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus({ preventScroll: true });
      }
    };
    const wide = window.matchMedia("(min-width:1100px)");
    const onResize = () => { if (wide.matches) setMenuOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onResize);
    };
  }, [header, menuOpen]);
  useEffect(() => {
    if (home) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!header.current) return;
        const distance = document.documentElement.scrollHeight - innerHeight;
        header.current.style.setProperty("--page-progress", String(distance > 0 ? Math.min(1, scrollY / distance) : 0));
        header.current.dataset.scrolled = String(scrollY > 12);
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [header, home]);
  const openCommunity = () => {
    setMenuOpen(false);
    menuButton.current?.focus({ preventScroll: true });
    if (onOpenCommunity) onOpenCommunity();
    else communityDialog.current?.showModal();
  };
  const currentValue = (key: string) => current === key ? (home ? "location" as const : "page" as const) : undefined;
  const signIn = <a className="mw-control mw-signin" href={local("/login")}>{L("登录", "Sign in")}</a>;
  return <>
    <header className="site-header memova-watch-header" ref={header} data-no-translate>
      <a className="brand mw-brand" href={home ? "#top" : local("/")} aria-label="Memova home">
        <img src="/brand/memova-app-icon-liquid-blue.svg" alt="" width="32" height="32" />
        <img className="brand-wordmark mw-wordmark" src="/brand/memova-wordmark-blue.svg" alt="Memova" width="110" height="17" />
      </a>
      <nav className="mw-desktop-nav" aria-label={L("主导航", "Main navigation")}>
        {links.map(([key, href, label]) => <a key={key} href={href} className={key === "mcp" ? "mw-mcp" : undefined} aria-current={currentValue(key)}>{label}</a>)}
      </nav>
      <div className="mw-actions">
        <button className="mw-language" type="button" onClick={() => onLanguageChange?.(language === "en" ? "zh" : "en")} aria-label={L("Switch to English", "切换为中文")}><Globe size={16} aria-hidden="true" />{L("EN", "中文")}</button>
        <button className="mw-control mw-community" type="button" aria-haspopup="dialog" aria-label={L("加入社区", "Join the community")} onClick={openCommunity}><UsersThree size={17} aria-hidden="true" /><span>{L("加入社区", "Join the community")}</span></button>
        <div className="mw-desktop-account">{account || signIn}</div>
        <a className="mw-control mw-download" href="https://apps.apple.com/us/app/memova-ai/id6796284954" target="_blank" rel="noopener noreferrer">{L("免费下载", "Download free")}<ArrowUpRight size={15} aria-hidden="true" /></a>
        <button ref={menuButton} className="mw-menu-toggle mobile-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={L(menuOpen ? "关闭导航菜单" : "打开导航菜单", menuOpen ? "Close navigation menu" : "Open navigation menu")} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23} /> : <List size={23} />}</button>
      </div>
      <nav id="mobile-navigation" className="mw-mobile-nav" aria-label={L("手机导航", "Mobile navigation")} hidden={!menuOpen} onClick={event => { if ((event.target as Element).closest("a")) setMenuOpen(false); }}>
        {links.map(([key, href, label]) => <a key={key} href={href} aria-current={currentValue(key)}>{label}</a>)}
        {mobileAccount || account || signIn}
        <button type="button" className="mw-mobile-community" aria-haspopup="dialog" onClick={openCommunity}>{L("加入社区", "Join the community")}<UsersThree size={18} aria-hidden="true" /></button>
        <a className="mw-mobile-download mobile-menu-download" href="https://apps.apple.com/us/app/memova-ai/id6796284954" target="_blank" rel="noopener noreferrer">{L("免费下载", "Download free")}<ArrowUpRight size={16} aria-hidden="true" /></a>
      </nav>
    </header>
    <div className="mw-header-spacer" aria-hidden="true" />
    {!onOpenCommunity && <dialog ref={communityDialog} className="memova-watch-community" data-no-translate aria-labelledby="mw-community-title" onClick={event => { if (event.target === event.currentTarget) communityDialog.current?.close(); }}>
      <button className="mw-dialog-close" type="button" aria-label={L("关闭社区邀请", "Close community invitation")} onClick={() => communityDialog.current?.close()}><X size={20} /></button>
      <p className="mw-eyebrow">MEMOVA COMMUNITY</p>
      <h2 id="mw-community-title">{L("一起聊聊。", "Join the conversation.")}</h2>
      <p>{L("分享想法，认识其他用户，一起参与 Memova 的成长。", "Share ideas, meet early users, and help shape what Memova becomes.")}</p>
      <a href="https://discord.gg/E9u5FFvhdu" target="_blank" rel="noopener noreferrer"><img src={resolveUrl("/community/discord-community-qr-e9u5ffvhdu.png")} alt="Memova Discord QR code" width="184" height="184" /></a>
      <a className="mw-dialog-link" href="https://discord.gg/E9u5FFvhdu" target="_blank" rel="noopener noreferrer">{L("打开 Discord", "Open Discord")}<ArrowUpRight size={16} /></a>
    </dialog>}
  </>;
}
