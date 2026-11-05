import { ShieldCheck, UserRound } from "lucide-react";
import { type ReactNode } from "react";
import { useLocation } from "wouter";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { cn } from "@/lib/utils";

type AccountShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
};

const navItems = [
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/connected-clients", label: "Connected clients", icon: ShieldCheck },
];

export default function AccountShell({
  title,
  subtitle,
  children,
  actions,
  compact = false,
}: AccountShellProps) {
  const [location] = useLocation();

  return (
    <div className="memova-account-shell flex min-h-screen flex-col bg-[#F6F8FC] text-[#111A30]">
      <SiteHeader current={location.startsWith("/mcp/") ? "mcp" : "account"} />

      <main
        className={cn(
          "mx-auto w-full max-w-[1240px] flex-1 px-5 sm:px-6 lg:px-8",
          compact ? "py-6" : "py-10"
        )}
      >
        <nav
          aria-label="Account navigation"
          className={cn("flex flex-wrap items-center gap-2", compact ? "mb-5" : "mb-8")}
        >
          {navItems.map(item => {
            const Icon = item.icon;
            const active = location === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-[10px] border px-3.5 text-[12px] font-bold transition-all duration-200",
                  active
                    ? "border-[#566CE5] bg-[#566CE5] text-white shadow-[0_8px_18px_rgba(86,108,229,0.2)]"
                    : "border-[rgba(69,94,147,0.2)] bg-[#FFFFFF]/85 text-[#455E93] hover:border-[#6B86E8] hover:bg-[#FFFFFF] hover:text-[#111A30]"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </a>
            );
          })}
        </nav>
        <div
          className={cn(
            "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
            compact ? "mb-5" : "mb-8"
          )}
        >
          <div>
            <p
              className={cn(
                "text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#566CE5]",
                compact ? "mb-2" : "mb-3"
              )}
            >
              Memova MCP
            </p>
            <h1
              className={cn(
                "memova-account-heading leading-[1.02] tracking-[-0.025em] text-[#111A30]",
                compact
                  ? "text-[1.9rem] sm:text-[2.4rem]"
                  : "text-[2.1rem] sm:text-[3rem]"
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className={cn(
                  "max-w-2xl text-[14px] leading-6 text-[#626A79]",
                  compact ? "mt-2" : "mt-3"
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions}
        </div>

        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
