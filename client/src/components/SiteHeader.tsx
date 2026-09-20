import { ChevronDown, LogOut, Menu, UserRound, X } from "lucide-react";
import { createElement, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  ["How it works", "/#act", "how-it-works"],
  ["Product demo", "/product-demo/", "demo"],
  ["Journal", "/journal/", "journal"],
  ["Pricing", "/pricing/", "pricing"],
] as const;

export default function SiteHeader({ current }: { current: string }) {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const communityRef = useRef<HTMLDialogElement>(null);
  const accountName = auth.user?.display_name?.trim() || "Memova account";

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (open) menuRef.current?.focus();
      setOpen(false);
      setAccountOpen(false);
    };
    const closeAccountOutside = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node))
        setAccountOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1281px)");
    const closeMobile = () => setOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeAccountOutside);
    desktop.addEventListener("change", closeMobile);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeAccountOutside);
      desktop.removeEventListener("change", closeMobile);
    };
  }, [open]);

  return (
    <>
      <header className="five-header">
        <a className="five-brand" href="/" aria-label="Memova home">
          <img
            src="/brand/memova-app-icon-liquid-blue.svg"
            alt=""
            width="31"
            height="31"
          />
          <span>MEMOVA</span>
        </a>
        <button
          ref={menuRef}
          className="five-menu"
          type="button"
          aria-expanded={open}
          aria-controls="site-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(value => !value)}
        >
          {open ? (
            <X size={21} aria-hidden="true" />
          ) : (
            <Menu size={21} aria-hidden="true" />
          )}
        </button>
        <nav
          id="site-navigation"
          className={open ? "five-nav is-open" : "five-nav"}
          aria-label="Primary navigation"
        >
          <div>
            {navigation.map(([label, href, key]) => (
              <a
                key={key}
                href={href}
                className={key === "demo" ? "five-demo-link" : undefined}
                aria-current={current === key ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
          <div>
            <button
              className="five-community-button"
              type="button"
              aria-haspopup="dialog"
              onClick={() => {
                setOpen(false);
                communityRef.current?.showModal();
              }}
            >
              Join Community
            </button>
            <a
              className="memova-download-button"
              href="https://apps.apple.com/us/app/memova-ai/id6796284954"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Memova AI on the App Store"
              onClick={() => setOpen(false)}
            >
              Download the app
            </a>
            {auth.isAuthenticated ? (
              <div className="five-account-menu" ref={accountRef}>
                <button
                  className="five-account-trigger"
                  type="button"
                  aria-label={`Open ${accountName}'s account menu`}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen(value => !value)}
                >
                  <span className="five-account-avatar" aria-hidden="true">
                    {auth.user?.avatar_url ? (
                      <img
                        src={auth.user.avatar_url}
                        alt=""
                        onError={() => void auth.refreshUser().catch(() => {})}
                      />
                    ) : (
                      accountName.charAt(0).toUpperCase()
                    )}
                  </span>
                  <span className="five-account-name">{accountName}</span>
                  <ChevronDown
                    size={14}
                    className="five-account-chevron"
                    aria-hidden="true"
                  />
                </button>
                {accountOpen && (
                  <div
                    className="five-account-popover"
                    role="menu"
                    aria-label="Account"
                  >
                    <a
                      href="/profile"
                      role="menuitem"
                      onClick={() => {
                        setAccountOpen(false);
                        setOpen(false);
                      }}
                    >
                      <UserRound size={16} aria-hidden="true" />
                      Profile
                    </a>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountOpen(false);
                        setOpen(false);
                        void auth.logout();
                      }}
                    >
                      <LogOut size={16} aria-hidden="true" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/login" onClick={() => setOpen(false)}>
                Sign in
              </a>
            )}
          </div>
        </nav>
        {createElement("memova-language-switch")}
        <dialog
          ref={communityRef}
          className="five-community-overlay"
          aria-labelledby="site-community-title"
          onClick={event => {
            if (event.target === event.currentTarget)
              communityRef.current?.close();
          }}
        >
          <div className="five-community-dialog">
            <button
              className="five-community-close"
              type="button"
              aria-label="Close community invitation"
              onClick={() => communityRef.current?.close()}
            >
              <X size={18} aria-hidden="true" />
            </button>
            <p className="five-community-eyebrow">Memova Community</p>
            <h2 id="site-community-title">Join the conversation.</h2>
            <p className="five-community-copy">
              Scan the code or open Discord to share ideas, meet early users,
              and help shape what Memova becomes.
            </p>
            <a
              className="five-community-qr-link"
              href="https://discord.gg/wAeCmpy86"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the Memova Discord community"
            >
              <img
                src="/community/discord-community-qr.png"
                alt="QR code for the Memova Discord community"
                width="300"
                height="300"
              />
            </a>
            <a
              className="five-community-open"
              href="https://discord.gg/wAeCmpy86"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Discord ↗
            </a>
          </div>
        </dialog>
      </header>
      <div className="memova-site-header-space" aria-hidden="true" />
    </>
  );
}
