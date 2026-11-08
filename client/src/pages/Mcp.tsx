import { useState } from "react";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Check,
  Cloud,
  Copy,
  HeartPulse,
  MessageSquareText,
  NotebookText,
  Radio,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { MCP_DEPLOYMENT } from "@/lib/mcpDeployment";
import { useLegalLanguage, withLegalLanguage } from "@/seo/legalLanguage";

const contentTypes = [
  { icon: NotebookText, en: "Hour notes", zh: "小时笔记" },
  { icon: Sparkles, en: "Daily inspiration", zh: "每日灵感" },
  { icon: CalendarDays, en: "Timeline & My Day", zh: "Timeline 与 My Day" },
  { icon: Bookmark, en: "Saved memories", zh: "已保存记忆" },
  { icon: HeartPulse, en: "Health samples", zh: "健康样本" },
  { icon: Radio, en: "Recording markers", zh: "录音标记" },
];

export default function Mcp() {
  const language = useLegalLanguage();
  const zh = language === "zh";
  const L = (chinese: string, english: string) => (zh ? chinese : english);
  const local = (href: string) => withLegalLanguage(href, language);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );
  const endpoint = MCP_DEPLOYMENT.serverUrl;

  const copyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(endpoint);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  const steps = [
    {
      number: "01",
      title: L("在 Agent 中添加 Memova", "Add Memova in your agent"),
      text: L(
        "在支持远程 MCP 与 OAuth 的客户端中添加服务器地址，再发起认证。",
        "Add the server URL in a client that supports remote MCP and OAuth, then start authentication."
      ),
    },
    {
      number: "02",
      title: L("登录并批准只读访问", "Sign in and approve read access"),
      text: L(
        "使用与 Memova App 相同的邮箱接收验证码，核对账号、客户端与权限后批准。",
        "Use your Memova App email and its verification code. Review the account, client, and permissions before approving."
      ),
    },
    {
      number: "03",
      title: L("回到原聊天，验证读取", "Return to your chat and verify"),
      text: L(
        "回到发起连接的 Agent，按客户端说明重新加载工具，再读取账号并搜索少量记录。",
        "Return to the agent that started the connection. Reload its tools as needed, then check your account and search a few records."
      ),
    },
  ];

  return (
    <div
      className="memova-home-theme min-h-screen bg-[#F6F8FC] text-[#283B54]"
      lang={zh ? "zh-CN" : "en"}
    >
      <SiteHeader current="mcp" />
      <main>
        <section className="relative overflow-hidden border-b border-[#DCE5F2] bg-[linear-gradient(135deg,#F7FAFF_10%,#EAF1FC_100%)] px-5 py-16 sm:px-8 lg:py-24">
          <div className="relative mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#566CE5]">
                Memova Next MCP
              </p>
              <h1 className="mt-5 max-w-xl font-display text-[clamp(2.6rem,5vw,4.5rem)] leading-[1.06] tracking-[-0.035em]">
                {L(
                  "在 AI 聊天中，找回你的 Memova 记录。",
                  "Bring your Memova records into your AI chat."
                )}
              </h1>
              <p className="mt-6 max-w-xl text-[16px] leading-7 text-[#637793]">
                {L(
                  "让 Agent 按需读取已保存的云端内容，查找原话、回看一天的记录，或梳理已有的健康线索。",
                  "Let your agent read saved cloud content to find original words, revisit your day, or review the health context you have recorded."
                )}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={local("/mcp/setup")}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#2D405B] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#415878]"
                >
                  {L("开始接入", "Set up Memova")}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
                <a
                  href={local("/connected-clients")}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#CFDAEB] px-5 text-sm font-semibold text-[#455E93] transition-colors hover:bg-white"
                >
                  {L("管理已授权连接", "Manage connections")}
                </a>
              </div>
              <p className="mt-5 flex items-center gap-2 text-[12px] text-[#637793]">
                <ShieldCheck size={15} aria-hidden="true" />
                {L(
                  "只读访问 · 无需 Pro · 可随时撤销",
                  "Read-only access · No Pro required · Revoke anytime"
                )}
              </p>
            </div>

            <div className="rounded-[24px] border border-[#D3DFF0] bg-white/85 p-5 shadow-[0_20px_70px_#4E6B9A0D] sm:p-7">
              <div className="flex items-center justify-between border-b border-[#E3EAF4] pb-5">
                <div className="flex items-center gap-3">
                  <img
                    src="/brand/memova-app-icon-liquid-blue.svg"
                    alt=""
                    width="36"
                    height="36"
                  />
                  <div>
                    <p className="text-sm font-semibold">Memova Next</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[#73849B]">
                      <Cloud size={12} aria-hidden="true" />
                      {L("已保存的云端内容", "Saved cloud content")}
                    </p>
                  </div>
                </div>
                <span className="rounded-md bg-[#EDF2FC] px-2.5 py-1.5 font-mono text-[11px] text-[#566CE5]">
                  next.read
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 py-5">
                {contentTypes.map(({ icon: Icon, en, zh: chinese }) => (
                  <div
                    key={en}
                    className="flex min-h-[64px] items-center gap-3 rounded-xl border border-[#E4EAF4] bg-[#F8FAFD] px-3 sm:px-4"
                  >
                    <Icon
                      size={18}
                      className="shrink-0 text-[#7B90C9]"
                      aria-hidden="true"
                    />
                    <span className="text-[12px] font-medium leading-5 sm:text-[13px]">
                      {zh ? chinese : en}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[#EDF3FD] px-4 py-4 text-sm font-medium">
                <MessageSquareText
                  size={20}
                  className="text-[#566CE5]"
                  aria-hidden="true"
                />
                <span>
                  {L("在你的 Agent 聊天中读取", "Read in your agent’s chat")}
                </span>
                <ArrowRight
                  size={16}
                  className="ml-auto text-[#7B90C9]"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1160px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B81B8]">
                {L("从安装到读取", "From setup to your first read")}
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight tracking-[-0.02em] sm:text-4xl">
                {L(
                  "三步，回到你的记录。",
                  "Connect, approve, and return to your records."
                )}
              </h2>
            </div>
            <a
              href={local("/mcp/setup")}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-[#566CE5]"
            >
              {L("查看客户端安装步骤", "View client instructions")}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {steps.map(step => (
              <div
                key={step.number}
                className="rounded-2xl border border-[#DCE4F0] bg-white/70 p-6"
              >
                <span className="text-xs font-semibold tracking-[0.12em] text-[#7B90C9]">
                  {step.number}
                </span>
                <h3 className="mt-5 text-[17px] font-semibold leading-6">
                  {step.title}
                </h3>
                <p className="mt-3 text-[13px] leading-6 text-[#6A7D98]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-[#DCE4F0] bg-[#EEF3FC] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6A7D98]">
                {L(
                  "服务器地址 · Streamable HTTP",
                  "Server URL · Streamable HTTP"
                )}
              </p>
              {MCP_DEPLOYMENT.environment === "isolated-test" && (
                <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
                  {L("隔离测试环境", "Isolated test environment")}
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <code className="min-w-0 break-all text-[13px] leading-6 text-[#405A83] sm:text-sm">
                {endpoint ||
                  L("服务器地址尚未配置", "Server URL is not configured")}
              </code>
              <button
                type="button"
                onClick={() => void copyEndpoint()}
                disabled={!endpoint}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#C9D6EA] bg-white px-4 text-xs font-semibold text-[#455E93] transition-colors hover:bg-[#F8FAFF] disabled:opacity-50"
              >
                {copyStatus === "copied" ? (
                  <Check size={14} aria-hidden="true" />
                ) : (
                  <Copy size={14} aria-hidden="true" />
                )}
                {copyStatus === "copied"
                  ? L("已复制", "Copied")
                  : L("复制地址", "Copy URL")}
              </button>
            </div>
            <p className="mt-2 text-xs text-[#6A7D98]" role="status">
              {copyStatus === "error"
                ? L(
                    "请选中上方地址，手动复制。",
                    "Select the address above and copy it manually."
                  )
                : ""}
            </p>
          </div>
          <div className="mt-7 flex flex-col justify-between gap-4 text-[13px] leading-6 text-[#6A7D98] sm:flex-row">
            <p className="max-w-[720px]">
              {L(
                "Agent 可读取六类已保存的云端内容。本地尚未同步的内容需先在 App 中同步；你可以在连接管理中撤销指定 Agent 的权限。",
                "Your agent can read six types of saved cloud content. Content kept only on your device needs to be synced in the App first. You can revoke an agent’s access in connection management."
              )}
            </p>
            <a
              href={local("/privacy/")}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 font-semibold text-[#455E93]"
            >
              {L("隐私政策", "Privacy policy")}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
