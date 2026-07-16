import type { ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";

type MarketingPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

export function IosEarlyAccessCta() {
  return (
    <section className="rounded-[28px] border border-[#DDE6FF] bg-[var(--memova-navy)] px-6 py-10 text-center text-white shadow-xl md:px-12">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
        Memova for iPhone
      </p>
      <h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl leading-tight md:text-4xl">
        Bring your everyday context into the workflows that come next.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">
        Join early access for the first iOS release. You choose what to capture, and you review consequential actions before they happen.
      </p>
      <a
        href="/#waitlist"
        data-analytics-event="ios_early_access_click"
        className="mt-7 inline-flex rounded-full bg-white px-7 py-3 text-sm font-bold text-[var(--memova-navy)] shadow-lg transition-transform hover:-translate-y-0.5"
      >
        Join iOS Early Access
      </a>
    </section>
  );
}

export default function MarketingPage({ eyebrow, title, intro, children }: MarketingPageProps) {
  return (
    <div className="min-h-screen bg-[var(--memova-light)] text-[var(--memova-navy)]">
      <header className="border-b border-[#DDE6FF]/70 bg-white/90">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <a href="/" aria-label="Memova home">
            <img
              src="/memova-logo-transparent.png"
              alt="Memova"
              className="h-14 w-auto object-contain"
            />
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-5 text-[13px] font-semibold text-[#637083] md:flex">
            <a href="/how-it-works" className="hover:text-[var(--memova-navy)]">How it works</a>
            <a href="/agent-memory" className="hover:text-[var(--memova-navy)]">Agent memory</a>
            <a href="/user-cases" className="hover:text-[var(--memova-navy)]">Use cases</a>
            <a href="/mcp" className="hover:text-[var(--memova-navy)]">MCP</a>
          </nav>
          <a
            href="/#waitlist"
            data-analytics-event="ios_early_access_click"
            className="rounded-full bg-[var(--memova-navy)] px-4 py-2 text-[12px] font-bold text-white sm:px-5 sm:text-[13px]"
          >
            Join iOS Early Access
          </a>
        </div>
      </header>

      <main>
        <section className="px-4 py-20 text-center md:py-28">
          <div className="mx-auto max-w-4xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--memova-blue)]">
              {eyebrow}
            </p>
            <h1 className="mx-auto mt-5 max-w-3xl font-serif text-[2.75rem] font-normal leading-[1.08] md:text-6xl">
              {title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#637083] md:text-lg">
              {intro}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-14 px-4 pb-20 md:space-y-20 md:pb-28">
          {children}
          <aside className="rounded-2xl border border-[#DDE6FF] bg-white px-5 py-4 text-center text-sm font-semibold text-[#637083]">
            You choose what to capture. Memova keeps sources visible and asks you to review and approve consequential actions.
          </aside>
          <IosEarlyAccessCta />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
