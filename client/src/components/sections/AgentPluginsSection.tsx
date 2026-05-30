import {
  Code2,
  ExternalLink,
  FolderCheck,
  PlugZap,
  Smartphone,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AgentPluginsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="plugins"
      ref={ref}
      className="relative overflow-hidden border-y border-[#DDE6FF]/70 bg-[#F8FAFF] py-20 md:py-28"
    >
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-indigo-100/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-blue-100/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--memova-blue)]">
              Plugins & MCP
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight text-[var(--memova-navy)] md:text-4xl lg:text-5xl">
              Use Memova from Codex and MCP clients.
            </h2>
            <p className="mt-4 max-w-xl text-[13px] font-medium leading-6 text-[#637083]">
              The Memova Codex plugin connects the iOS app, OAuth MCP, and your
              user-owned iCloud knowledge base. Direct MCP setup still works for
              compatible clients, and the same plugin pattern is designed to
              expand to OpenAI, Claude Code, and other agent surfaces.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="/mcp"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--memova-navy)] px-6 text-[13px] font-bold text-white shadow-lg shadow-[var(--memova-navy)]/10 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                View plugin & MCP setup
              </a>
              <a
                href="/connected-clients"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#DDE6FF] bg-white px-6 text-[13px] font-bold text-[var(--memova-navy)] transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600"
              >
                Manage clients
              </a>
              <a
                href="/research-lab/nvidia-2026-gtc/"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#DDE6FF] bg-white px-6 text-[13px] font-bold text-[var(--memova-navy)] transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600"
              >
                Research lab
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="rounded-[28px] border border-[#DDE6FF] bg-white p-5 shadow-xl shadow-[var(--memova-navy)]/[0.04]"
          >
            <div className="flex items-center gap-3 border-b border-[#E8EEF7] pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2F6FF] text-[var(--memova-blue)]">
                <PlugZap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A9B9D8]">
                  Available now
                </div>
                <div className="break-all text-[14px] font-bold text-[var(--memova-navy)]">
                  Memova Codex Plugin
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {[
                {
                  icon: Smartphone,
                  title: "Start in the Memova app",
                  desc: "Choose new vault or connect an existing knowledge base.",
                },
                {
                  icon: Code2,
                  title: "Run @memova in Codex",
                  desc: "The plugin signs in with OAuth and creates the local input root.",
                },
                {
                  icon: FolderCheck,
                  title: "Bind iOS to the same vault",
                  desc: "The app uses manifest hints to find and verify the iCloud folder.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-2xl border border-[#E8EEF7] bg-[#FAFCFF] px-3 py-3"
                >
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--memova-blue)]" />
                  <div>
                    <div className="text-[12px] font-bold text-[var(--memova-navy)]">
                      {item.title}
                    </div>
                    <div className="mt-0.5 text-[11px] font-medium leading-4 text-[#637083]">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Codex now", "MCP fallback", "OpenAI ecosystem", "Claude Code planned"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#DDE6FF] bg-white px-3 py-1.5 text-[10px] font-bold text-[#637083]"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
