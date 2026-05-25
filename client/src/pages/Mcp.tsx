import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clipboard,
  Code2,
  ExternalLink,
  FolderCheck,
  LockKeyhole,
  PlugZap,
  Server,
  ShieldCheck,
  Smartphone,
  Terminal,
} from "lucide-react";
import SiteFooter from "@/components/SiteFooter";

const MCP_ENDPOINT = "https://api.memova.ai/mcp";
const MCP_SCOPES =
  "notes.read,actions.read,actions.write,automation.read,automation.write";
const CODEX_MARKETPLACE = "gxyfred/memova-codex-plugin";

const capabilities = [
  "Create or connect a Memova input root in iCloud Drive",
  "Run latest final-note workflows from Codex",
  "Search meeting notes and transcripts through OAuth MCP",
  "Read and write action items with user approval",
  "Diagnose vault binding or meeting-to-vault sync issues",
];

const permissionGroups = [
  "Read notes",
  "Read and write actions",
  "Read and write automations",
];

const setupRows = [
  { label: "Codex plugin", value: "Available now" },
  { label: "Remote MCP", value: MCP_ENDPOINT },
  { label: "Auth", value: "OAuth consent in browser" },
  { label: "Knowledge base", value: "iCloud Drive folder chosen by the user" },
];

const setupSteps = [
  {
    icon: Smartphone,
    title: "Start in the Memova app",
    text: "Choose whether to create a new Memova Vault or connect an existing knowledge base. The app prepares a setup session for Codex.",
  },
  {
    icon: PlugZap,
    title: "Install the Codex plugin",
    text: "Add the Memova plugin marketplace, install Memova from /plugins, and start a new Codex thread.",
  },
  {
    icon: Code2,
    title: "Run @memova setup",
    text: "Codex signs in through Memova OAuth, reads the setup package, creates or connects the iCloud input root, and writes the result back.",
  },
  {
    icon: FolderCheck,
    title: "Bind the same folder on iOS",
    text: "The app asks for Files access, uses manifest hints to locate the folder, and then writes future meeting packets locally.",
  },
];

const platformRows = [
  {
    name: "Codex",
    status: "Plugin available now",
    detail:
      "Best setup path. Includes @memova starter prompts, OAuth MCP, vault setup, workflow execution, and diagnostics.",
  },
  {
    name: "Direct MCP",
    status: "Available for compatible clients",
    detail:
      "Use the remote endpoint and OAuth if your agent already supports Streamable HTTP MCP.",
  },
  {
    name: "Claude Code and other agents",
    status: "Planned",
    detail:
      "The integration model is designed to add more agent-specific plugins without changing the Memova data layer.",
  },
];

export default function Mcp() {
  const [copied, setCopied] = useState(false);

  const copyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(MCP_ENDPOINT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

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

      <main>
        <section className="border-b border-[#E8F0F8]/70 bg-gradient-to-b from-[#EDF5FC]/70 to-[#FAFCFF] py-16 md:py-24">
          <div className="container">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[#6FA8D9]">
                  Agent plugins and MCP
                </p>
                <h1 className="max-w-3xl font-serif text-[2.4rem] leading-[1.05] tracking-[-0.01em] text-[#0F2B3C] sm:text-[3.4rem]">
                  Connect Memova to Codex.
                </h1>
                <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#2E5B82]/60 md:text-[16px]">
                  Install the Memova Codex plugin to connect your Memova app,
                  OAuth MCP session, and user-owned iCloud knowledge base. The
                  raw MCP endpoint remains available for compatible clients, and
                  more agent-specific plugins can be added later.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#setup"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#0F2B3C] px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#1A3A5C]"
                  >
                    View Codex setup
                  </a>
                  <a
                    href="#direct-mcp"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#D4E9F7] bg-white px-6 text-[13px] font-semibold text-[#2E5B82] transition-colors hover:bg-[#EDF5FC]"
                  >
                    Direct MCP fallback
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-[#DCEBF6] bg-white p-5 shadow-xl shadow-[#2E5B82]/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EDF5FC] text-[#2E5B82]">
                    <PlugZap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2E5B82]/45">
                      Codex plugin marketplace
                    </div>
                    <div className="break-all text-[15px] font-bold text-[#0F2B3C]">
                      {CODEX_MARKETPLACE}
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid gap-2">
                  {[
                    "Codex plugin available now",
                    "Memova app setup session",
                    "iCloud folder binding",
                    "Direct MCP still supported",
                  ].map(item => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-lg border border-[#EDF3FA] bg-[#F8FBFE] px-3 py-2 text-[12px] font-semibold text-[#0F2B3C]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#2E5B82]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6FA8D9]">
                  What it can do
                </p>
                <h2 className="font-serif text-[2rem] leading-[1.1] text-[#0F2B3C] md:text-[2.8rem]">
                  The plugin turns Memova into an agent workspace.
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {capabilities.map(item => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-[#EDF3FA] bg-white px-4 py-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2E5B82]" />
                    <span className="text-[13px] font-semibold leading-5 text-[#0F2B3C]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="setup"
          className="border-y border-[#E8F0F8]/70 bg-white py-16 md:py-24"
        >
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6FA8D9]">
                  Codex setup
                </p>
                <h2 className="font-serif text-[2rem] leading-[1.1] text-[#0F2B3C] md:text-[2.8rem]">
                  Start in the app, finish in Codex.
                </h2>
                <p className="mt-4 text-[14px] leading-6 text-[#2E5B82]/60">
                  The Memova app prepares the setup session. Codex uses the
                  plugin to create or connect the iCloud input root, then the
                  app binds to that same folder for future meeting sync.
                </p>
                <div className="mt-6 grid gap-2">
                  {setupRows.map(row => (
                    <div
                      key={row.label}
                      className="grid grid-cols-[120px_1fr] gap-3 rounded-lg border border-[#EDF3FA] bg-[#FAFCFF] px-4 py-3 text-[13px]"
                    >
                      <span className="font-bold uppercase tracking-[0.12em] text-[#2E5B82]/45">
                        {row.label}
                      </span>
                      <span className="break-words font-semibold text-[#0F2B3C]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#DCEBF6] bg-[#0F2B3C] p-5 text-white shadow-xl shadow-[#2E5B82]/[0.08]">
                <div className="mb-4 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-white/55">
                  <Terminal className="h-4 w-4" />
                  Codex plugin
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/25 p-4 text-[12px] leading-6 text-[#DCEBF6]">
                  {`codex plugin marketplace add ${CODEX_MARKETPLACE}

# Open Codex, run /plugins, install Memova,
# start a new thread, then run:
@memova Setup my Memova knowledge base.`}
                </pre>
                <p className="mt-4 text-[12px] leading-5 text-white/55">
                  If Codex asks for MCP authentication, complete the Memova
                  browser login and consent flow. No manual token copying is
                  needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mb-8 max-w-2xl">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6FA8D9]">
                Setup flow
              </p>
              <h2 className="font-serif text-[2rem] leading-[1.1] text-[#0F2B3C] md:text-[2.8rem]">
                One flow across the app, Codex, and iCloud.
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {setupSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-xl border border-[#DCEBF6] bg-white p-5 shadow-lg shadow-[#2E5B82]/[0.035]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EDF5FC] text-[#2E5B82]">
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2E5B82]/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[15px] font-bold text-[#0F2B3C]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[12px] font-medium leading-5 text-[#2E5B82]/55">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#E8F0F8]/70 bg-[#FAFCFF] py-16 md:py-24">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6FA8D9]">
                  Agent support
                </p>
                <h2 className="font-serif text-[2rem] leading-[1.1] text-[#0F2B3C] md:text-[2.8rem]">
                  Built for Codex first, not Codex only.
                </h2>
                <p className="mt-4 text-[14px] leading-6 text-[#2E5B82]/60">
                  Memova keeps the data layer stable: OAuth MCP for account
                  access, iCloud for user-owned files, and agent plugins for
                  workflow-specific guidance.
                </p>
              </div>
              <div className="grid gap-3">
                {platformRows.map(row => (
                  <div
                    key={row.name}
                    className="rounded-xl border border-[#DCEBF6] bg-white px-5 py-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-[15px] font-bold text-[#0F2B3C]">
                        {row.name}
                      </h3>
                      <span className="w-fit rounded-full border border-[#D4E9F7] bg-[#F8FBFE] px-3 py-1 text-[11px] font-bold text-[#2E5B82]">
                        {row.status}
                      </span>
                    </div>
                    <p className="mt-2 text-[12px] font-medium leading-5 text-[#2E5B82]/55">
                      {row.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="direct-mcp" className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-xl border border-[#DCEBF6] bg-white p-6 shadow-lg shadow-[#2E5B82]/[0.04]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#EDF5FC] text-[#2E5B82]">
                  <Server className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-[1.8rem] leading-[1.1] text-[#0F2B3C]">
                  Direct MCP remains available.
                </h2>
                <p className="mt-4 text-[13px] font-medium leading-5 text-[#2E5B82]/55">
                  If your client supports remote Streamable HTTP MCP, connect
                  directly to the endpoint and use OAuth. This path does not
                  include the Codex-specific starter prompts or vault setup
                  helper.
                </p>
                <div className="mt-5 rounded-lg border border-[#EDF3FA] bg-[#FAFCFF] px-4 py-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2E5B82]/45">
                    MCP endpoint
                  </div>
                  <div className="mt-1 break-all text-[13px] font-bold text-[#0F2B3C]">
                    {MCP_ENDPOINT}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void copyEndpoint()}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#D4E9F7] bg-[#F8FBFE] text-[13px] font-semibold text-[#2E5B82] transition-colors hover:bg-[#EDF5FC]"
                >
                  <Clipboard className="h-4 w-4" />
                  {copied ? "Copied" : "Copy endpoint"}
                </button>
                <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg bg-[#0F2B3C] p-4 text-[12px] leading-6 text-[#DCEBF6]">
                  {`codex mcp add memova --url ${MCP_ENDPOINT}
codex mcp login memova --scopes ${MCP_SCOPES}`}
                </pre>
              </div>

              <div className="rounded-xl border border-[#DCEBF6] bg-white p-6 shadow-lg shadow-[#2E5B82]/[0.04]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#EDF5FC] text-[#2E5B82]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-[1.8rem] leading-[1.1] text-[#0F2B3C]">
                  Permissions are grouped for review.
                </h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {permissionGroups.map(permission => (
                    <span
                      key={permission}
                      className="inline-flex items-center gap-2 rounded-full border border-[#D4E9F7] bg-[#F8FBFE] px-3 py-2 text-[13px] font-semibold text-[#0F2B3C]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#2E5B82]" />
                      {permission}
                    </span>
                  ))}
                </div>
                <details className="mt-5 rounded-lg border border-[#EDF3FA] bg-[#FAFCFF] px-4 py-3">
                  <summary className="cursor-pointer text-[13px] font-semibold text-[#2E5B82]">
                    Advanced scopes
                  </summary>
                  <p className="mt-3 break-words text-[12px] leading-5 text-[#2E5B82]/60">
                    notes.read actions.read actions.write automation.read
                    automation.write
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-xl border border-[#DCEBF6] bg-white p-6 shadow-lg shadow-[#2E5B82]/[0.04]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#EDF5FC] text-[#2E5B82]">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-[1.8rem] leading-[1.1] text-[#0F2B3C]">
                  You stay in control.
                </h2>
                <div className="mt-5 grid gap-3 text-[13px] font-semibold leading-5 text-[#0F2B3C]">
                  {[
                    "OAuth login, no manual token copying",
                    "MCP tokens are separate from website login",
                    "Revoke clients anytime from Connected Clients",
                    "External actions still require your agent-side confirmation",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2E5B82]" />
                      {item}
                    </div>
                  ))}
                </div>
                <a
                  href="/connected-clients"
                  className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-[#2E5B82] transition-colors hover:text-[#0F2B3C]"
                >
                  Manage connected clients
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="rounded-xl border border-[#DCEBF6] bg-white p-6 shadow-lg shadow-[#2E5B82]/[0.04]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#EDF5FC] text-[#2E5B82]">
                  <PlugZap className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-[1.8rem] leading-[1.1] text-[#0F2B3C]">
                  Use the plugin when you want the full workflow.
                </h2>
                <div className="mt-5 grid gap-3 text-[13px] font-semibold leading-5 text-[#0F2B3C]">
                  {[
                    "Guided knowledge-base setup from the Memova app",
                    "Starter prompts such as @memova setup and final-note workflow",
                    "Local iCloud path discovery, validation, and diagnostics",
                    "Low-frequency reminders for setup and plugin upgrades",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2E5B82]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
