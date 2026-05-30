import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Camera,
  Check,
  ChevronDown,
  Code2,
  Database,
  FileText,
  Layers3,
  ListChecks,
  Lock,
  Mic,
  Send,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserCheck,
} from "lucide-react";

const workflowSteps = [
  {
    id: "align-context",
    step: "01",
    title: "Align Context",
    actor: "Memova",
    short: "Inputs become a traceable context packet.",
    detail:
      "Voice, notes, OCR and files are already captured above; this step shows how Memova merges those signals into one source-linked context packet instead of repeating capture as a separate workflow stage.",
    icon: Layers3,
    badgeClass: "bg-[#F2F6FF] text-[var(--memova-blue)] border-[#DDE6FF]",
    glowClass: "shadow-blue-500/10",
    bullets: ["Signal merge", "Source-linked packet", "Ready for structuring"],
  },
  {
    id: "private-kb",
    step: "02",
    title: "Private KB",
    actor: "Memova + Agent",
    short: "The packet becomes an agent-ready wiki.",
    detail:
      "Memova and the agent turn the context packet into a private knowledge base with projects, people, decisions, constraints, actions and evidence trails.",
    icon: BrainCircuit,
    badgeClass: "bg-[#F0FDF4] text-[#148A52] border-[#D9F4E6]",
    glowClass: "shadow-emerald-500/10",
    bullets: ["Entity graph", "Evidence preserved", "Private boundary"],
  },
  {
    id: "plan",
    step: "03",
    title: "Review Plan",
    actor: "Memova + Agent + Human",
    short: "A plan is proposed, then paused for approval.",
    detail:
      "The agent proposes context-aware steps with linked evidence, but the loop intentionally stops here so the user can approve exactly what should be sent to Codex.",
    icon: UserCheck,
    badgeClass: "bg-[#EEF2FF] text-[#6366F1] border-[#DDE6FF]",
    glowClass: "shadow-indigo-500/10",
    bullets: ["Plan with evidence", "Human approval gate", "Selective handoff"],
  },
  {
    id: "approved-run",
    step: "04",
    title: "Codex Run",
    actor: "Codex",
    short: "Only approved work crosses into execution.",
    detail:
      "Codex receives the approved plan and linked context package, runs the workflow, then returns output and feedback to the knowledge base instead of creating a dead-end action.",
    icon: ListChecks,
    badgeClass: "bg-[#EFFBF5] text-[#0F8A5F] border-[#CDEFE0]",
    glowClass: "shadow-teal-500/10",
    bullets: ["Approved actions only", "Context included", "Feedback writes back"],
  },
];

const approvalActions = [
  { text: "Refactor sync module to CRDTs", type: "Codex task", risk: "Repo change" },
  { text: "Review user survey results PDF", type: "Analysis", risk: "Source-linked" },
  { text: "Draft PRD update for Fred", type: "Document", risk: "Human review" },
];

export default function WorkflowSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-120px" });
  const [activeStep, setActiveStep] = useState(0);
  const [approvedList, setApprovedList] = useState<number[]>([0, 1]);
  const [sentToCodex, setSentToCodex] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isInView || sentToCodex || activeStep >= 2) return;

    const timer = window.setTimeout(() => {
      setActiveStep((current) => Math.min(current + 1, 2));
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [activeStep, isInView, sentToCodex]);

  const toggleApprove = (index: number) => {
    setApprovedList((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index],
    );
  };

  const handleSendToCodex = () => {
    if (approvedList.length === 0 || isSending) return;
    setIsSending(true);
    window.setTimeout(() => {
      setIsSending(false);
      setSentToCodex(true);
      setActiveStep(3);
    }, 1200);
  };

  const currentStep = workflowSteps[activeStep];
  const CurrentIcon = currentStep.icon;

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28" ref={ref}>
      <div className="pointer-events-none absolute right-10 top-1/4 h-80 w-80 rounded-full bg-blue-50/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 left-10 h-80 w-80 rounded-full bg-emerald-50/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--memova-blue)]">
            Context entry point
          </p>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <h2 className="font-display text-2xl font-bold leading-tight text-[var(--memova-navy)] md:text-4xl lg:text-5xl">
              Workflow in the
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {" "}AI Era.
              </span>
            </h2>
            <p className="max-w-2xl text-[13px] font-medium leading-6 text-[#637083]">
              Context no longer moves from one app to another by hand. Memova captures and aligns the work, agents help plan, humans approve, and Codex runs only the approved workflow.
            </p>
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="rounded-[28px] border border-[#DDE6FF] bg-gradient-to-br from-[#F6F9FF] via-white to-[#FAFCFF] p-5 shadow-xl shadow-[var(--memova-navy)]/[0.04] md:p-7"
        >
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--memova-blue)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--memova-blue)]">
                  Integrated workflow loop
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[var(--memova-navy)] md:text-2xl">
                From context signals to approved Codex run
              </h3>
              <p className="mt-2 max-w-xl text-[11px] font-medium leading-5 text-[#637083]">
                The input motion now lives inside the first interactive step, so the workflow starts directly with signal alignment and moves into memory, approval, execution, and feedback.
              </p>
            </div>
            <div className="rounded-full border border-[#E8EEF7] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#637083] shadow-sm">
              {sentToCodex ? "Codex run started" : activeStep >= 2 ? "Paused for approval" : "Auto-advancing every 5s"}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
            <div className="space-y-3">
              {workflowSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = activeStep === index;
                const isComplete = sentToCodex ? index <= 3 : index < Math.min(activeStep, 3);
                const isApprovalStop = index === 2 && !sentToCodex;

                return (
                  <motion.button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    initial={{ opacity: 0, x: -15 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.35 + index * 0.08 }}
                    className={`group relative w-full rounded-2xl border bg-white p-4 text-left transition-all duration-300 ${
                      isActive
                        ? `border-[#AFC2FF] shadow-lg ${step.glowClass}`
                        : "border-[#E8EEF7] shadow-sm hover:border-[#DDE6FF] hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${step.badgeClass}`}>
                        {isComplete ? <Check className="h-4 w-4 stroke-[3]" /> : <StepIcon className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#A9B9D8]">
                            {step.step}
                          </span>
                          <span className={`rounded-full border px-2 py-0.5 text-[8px] font-bold ${step.badgeClass}`}>
                            Actor: {step.actor}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-[13px] font-bold text-[var(--memova-navy)]">{step.title}</h4>
                          <ChevronDown
                            className={`h-3.5 w-3.5 text-[#A9B9D8] transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
                          />
                        </div>
                        <p className="mt-1 text-[10px] font-medium leading-4 text-[#637083]">{step.short}</p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 border-t border-[#E8EEF7] pt-3">
                            <p className="text-[11px] font-medium leading-5 text-[#637083]">{step.detail}</p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {step.bullets.map((bullet) => (
                                <span
                                  key={bullet}
                                  className="rounded-full border border-[#E8EEF7] bg-[#FAFCFF] px-2 py-1 text-[9px] font-bold text-[#637083]"
                                >
                                  {bullet}
                                </span>
                              ))}
                            </div>
                            {isApprovalStop && (
                              <div className="mt-3 rounded-xl border border-[#F8E7A7] bg-[#FFF8DF] px-3 py-2 text-[10px] font-bold text-[#A96F00]">
                                Auto-play stops here until the plan is approved and sent to Codex.
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {index < workflowSteps.length - 1 && (
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2, ease: "easeInOut" }}
                        className="absolute -right-2 top-1/2 hidden -translate-y-1/2 lg:block"
                      >
                        <ArrowRight className="h-4 w-4 text-[#A9B9D8]" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-[#E8EEF7] bg-white p-5 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-full flex-col"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${currentStep.badgeClass}`}>
                        <CurrentIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#A9B9D8]">
                          Step {currentStep.step} · {currentStep.actor}
                        </div>
                        <h4 className="font-display text-lg font-bold text-[var(--memova-navy)]">{currentStep.title}</h4>
                      </div>
                    </div>
                    <span className="rounded-full border border-[#E8EEF7] bg-[#FAFCFF] px-2.5 py-1 text-[9px] font-bold text-[#637083]">
                      Click any step to expand
                    </span>
                  </div>

                  {activeStep === 0 && <AlignmentPanel />}
                  {activeStep === 1 && <PrivateKbPanel />}
                  {activeStep === 2 && (
                    <ApprovalPanel
                      approvedList={approvedList}
                      sentToCodex={sentToCodex}
                      isSending={isSending}
                      onToggleApprove={toggleApprove}
                      onSendToCodex={handleSendToCodex}
                    />
                  )}
                  {activeStep === 3 && <CodexPanel sentToCodex={sentToCodex} onBackToPlan={() => setActiveStep(2)} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InputMethodCard({
  icon: Icon,
  label,
  title,
  description,
  children,
  accent,
  delay = 0,
}: {
  icon: typeof Mic;
  label: string;
  title: string;
  description: string;
  children: React.ReactNode;
  accent: "indigo" | "emerald" | "orange";
  delay?: number;
}) {
  const accentClasses = {
    indigo: "hover:border-indigo-300 hover:shadow-indigo-500/[0.04] bg-[#EEF2FF] text-[#6366F1]",
    emerald: "hover:border-emerald-300 hover:shadow-emerald-500/[0.04] bg-[#F0FDF4] text-[#16A34A]",
    orange: "hover:border-orange-300 hover:shadow-orange-500/[0.04] bg-[#FFF7ED] text-[#EA580C]",
  }[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`group cursor-pointer rounded-2xl border border-[#E8EEF7] bg-[#FAFCFF] p-5 transition-all duration-300 hover:shadow-lg ${accentClasses.split(" ").slice(0, 2).join(" ")}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${accentClasses.split(" ").slice(2).join(" ")}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C96A8]">{label}</span>
      </div>
      <div className="mb-4 rounded-xl border border-[#E8EEF7] bg-white p-4">{children}</div>
      <h3 className="font-display text-[15px] font-bold text-[var(--memova-navy)] transition-colors group-hover:text-[var(--memova-blue)]">
        {title}
      </h3>
      <p className="mt-1 text-[11px] font-medium text-[#637083]">{description}</p>
    </motion.div>
  );
}

function AlignmentPanel() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { icon: Mic, label: "Voice", value: "meeting_0527.transcript", color: "text-[#6366F1] bg-[#EEF2FF]" },
            { icon: FileText, label: "Notes", value: "local-first sync decision", color: "text-[#16A34A] bg-[#F0FDF4]" },
            { icon: Camera, label: "OCR & Files", value: "survey_results.pdf", color: "text-[#EA580C] bg-[#FFF7ED]" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-xl border border-[#E8EEF7] bg-[#FAFCFF] p-3"
            >
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.color}`}>
                  <item.icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#A9B9D8]">{item.label}</div>
                  <div className="truncate text-[10px] font-bold text-[var(--memova-navy)]">{item.value}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="hidden flex-col items-center gap-2 lg:flex">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{ x: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.25, ease: "easeInOut" }}
              className="h-[2px] w-14 rounded-full bg-gradient-to-r from-[#AFC2FF] to-[#6366F1]"
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl border border-[#DDE6FF] bg-[#F6F9FF] p-4"
        >
          <motion.div
            className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#6366F1] to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--memova-blue)]">
              <Layers3 className="h-3.5 w-3.5" />
              Context packet
            </div>
            <span className="rounded-full border border-[#DDE6FF] bg-white px-2 py-0.5 text-[8px] font-bold text-[#637083]">
              source-linked
            </span>
          </div>
          <div className="space-y-2">
            {["Decision: switch to local-first sync", "Owner: Chen Wei · Due: June 5", "Evidence: survey p.12 + transcript quote"].map((line, index) => (
              <motion.div
                key={line}
                initial={{ width: "0%", opacity: 0 }}
                animate={{ width: ["0%", index === 1 ? "82%" : "100%"], opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.25 + index * 0.18 }}
                className="rounded-lg border border-[#E8EEF7] bg-white px-3 py-2 text-[10px] font-bold text-[var(--memova-navy)]"
              >
                {line}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-[#E8EEF7] bg-white p-3">
          <VoiceRecordingDemo />
        </div>
        <div className="rounded-xl border border-[#E8EEF7] bg-white p-3">
          <NoteExpansionDemo />
        </div>
        <div className="rounded-xl border border-[#E8EEF7] bg-white p-3">
          <OCRScanDemo />
        </div>
      </div>
    </div>
  );
}

function PrivateKbPanel() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-[#D9F4E6] bg-[#F0FDF4] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#148A52]">
              <Database className="h-3.5 w-3.5" />
              Private knowledge base
            </div>
            <span className="rounded-full border border-[#D9F4E6] bg-white px-2 py-0.5 text-[8px] font-bold text-[#148A52]">
              local boundary
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { label: "Projects", value: "Memova Mobile" },
              { label: "People", value: "Chen Wei · Fred" },
              { label: "Decisions", value: "Local-first sync" },
              { label: "Sources", value: "Transcript + PDF" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                className="rounded-xl border border-[#D9F4E6] bg-white px-3 py-2"
              >
                <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#148A52]">{item.label}</div>
                <div className="mt-1 truncate text-[11px] font-bold text-[var(--memova-navy)]">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8EEF7] bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--memova-blue)]">
            <Bot className="h-3.5 w-3.5" />
            Agent alignment
          </div>
          <div className="space-y-2">
            {["Cluster related sources", "Extract owners and due dates", "Keep evidence beside every action"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-2 rounded-xl border border-[#E8EEF7] bg-[#FAFCFF] p-2.5"
              >
                <Check className="h-3.5 w-3.5 text-[#148A52]" />
                <span className="text-[10px] font-bold text-[#637083]">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#DDE6FF] bg-[#F6F9FF] p-3 text-[11px] font-bold text-[#637083]">
        <motion.div
          className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="relative z-10">The agent can read the structure, but the execution boundary stays permissioned.</span>
      </div>
    </div>
  );
}

function ApprovalPanel({
  approvedList,
  sentToCodex,
  isSending,
  onToggleApprove,
  onSendToCodex,
}: {
  approvedList: number[];
  sentToCodex: boolean;
  isSending: boolean;
  onToggleApprove: (index: number) => void;
  onSendToCodex: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[#F8E7A7] bg-[#FFF8DF] px-3 py-2">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A96F00]">
          <Lock className="h-3.5 w-3.5" />
          Approval required
        </div>
        <span className="text-[9px] font-bold text-[#A96F00]">Auto-play paused</span>
      </div>

      <div className="space-y-2.5">
        {approvalActions.map((action, index) => {
          const approved = approvedList.includes(index);
          return (
            <button
              key={action.text}
              type="button"
              onClick={() => onToggleApprove(index)}
              className={`w-full rounded-xl border p-3.5 text-left transition-all duration-200 ${
                approved ? "border-[#D9F4E6] bg-[#EFFBF5]" : "border-[#E8EEF7] bg-[#FAFCFF] hover:border-[#DDE6FF]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                      approved ? "border-[#148A52] bg-[#148A52] text-white" : "border-[#C1C9D2] bg-white"
                    }`}
                  >
                    {approved && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[11px] font-bold text-[var(--memova-navy)]">{action.text}</div>
                    <div className="mt-0.5 text-[9px] font-medium text-[#637083]">{action.risk}</div>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold ${approved ? "border-[#D9F4E6] bg-white text-[#148A52]" : "border-[#DDE6FF] bg-[#F2F6FF] text-[var(--memova-blue)]"}`}>
                  {approved ? "Approved" : action.type}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onSendToCodex}
        disabled={isSending || sentToCodex || approvedList.length === 0}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[12px] font-bold text-white transition-all ${
          sentToCodex
            ? "bg-[#10B981] shadow-md shadow-[#10B981]/20"
            : approvedList.length === 0
              ? "cursor-not-allowed bg-[#A9B9D8]"
              : "bg-[#0052CC] shadow-md shadow-[#0052CC]/10 hover:bg-[#0040A3]"
        }`}
      >
        {isSending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : sentToCodex ? (
          <>
            <Check className="h-4 w-4" />
            Sent to Codex
          </>
        ) : (
          <>
            <Send className="h-3.5 w-3.5" />
            Send {approvedList.length} approved actions to Codex
          </>
        )}
      </button>

      <div className="rounded-xl border border-[#E8EEF7] bg-[#FAFCFF] p-3">
        <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#A9B9D8]">Context bundle included</div>
        <div className="grid gap-2 sm:grid-cols-3">
          {["Linked sources", "Constraints", "Expected output"].map((item) => (
            <span key={item} className="rounded-lg border border-[#E8EEF7] bg-white px-2 py-1 text-[9px] font-bold text-[#637083]">
              {item}
            </span>
          ))}
        </div>
      </div>

      <p className="text-center text-[9px] font-medium text-[#637083]/80">Nothing runs until this button is clicked.</p>
    </div>
  );
}

function CodexPanel({ sentToCodex, onBackToPlan }: { sentToCodex: boolean; onBackToPlan: () => void }) {
  if (!sentToCodex) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#DDE6FF] bg-[#FAFCFF] p-6 text-center">
        <Code2 className="mb-3 h-8 w-8 text-[#A9B9D8]" />
            <h5 className="font-display text-lg font-bold text-[var(--memova-navy)]">Codex is waiting for approval.</h5>
        <p className="mt-2 max-w-sm text-[12px] font-medium leading-5 text-[#637083]">
          This step can be opened, but the run stays locked until the plan is approved in step 03.
        </p>
        <button
          type="button"
          onClick={onBackToPlan}
          className="mt-4 rounded-xl bg-[#0052CC] px-4 py-2 text-[11px] font-bold text-white hover:bg-[#0040A3]"
        >
          Review approval gate
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#D9F4E6] bg-[#EFFBF5] p-3 text-[11px] font-bold text-[#148A52]">
        Approved plan received. Codex is running with linked Memova context.
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[#334155] bg-[#0F172A] p-4 font-mono text-[10px] text-[#38BDF8]"
      >
        <div className="mb-3 flex items-center gap-1.5 border-b border-[#334155] pb-2 text-[#94A3B8]">
          <Terminal className="h-3.5 w-3.5" />
          <span>Codex Run Environment</span>
        </div>
        <div className="space-y-1.5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            $ codex run --context memova_private_kb
          </motion.div>
          <motion.div className="text-[#10B981]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            ✔ Loaded approved actions and linked sources
          </motion.div>
          <motion.div className="text-[#10B981]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            ✔ Repo task prepared with constraints
          </motion.div>
          <motion.div className="text-[#10B981]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
            ✔ PRD draft and survey review generated
          </motion.div>
          <motion.div className="text-[#A78BFA]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
            ↳ Feedback packet prepared for Private KB
          </motion.div>
          <motion.div className="mt-1 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
            Waiting for human feedback.
          </motion.div>
        </div>
      </motion.div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[#E8EEF7] bg-white p-3">
          <ShieldCheck className="mb-2 h-4 w-4 text-[#148A52]" />
          <div className="text-[11px] font-bold text-[var(--memova-navy)]">Permissioned execution</div>
          <p className="mt-1 text-[9px] font-medium text-[#637083]">Only approved actions crossed the boundary.</p>
        </div>
        <div className="rounded-xl border border-[#E8EEF7] bg-white p-3">
          <Code2 className="mb-2 h-4 w-4 text-[var(--memova-blue)]" />
          <div className="text-[11px] font-bold text-[var(--memova-navy)]">Agent-ready handoff</div>
          <p className="mt-1 text-[9px] font-medium text-[#637083]">Codex receives context, plan and constraints together, then returns outputs to the loop.</p>
        </div>
      </div>
    </div>
  );
}

function VoiceRecordingDemo() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((value) => (value + 1) % 60);
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-2.5 w-2.5 rounded-full bg-red-500"
        />
        <span className="text-[10px] font-bold text-[#637083]">Recording</span>
        <span className="ml-auto font-mono text-[10px] text-[#A9B9D8]">0:{seconds.toString().padStart(2, "0")}</span>
      </div>
      <div className="flex h-8 items-center gap-[2px]">
        {[8, 14, 22, 10, 18, 26, 12, 20, 16, 24, 11, 19, 27, 13, 21, 15, 23, 9, 17, 25, 12, 20, 14, 22].map((height, index) => (
          <motion.div
            key={index}
            className="w-[2px] rounded-full bg-[var(--memova-blue)]"
            animate={{ height: [4, height, 4], opacity: [0.3, 0.85, 0.3] }}
            transition={{ duration: 0.75, repeat: Infinity, delay: index * 0.03, ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {['topic: sync', 'owner: chen', 'due: June 5'].map((tag, index) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.25 }}
            className="rounded bg-[#EEF2FF] px-1.5 py-0.5 text-[8px] font-bold text-[#6366F1]"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function NoteExpansionDemo() {
  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-[#E8EEF7] bg-[#FAFCFF] p-2.5">
        <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-[#A9B9D8]">Note</span>
        <p className="text-[10px] font-medium leading-4 text-[var(--memova-navy)]">
          “Need to align on local-first sync and agent handoff.”
        </p>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        transition={{ duration: 1.3, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="overflow-hidden"
      >
        <div className="rounded-lg border border-[#D9F4E6] bg-[#F0FDF4] p-2.5">
          <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-[#148A52]">+ Context</span>
          <div className="space-y-1">
            <motion.div animate={{ width: ["0%", "100%"] }} transition={{ duration: 2, delay: 0.7 }} className="h-1.5 rounded bg-[#16A34A]/15" />
            <motion.div animate={{ width: ["0%", "84%"] }} transition={{ duration: 2, delay: 0.9 }} className="h-1.5 rounded bg-[#16A34A]/10" />
            <motion.div animate={{ width: ["0%", "68%"] }} transition={{ duration: 2, delay: 1.1 }} className="h-1.5 rounded bg-[#16A34A]/10" />
          </div>
        </div>
      </motion.div>
      <div className="flex gap-1">
        {['Summary', 'Decision', 'Plan'].map((tag) => (
          <span key={tag} className="rounded bg-[#F2F6FF] px-1.5 py-0.5 text-[8px] font-bold text-[var(--memova-blue)]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function OCRScanDemo() {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-lg border border-[#FFE4C8] bg-[#FFF7ED] p-3">
        <div className="space-y-1.5">
          {["100%", "80%", "92%", "58%", "76%", "42%"].map((width) => (
            <div key={width} style={{ width }} className="h-1.5 rounded bg-[#EA580C]/10" />
          ))}
        </div>
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EA580C] to-transparent"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="mt-2 flex items-center gap-2">
        <span className="rounded border border-[#D9F4E6] bg-[#EFFBF5] px-1.5 py-0.5 text-[8px] font-bold text-[#148A52]">
          Extracted
        </span>
        <span className="text-[9px] font-medium text-[#637083]">linked to source</span>
      </motion.div>
    </div>
  );
}
