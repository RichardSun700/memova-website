/**
 * Memory Section - Structured Knowledge Base / Private Wiki
 * Design: Realistic file tree + note expansion visualization
 * Shows how raw input becomes structured, agent-readable memory
 * Added: Granola-inspired editorial typography & interactive action pills
 */
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Lightbulb, Users, FolderOpen, CheckSquare, FileText, MessageSquare, ChevronRight, ChevronDown, Zap, ArrowRight, Sparkles, Terminal, Mail, CalendarRange, CheckCircle } from "lucide-react";

export default function MemorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Interactive parallel workflow preview state
  const [activePill, setActivePill] = useState<"commit" | "email" | "calendar">("commit");
  const [pillOutput, setPillPillOutput] = useState<string>("Parsed commit context:\n- sync module should move to CRDTs\n- owner: Chen Wei\n- due: June 5\n\nGenerated commit:\ngit commit -m 'feat(sync): refactor local-first synchronization with CRDTs' --author='Chen Wei <chen@memova.local>'");

  const handlePillClick = (pill: "commit" | "email" | "calendar") => {
    setActivePill(pill);
    if (pill === "commit") {
      setPillPillOutput("Parsed commit context:\n- sync module should move to CRDTs\n- owner: Chen Wei\n- due: June 5\n\nGenerated commit:\ngit commit -m 'feat(sync): refactor local-first synchronization with CRDTs' --author='Chen Wei <chen@memova.local>'");
    } else if (pill === "email") {
      setPillPillOutput("Generated email draft:\nTo: chenwei@memova.local\nCc: fred@memova.local\nSubject: Sync API & Survey Review Alignment\n\nChen, based on the parsed project context, let's align on the sync API restrictions next Tuesday. Fred should review the user survey PDF before the sync so the CRDT plan stays source-linked.");
    } else if (pill === "calendar") {
      setPillPillOutput("Generated calendar hold:\nTuesday, June 2 · 10:00–11:00 AM\nTitle: Engineering CRDT Refactor & Survey Alignment\nAttendees: Chen Wei, Fred\nContext attached: meeting_0527.transcript, user_survey_results.pdf");
    }
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-white" ref={ref} id="memory">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center max-w-2xl mx-auto"
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--memova-blue)]">
            Private knowledge base
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--memova-navy)] leading-tight font-normal">
            Your context becomes a
            <br />
            <span className="font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              private knowledge base.
            </span>
          </h2>
          <p className="mt-4 text-[13px] font-medium text-[#637083] max-w-lg mx-auto">
            An agent-ready wiki aligned to your work, decisions, and sources.
          </p>
        </motion.div>

        {/* Visual Transformation Flow: Messy Notes -> Arrow -> Structured Memory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          {/* Left: Messy Handwritten Notes */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col items-center"
          >
            <div className="rounded-[1.65rem] border border-[#DDE6FF] bg-white p-5 shadow-xl shadow-[var(--memova-navy)]/[0.04] w-full max-w-md hover:border-amber-300 transition-all duration-300">
              <div className="flex items-center justify-between mb-3 border-b border-[#F1F3F9] pb-2">
                <span className="text-[10px] font-bold text-[#E11D48] bg-[#FFF1F2] px-2.5 py-0.5 rounded-full border border-[#FFE4E6]">
                  Raw context
                </span>
                <span className="text-[9px] text-[#A9B9D8] font-mono">Voice / Notes / OCR</span>
              </div>
              
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#E4E8F1] bg-[#FAFAFC]">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663068973325/Wt5QQFsBEB5eqhDxTtzcRH/messy-notes-iaK7SgHx5UfBhzLcNEb9Ly.webp"
                  alt="Messy handwritten notes"
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-[11px] text-center text-[#637083] font-medium mt-3 leading-relaxed">
                Notes, sketches, voice, and files enter one trusted layer.
              </p>
            </div>
          </motion.div>

          {/* Middle: Transformation Indicator */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-10 h-10 rounded-full bg-[#F2F6FF] border border-[#DDE6FF] flex items-center justify-center shadow-sm hidden lg:flex"
            >
              <ArrowRight className="w-5 h-5 text-[var(--memova-blue)]" />
            </motion.div>
            <span className="text-[9px] font-bold text-[var(--memova-blue)] uppercase tracking-widest mt-2 hidden lg:block">
              MEMOVA
            </span>
          </div>

          {/* Right: Structured Wiki Tree & Expansion */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File tree */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="rounded-2xl border border-[#DDE6FF] bg-[#FAFCFF] p-5 shadow-lg shadow-[var(--memova-navy)]/[0.03]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-[var(--memova-navy)]">Private Wiki</span>
                <span className="text-[9px] font-bold text-[#148A52] bg-[#EFFBF5] px-2 py-0.5 rounded-full border border-[#D9F4E6]">
                  Agent-ready
                </span>
              </div>
              <FileTreeDemo isInView={isInView} />
            </motion.div>

            {/* Note expansion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="rounded-2xl border border-[#E8EEF7] bg-white p-5 shadow-xl shadow-[var(--memova-navy)]/[0.04]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-[var(--memova-blue)] animate-pulse-soft" />
                  <span className="text-[11px] font-bold text-[var(--memova-navy)]">Context &rarr; Wiki</span>
                </div>
                <span className="text-[9px] font-bold text-[var(--memova-blue)] bg-[#F2F6FF] px-2 py-0.5 rounded-full border border-[#DDE6FF]">
                  Live
                </span>
              </div>
              <NoteToStructureDemo isInView={isInView} />
            </motion.div>
          </div>
        </div>

        {/* Category cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-2"
        >
          {[
            { icon: Lightbulb, label: "Ideas", count: 24, color: "bg-[#FFF7ED]", iconColor: "text-[#EA580C]" },
            { icon: MessageSquare, label: "Meetings", count: 12, color: "bg-[#EEF2FF]", iconColor: "text-[#6366F1]" },
            { icon: Users, label: "People", count: 8, color: "bg-[#F0FDF4]", iconColor: "text-[#16A34A]" },
            { icon: FolderOpen, label: "Projects", count: 5, color: "bg-[#FDF4FF]", iconColor: "text-[#A855F7]" },
            { icon: CheckSquare, label: "Decisions", count: 31, color: "bg-[#FFF1F2]", iconColor: "text-[#E11D48]" },
            { icon: FileText, label: "Sources", count: 47, color: "bg-[#F2F6FF]", iconColor: "text-[var(--memova-blue)]" },
          ].map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.9 + i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-xl border border-[#E8EEF7] bg-white p-3 text-center shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 cursor-pointer"
            >
              <div className={`h-8 w-8 rounded-lg ${cat.color} flex items-center justify-center mx-auto mb-1.5`}>
                <cat.icon className={`h-3.5 w-3.5 ${cat.iconColor}`} />
              </div>
              <span className="text-[10px] font-bold text-[var(--memova-navy)]">{cat.label}</span>
              <span className="block text-[9px] font-medium text-[#A9B9D8] mt-0.5">{cat.count}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Context-first parallel workflow preview */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 bg-slate-50 border border-slate-200/60 rounded-2xl p-6 max-w-5xl mx-auto text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Run a workflow
              </h4>
              <p className="text-xs text-slate-600 mt-1 font-medium max-w-xl">
                Memova parses the shared context first, then prepares downstream actions in parallel for approval.
              </p>
            </div>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 w-fit">
              Parallel actions · approval required
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
            <div className="relative rounded-2xl border border-[#DDE6FF] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--memova-blue)]">
                  <Terminal className="w-3.5 h-3.5" /> Parse context
                </div>
                <span className="rounded-full border border-[#D9F4E6] bg-[#EFFBF5] px-2 py-0.5 text-[8px] font-bold text-[#148A52]">source-linked</span>
              </div>
              <div className="space-y-2">
                {[
                  "Commit intent: refactor sync module to CRDTs",
                  "Owner: Chen Wei · Reviewer: Fred",
                  "Evidence: transcript + survey PDF",
                ].map((line, index) => (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 1.05 + index * 0.08 }}
                    className="rounded-xl border border-slate-100 bg-[#FAFCFF] px-3 py-2 text-[10px] font-bold text-slate-700"
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="absolute -right-8 top-1/2 hidden h-[2px] w-16 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-300 to-transparent lg:block"
                animate={{ opacity: [0.25, 1, 0.25], x: [0, 5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                { key: "commit" as const, icon: Terminal, title: "Commit", desc: "Generate a source-linked commit", status: "ready" },
                { key: "email" as const, icon: Mail, title: "Email", desc: "Draft the alignment note", status: "ready" },
                { key: "calendar" as const, icon: CalendarRange, title: "Schedule", desc: "Create the sync hold", status: "ready" },
              ].map((action, index) => (
                <button
                  key={action.key}
                  onClick={() => handlePillClick(action.key)}
                  className={`relative rounded-2xl border p-4 text-left transition-all duration-300 ${
                    activePill === action.key
                      ? "border-indigo-300 bg-white shadow-lg shadow-indigo-500/[0.08]"
                      : "border-slate-200 bg-white/80 hover:border-indigo-200 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 1.18 + index * 0.08 }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${activePill === action.key ? "bg-indigo-600 text-white" : "bg-[#F2F6FF] text-indigo-600"}`}>
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-emerald-600">{action.status}</span>
                    </div>
                    <div className="text-[12px] font-bold text-[var(--memova-navy)]">{action.title}</div>
                    <p className="mt-1 text-[10px] font-medium leading-4 text-slate-500">{action.desc}</p>
                  </motion.div>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePill}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="mt-4 bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-xl border border-slate-800 shadow-inner relative"
            >
              <div className="absolute top-3 right-3 flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                <CheckCircle className="w-3 h-3" /> Prepared locally
              </div>
              <div className="text-slate-500 text-[10px] mb-2">// Selected parallel output</div>
              <pre className="whitespace-pre-wrap leading-relaxed">{pillOutput}</pre>
            </motion.div>
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}

/* Realistic File Tree Demo */
function FileTreeDemo({ isInView }: { isInView: boolean }) {
  const [expanded, setExpanded] = useState<string[]>(["Projects", "People"]);

  const toggle = (name: string) => {
    setExpanded(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const tree = [
    {
      name: "Projects",
      icon: "📁",
      children: [
        { name: "Memova Mobile", type: "project" },
        { name: "Partner Integration", type: "project" },
        { name: "Q3 Roadmap", type: "project" },
      ],
    },
    {
      name: "People",
      icon: "👤",
      children: [
        { name: "Chen Wei — Engineering", type: "person" },
        { name: "Sarah Kim — Product", type: "person" },
      ],
    },
    {
      name: "Decisions",
      icon: "⚡",
      children: [
        { name: "#14 Switch to local-first sync", type: "decision" },
        { name: "#13 Use CRDTs for offline", type: "decision" },
      ],
    },
    {
      name: "Actions",
      icon: "✓",
      children: [
        { name: "Refactor sync module", type: "action" },
        { name: "Update PRD section 4.2", type: "action" },
      ],
    },
    {
      name: "Sources",
      icon: "📎",
      children: [
        { name: "meeting_0527.transcript", type: "source" },
        { name: "user_survey.pdf", type: "source" },
      ],
    },
  ];

  return (
    <div className="space-y-0.5 font-mono text-left">
      {tree.map((folder, fi) => (
        <motion.div
          key={folder.name}
          initial={{ opacity: 0, x: -8 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 + fi * 0.08 }}
        >
          <button
            onClick={() => toggle(folder.name)}
            className="w-full flex items-center gap-1.5 py-1.5 px-2 rounded-md hover:bg-white transition-colors text-left"
          >
            {expanded.includes(folder.name) ? (
              <ChevronDown className="w-3 h-3 text-[#A9B9D8]" />
            ) : (
              <ChevronRight className="w-3 h-3 text-[#A9B9D8]" />
            )}
            <span className="text-[11px]">{folder.icon}</span>
            <span className="text-[11px] font-bold text-[var(--memova-navy)]">{folder.name}</span>
            <span className="text-[9px] text-[#A9B9D8] ml-auto">{folder.children.length}</span>
          </button>
          {expanded.includes(folder.name) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="ml-5 border-l border-[#E8EEF7] pl-3 space-y-0.5"
            >
              {folder.children.map(child => (
                <div key={child.name} className="flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-[#F2F6FF] transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--memova-blue)]/30" />
                  <span className="text-[10px] text-[#637083] font-medium truncate">{child.name}</span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* Note to Structure Demo - shows transformation */
function NoteToStructureDemo({ isInView }: { isInView: boolean }) {
  return (
    <div className="space-y-4 text-left">
      {/* Raw input */}
      <div className="rounded-xl border border-[#E8EEF7] bg-[#FAFCFF] p-3">
        <span className="text-[9px] font-bold text-[#A9B9D8] uppercase tracking-wider block mb-2">Raw input</span>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold text-white bg-red-400 px-1.5 py-0.5 rounded">REC</span>
            <span className="text-[10px] text-[#637083] font-medium">meeting_0527.transcript</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold text-white bg-[#16A34A] px-1.5 py-0.5 rounded">NOTE</span>
            <span className="text-[10px] text-[#637083] font-medium">&ldquo;Switch to local-first for offline&rdquo;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold text-white bg-[#EA580C] px-1.5 py-0.5 rounded">PDF</span>
            <span className="text-[10px] text-[#637083] font-medium">user_survey_results.pdf</span>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center gap-2 px-4">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[#DDE6FF] to-[var(--memova-blue)]/30" />
        <motion.span
          animate={{ y: [0, 2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[#A9B9D8] text-sm"
        >
          ↓
        </motion.span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-[#DDE6FF] to-[var(--memova-blue)]/30" />
      </div>

      {/* Structured output */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1 }}
        className="rounded-xl border border-[#DDE6FF] bg-white p-3"
      >
        <span className="text-[9px] font-bold text-[var(--memova-blue)] uppercase tracking-wider block mb-2">Structured output</span>
        <div className="space-y-2">
          {[
            { label: "Decision", value: "Switch to local-first sync for offline mode", color: "border-[#6366F1]/20 bg-[#EEF2FF]" },
            { label: "Evidence", value: "40% users on subway commute (survey p.12)", color: "border-[#EA580C]/20 bg-[#FFF7ED]" },
            { label: "Owner", value: "@chen — Engineering lead", color: "border-[#16A34A]/20 bg-[#F0FDF4]" },
            { label: "Action", value: "Refactor sync module to CRDTs by June 5", color: "border-[#E11D48]/20 bg-[#FFF1F2]" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 1.2 + i * 0.12 }}
              className={`rounded-lg border ${item.color} p-2.5`}
            >
              <span className="text-[8px] font-bold text-[#637083] uppercase tracking-wider">{item.label}</span>
              <p className="text-[10px] font-semibold text-[var(--memova-navy)] mt-0.5 leading-4">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
