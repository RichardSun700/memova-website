import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { setLegalLanguage, useLegalLanguage } from "@/seo/legalLanguage";
import { resolveSiteUrl } from "@/navigation/siteLinks";
import WatchSiteHeader, { type WatchSiteHeaderProps } from "../../../shared/site/WatchSiteHeader";

type Props = Omit<WatchSiteHeaderProps, "account" | "mobileAccount"> & {
  navigationMode?: "legacy" | "watch";
};

export default function SiteHeader(props: Props) {
  const auth = useAuth();
  const storedLanguage = useLegalLanguage();
  const language = props.language || storedLanguage;
  const L = (zh: string, en: string) => language === "zh" ? zh : en;
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const accountButton = useRef<HTMLButtonElement>(null);
  const accountName = auth.user?.display_name?.trim() || "Memova account";

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && accountOpen) {
        setAccountOpen(false);
        accountButton.current?.focus();
      }
    };
    window.addEventListener("pointerdown", closeOutside);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountOpen]);

  const logout = async () => {
    setAccountOpen(false);
    await auth.logout();
    if (/^\/(?:profile|(?:settings\/)?connected-clients|mcp\/oauth\/consent)\/?$/.test(window.location.pathname)) window.location.assign("/");
  };
  const account = auth.isAuthenticated ? <div className="mw-account" ref={accountRef}>
    <button ref={accountButton} type="button" className="mw-account-trigger" aria-label={`Open ${accountName}'s account menu`} aria-haspopup="menu" aria-expanded={accountOpen} onClick={() => setAccountOpen(!accountOpen)}>
      <span className="mw-avatar" aria-hidden="true">{auth.user?.avatar_url ? <img src={auth.user.avatar_url} alt="" onError={() => void auth.refreshUser().catch(() => {})} /> : accountName.charAt(0).toUpperCase()}</span>
      <span className="mw-account-name">{accountName}</span><ChevronDown size={14} aria-hidden="true" />
    </button>
    {accountOpen && <div className="mw-account-popover" role="menu" aria-label="Account">
      <a href="/profile" role="menuitem" onClick={() => setAccountOpen(false)}><UserRound size={16} aria-hidden="true" />{L("个人资料", "Profile")}</a>
      <button type="button" role="menuitem" onClick={() => void logout()}><LogOut size={16} aria-hidden="true" />{L("退出登录", "Log out")}</button>
    </div>}
  </div> : undefined;
  const mobileAccount = auth.isAuthenticated ? <>
    <a href="/profile"><span>{accountName}</span><UserRound size={18} aria-hidden="true" /></a>
    <button type="button" onClick={() => void logout()}>{L("退出登录", "Log out")}<LogOut size={18} aria-hidden="true" /></button>
  </> : undefined;

  return <WatchSiteHeader {...props} resolveUrl={resolveSiteUrl} language={language} onLanguageChange={props.onLanguageChange || setLegalLanguage} account={account} mobileAccount={mobileAccount} />;
}
