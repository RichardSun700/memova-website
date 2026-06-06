/**
 * User Cases Section - Real scenarios with stacked layout and interactive password decryption
 * Optimized: Dual-column layout for desktop to keep illustration and interactive cards compact.
 * Updated: Enhanced with glowing color accents, magnetic hover lift, and physical click animations.
 */
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Heart, Briefcase, Code, Lock, Unlock, Mic, FileText, Camera, Sparkles, KeyRound, ChevronDown, ExternalLink, NotebookPen } from "lucide-react";
import { toast } from "sonner";
import { cases as realUserCases, type UserCase } from "@/pages/UserCases";

// HEALTH: Improved - Shows disease history + drug conflict detection
const healthOutputHTML = `
<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(180deg, #fbfffd 0%, #f4f9ff 100%); color: #1a2a4a; padding: 14px; }
  .shell { min-height: 100%; }
  .top { display: flex; justify-content: space-between; gap: 8px; align-items: flex-start; border-bottom: 1px solid #ddeee6; padding-bottom: 9px; margin-bottom: 10px; }
  h1 { font-size: 13px; color: #20385f; line-height: 1.15; }
  .subtitle { font-size: 8.5px; color: #6f7d90; margin-top: 3px; font-weight: 600; }
  .badge { font-size: 7.5px; background: #e8f8ef; color: #148a52; border: 1px solid #cdebdc; padding: 3px 7px; border-radius: 999px; font-weight: 800; white-space: nowrap; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .card { background: rgba(255,255,255,0.9); border: 1px solid #e3edf5; border-radius: 10px; padding: 9px; box-shadow: 0 8px 18px rgba(45,58,92,0.05); }
  .wide { grid-column: 1 / -1; }
  .label { font-size: 7.5px; text-transform: uppercase; letter-spacing: .12em; color: #8e9cc7; font-weight: 900; margin-bottom: 6px; }
  .source { display: flex; justify-content: space-between; gap: 6px; font-size: 8.5px; padding: 5px 0; border-bottom: 1px solid #eef3f8; color: #46556a; font-weight: 650; }
  .source:last-child { border-bottom: 0; }
  .pillrow { display: flex; flex-wrap: wrap; gap: 5px; }
  .pill { font-size: 8px; background: #f1f7ff; border: 1px solid #dbe8ff; color: #31517d; padding: 4px 6px; border-radius: 7px; font-weight: 750; }
  .alert { border-color: #f5d07c; background: #fff8e7; display: flex; gap: 8px; align-items: flex-start; }
  .alert strong { display:block; color: #b26a00; font-size: 10px; margin-bottom: 2px; }
  .alert p { color: #7a5a13; font-size: 8.8px; line-height: 1.35; }
  .mini-table { width: 100%; border-collapse: collapse; font-size: 8.5px; }
  .mini-table td { padding: 5px 0; border-bottom: 1px solid #eef3f8; vertical-align: top; }
  .mini-table td:first-child { color: #8e9cc7; font-weight: 900; width: 38%; }
  .mini-table td:last-child { color: #263850; font-weight: 650; }
  .task { display: grid; grid-template-columns: 13px 1fr auto; gap: 6px; align-items: start; font-size: 8.8px; padding: 5px 0; border-bottom: 1px solid #eef3f8; }
  .task:last-child { border-bottom: 0; }
  .check { width: 12px; height: 12px; border-radius: 4px; background: #148a52; color: white; display:flex; align-items:center; justify-content:center; font-size: 8px; font-weight: 900; }
  .time { color:#8e9cc7; font-size: 7.5px; font-weight: 900; }
  .muted { color:#65748a; font-size:8.5px; line-height:1.35; font-weight: 600; }
</style>
</head>
<body>
  <div class="shell">
    <div class="top">
      <div><h1>Health Wiki</h1><div class="subtitle">Approved local sources</div></div>
      <span class="badge">Unlocked locally</span>
    </div>
    <div class="grid">
      <div class="card">
        <div class="label">Evidence</div>
        <div class="source"><span>Transcript</span><strong>12 key facts</strong></div>
        <div class="source"><span>Image note</span><strong>2 follow-ups</strong></div>
        <div class="source"><span>Meds</span><strong>4 active items</strong></div>
      </div>
      <div class="card">
        <div class="label">Context</div>
        <div class="pillrow">
          <span class="pill">Asthma</span><span class="pill">Allergy</span><span class="pill">Albuterol PRN</span>
        </div>
      </div>
      <div class="card alert wide">
        <div style="font-weight:900;color:#b26a00;">!</div>
        <div><strong>Conflict surfaced</strong><p>Risk detected. Chloe approves sharing.</p></div>
      </div>
      <div class="card">
        <div class="label">Private wiki</div>
        <table class="mini-table"><tr><td>Condition</td><td>Asthma · cold air, pollen.</td></tr><tr><td>Evidence</td><td>Audio 03:12 + notes.</td></tr><tr><td>Risk</td><td>Check beta-blocker risk.</td></tr></table>
      </div>
      <div class="card">
        <div class="label">Approved actions</div>
        <div class="task"><span class="check">✓</span><span>Draft doctor question.</span><span class="time">Today</span></div>
        <div class="task"><span class="check">✓</span><span>Log peak flow for 7 days.</span><span class="time">8 AM</span></div>
        <div class="task"><span class="check">✓</span><span>Attach evidence summary.</span><span class="time">Next visit</span></div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// BUSINESS: Improved - Shows whiteboard photos, transcripts, and structured timeline
const businessOutputHTML = `
<!DOCTYPE html>
<html>
<head>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:linear-gradient(180deg,#fbfdff 0%,#f5f8ff 100%); color:#1a2a4a; padding:14px; }
  .top { display:flex; justify-content:space-between; gap:8px; align-items:flex-start; border-bottom:1px solid #e2e9f7; padding-bottom:9px; margin-bottom:10px; }
  h1 { font-size:13px; line-height:1.15; color:#20385f; }
  .subtitle { font-size:8.5px; color:#6f7d90; margin-top:3px; font-weight:650; }
  .badge { font-size:7.5px; background:#ebf3ff; color:#0052cc; border:1px solid #d4e5ff; padding:3px 7px; border-radius:999px; font-weight:850; white-space:nowrap; }
  .grid { display:grid; grid-template-columns:1.05fr .95fr; gap:8px; }
  .card { background:rgba(255,255,255,.92); border:1px solid #e4e8f1; border-radius:10px; padding:9px; box-shadow:0 8px 18px rgba(45,58,92,.05); }
  .wide { grid-column:1/-1; }
  .label { font-size:7.5px; text-transform:uppercase; letter-spacing:.12em; color:#8e9cc7; font-weight:900; margin-bottom:6px; }
  .summary { font-size:9px; color:#44546a; line-height:1.42; font-weight:650; }
  .summary strong { color:#18345d; }
  .stake { display:grid; grid-template-columns:52px 1fr; gap:5px; font-size:8.5px; padding:5px 0; border-bottom:1px solid #eef3f8; }
  .stake:last-child { border-bottom:0; }
  .role { color:#0052cc; font-weight:900; }
  .map { display:grid; grid-template-columns:1fr 16px 1fr; align-items:center; gap:6px; }
  .node { background:#f5f8ff; border:1px solid #dde8ff; border-radius:8px; padding:7px; font-size:8.6px; font-weight:750; color:#2d3a5c; min-height:38px; }
  .arrow { text-align:center; color:#8e9cc7; font-weight:900; }
  .timeline { display:flex; flex-direction:column; gap:5px; }
  .item { display:grid; grid-template-columns:34px 1fr; gap:7px; align-items:start; background:#fbfdff; border-left:3px solid #0052cc; border-radius:0 7px 7px 0; padding:6px 8px; border-top:1px solid #eef3f8; border-right:1px solid #eef3f8; border-bottom:1px solid #eef3f8; }
  .time { color:#8e9cc7; font-size:8px; font-weight:950; }
  .txt { color:#2d3a5c; font-size:8.7px; font-weight:700; line-height:1.3; }
  .draft { background:#f8fbff; border:1px dashed #b8cff7; border-radius:8px; padding:8px; font-size:8.5px; line-height:1.42; color:#45566d; font-weight:650; }
</style>
</head>
<body>
  <div class="top">
    <div><h1>Deal Wiki</h1><div class="subtitle">Approved deal context</div></div>
    <span class="badge">Permissioned</span>
  </div>
  <div class="grid">
    <div class="card wide">
      <div class="label">Synthesis</div>
      <p class="summary">One <strong>APAC beta</strong> workspace: owners, risks, next steps.</p>
    </div>
    <div class="card">
      <div class="label">Stakeholders</div>
      <div class="stake"><span class="role">Acme CFO</span><span>Needs staged pricing.</span></div>
      <div class="stake"><span class="role">Product</span><span>Needs SSO proof.</span></div>
      <div class="stake"><span class="role">Security</span><span>Needs gated export.</span></div>
    </div>
    <div class="card">
      <div class="label">Decision map</div>
      <div class="map"><div class="node">Whiteboard: markets</div><div class="arrow">→</div><div class="node">Wiki: pilot sequence</div></div>
      <div style="height:6px"></div>
      <div class="map"><div class="node">Chat: pricing</div><div class="arrow">→</div><div class="node">Action: CFO packet</div></div>
    </div>
    <div class="card">
      <div class="label">Timeline</div>
      <div class="timeline"><div class="item"><span class="time">Q2</span><span class="txt">Legal, pricing, security.</span></div><div class="item"><span class="time">Q3</span><span class="txt">APAC beta starts.</span></div><div class="item"><span class="time">Q4</span><span class="txt">Reseller expansion.</span></div></div>
    </div>
    <div class="card">
      <div class="label">Draft</div>
      <div class="draft">Draft Acme follow-up: pricing workshop, security summary, Salesforce scope.</div>
    </div>
  </div>
</body>
</html>
`;

// DEVELOPER: Improved - Shows system architecture, prompt engineering details, and deployment logs
const developerOutputHTML = `
<!DOCTYPE html>
<html>
<head>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'SFMono-Regular','Cascadia Code','Courier New',monospace; background:#0b1120; color:#dbeafe; padding:14px; }
  .top { display:flex; justify-content:space-between; gap:8px; align-items:flex-start; border-bottom:1px solid #26344f; padding-bottom:9px; margin-bottom:10px; }
  h1 { font-size:12px; color:#7dd3fc; line-height:1.2; }
  .subtitle { font-size:8px; color:#94a3b8; margin-top:3px; font-weight:650; }
  .badge { font-size:7.5px; background:#13233d; color:#4ade80; border:1px solid #2a4569; padding:3px 7px; border-radius:999px; font-weight:900; white-space:nowrap; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .panel { background:#111827; border:1px solid #26344f; border-radius:10px; padding:9px; box-shadow:0 10px 22px rgba(0,0,0,.22); }
  .wide { grid-column:1/-1; }
  .label { font-size:7.5px; text-transform:uppercase; letter-spacing:.12em; color:#7dd3fc; font-weight:900; margin-bottom:6px; }
  .kv { display:grid; grid-template-columns:62px 1fr; gap:6px; font-size:8.4px; padding:4px 0; border-bottom:1px solid #1f2a44; }
  .kv:last-child { border-bottom:0; }
  .key { color:#94a3b8; font-weight:900; }
  .val { color:#e2e8f0; font-weight:700; line-height:1.32; }
  .step { display:flex; gap:6px; font-size:8.5px; line-height:1.32; padding:4px 0; color:#dbeafe; font-weight:650; }
  .num { color:#4ade80; font-weight:950; }
  .diff { background:#020617; border:1px solid #1e293b; border-radius:8px; padding:8px; font-size:8.2px; line-height:1.45; color:#cbd5e1; overflow:hidden; }
  .green { color:#4ade80; } .blue { color:#38bdf8; } .muted { color:#64748b; }
  .test { display:flex; justify-content:space-between; gap:8px; font-size:8.4px; padding:4px 0; border-bottom:1px solid #1f2a44; color:#cbd5e1; font-weight:700; }
  .test:last-child { border-bottom:0; }
  .ok { color:#4ade80; font-weight:950; }
</style>
</head>
<body>
  <div class="top">
    <div><h1>codex-agent/context-bundle</h1><div class="subtitle">Approved developer context</div></div>
    <span class="badge">Agent-ready</span>
  </div>
  <div class="grid">
    <div class="panel">
      <div class="label">Context</div>
      <div class="kv"><span class="key">Goal</span><span class="val">Add auth middleware and route guard.</span></div>
      <div class="kv"><span class="key">Evidence</span><span class="val">Transcript, PRD, logs, repo notes.</span></div>
      <div class="kv"><span class="key">Constraint</span><span class="val">Keys stay local.</span></div>
    </div>
    <div class="panel">
      <div class="label">Plan</div>
      <div class="step"><span class="num">01</span><span>Generate JWT middleware.</span></div>
      <div class="step"><span class="num">02</span><span>Patch guarded routes.</span></div>
      <div class="step"><span class="num">03</span><span>Test and draft commit.</span></div>
    </div>
    <div class="panel wide">
      <div class="label">Patch preview</div>
      <div class="diff"><span class="muted">$ codex apply ./memova-developer-wiki</span><br/><span class="green">+ export function requireAuth(req, res, next)</span><br/><span class="green">+ const token = readBearerToken(req.headers.authorization)</span><br/><span class="blue">~ router.use('/api/private', requireAuth)</span><br/><span class="green">+ test('rejects expired JWT', async () => ...)</span></div>
    </div>
    <div class="panel">
      <div class="label">Verification</div>
      <div class="test"><span>auth.middleware.test.ts</span><span class="ok">PASS</span></div>
      <div class="test"><span>route-guard.test.ts</span><span class="ok">PASS</span></div>
      <div class="test"><span>typecheck</span><span class="ok">PASS</span></div>
    </div>
    <div class="panel">
      <div class="label">Commit</div>
      <div class="diff"><span class="muted">branch</span> feature/auth-verify<br/><span class="muted">message</span> add JWT route guard<br/><span class="muted">status</span> awaiting user approval</div>
    </div>
  </div>
</body>
</html>
`;

const cases = [
  {
    id: "health",
    number: "01",
    icon: Heart,
    title: "Health Context",
    tagline: "Private health workspace",
    context: "Health context becomes a private wiki. Risks surface before action.",
    bgImage: "/usecase-health-new.png",
    privacyTags: ["Local-first", "Consent gate", "Private wiki"],
    privacyColor: "green",
    passcode: "2026",
    hint: "Try the demo key",
    inputItems: [
      { icon: Mic, label: "Doctor voice note" },
      { icon: Camera, label: "Diagnostic photo" },
      { icon: FileText, label: "Medication history" },
    ],
    outputHTML: healthOutputHTML,
    glowBg: "from-emerald-500/5 via-teal-500/5 to-transparent",
    accentColor: "group-hover:border-emerald-300 group-hover:shadow-emerald-500/5",
    themeClass: "emerald",
  },
  {
    id: "business",
    number: "02",
    icon: Briefcase,
    title: "Client Alignment",
    tagline: "Shared deal workspace",
    context: "Deal context becomes a permissioned wiki for agents.",
    bgImage: "/usecase-business-new.png",
    privacyTags: ["Encrypted", "Permissioned", "Shared wiki"],
    privacyColor: "blue",
    passcode: "8888",
    hint: "Try the demo key",
    inputItems: [
      { icon: Mic, label: "Client voice memos" },
      { icon: Camera, label: "Whiteboard photo" },
      { icon: FileText, label: "Requirements and chat logs" },
    ],
    outputHTML: businessOutputHTML,
    glowBg: "from-blue-500/5 via-indigo-500/5 to-transparent",
    accentColor: "group-hover:border-blue-300 group-hover:shadow-blue-500/5",
    themeClass: "blue",
  },
  {
    id: "developer",
    number: "03",
    icon: Code,
    title: "Developer context",
    tagline: "Agent-ready code workspace",
    context: "Repo context becomes an agent-ready developer wiki.",
    bgImage: "/usecase-developer-new.png",
    privacyTags: ["Developer context", "Secure sandbox", "Git handoff"],
    privacyColor: "purple",
    passcode: "4321",
    hint: "Try the demo key",
    inputItems: [
      { icon: Mic, label: "Architecture transcript" },
      { icon: FileText, label: "PRD and decisions" },
      { icon: Code, label: "Repo files and logs" },
    ],
    outputHTML: developerOutputHTML,
    glowBg: "from-purple-500/5 via-fuchsia-500/5 to-transparent",
    accentColor: "group-hover:border-purple-300 group-hover:shadow-purple-500/5",
    themeClass: "purple",
  },
];

const featuredRealCases = realUserCases.slice(0, 2);
const additionalRealCases = realUserCases.slice(2);

export default function UseCasesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [realCasesExpanded, setRealCasesExpanded] = useState(false);

  return (
    <section id="user-cases" className="py-24 md:py-32 relative overflow-hidden bg-[#FAFCFF]" ref={ref}>
      {/* Decorative subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#E8EEF7_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center max-w-2xl mx-auto"
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--memova-blue)]">
            Use cases
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--memova-navy)] leading-tight">
            Real notes.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Agent-ready output.</span>
          </h2>
          <p className="mt-4 text-[13px] font-medium text-[#637083] max-w-lg mx-auto leading-relaxed">
            Featured real examples first, then three interactive private-workspace demos.
          </p>
        </motion.div>

        <div className="mb-20">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {featuredRealCases.map((item, index) => (
              <FeaturedRealCase key={item.title} item={item} index={index} isInView={isInView} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.28 }}
            className="mt-7 rounded-3xl border border-[#DDE6FF] bg-white/85 p-4 shadow-sm shadow-[var(--memova-navy)]/[0.04] backdrop-blur-sm md:p-5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--memova-blue)]">
                  More real cases
                </p>
                <h3 className="mt-1 font-display text-lg font-bold text-[var(--memova-navy)]">
                  Browse {additionalRealCases.length} more examples without making the homepage heavy.
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRealCasesExpanded((value) => !value)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#DDE6FF] bg-[#F7FAFF] px-4 text-[12px] font-bold text-[var(--memova-navy)] transition-colors hover:bg-white"
                >
                  {realCasesExpanded ? "Collapse list" : "Show compact list"}
                  <ChevronDown className={`h-4 w-4 text-[var(--memova-blue)] transition-transform ${realCasesExpanded ? "rotate-180" : ""}`} />
                </button>
                <a
                  href="/user-cases"
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--memova-navy)] px-4 text-[12px] font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  Open all use cases
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {realCasesExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-5 grid grid-cols-1 gap-2 overflow-hidden md:grid-cols-2 lg:grid-cols-3"
              >
                {additionalRealCases.map((item) => (
                  <a
                    key={item.title}
                    href={item.demoHref || "/user-cases"}
                    target={item.demoHref ? "_blank" : undefined}
                    rel={item.demoHref ? "noreferrer" : undefined}
                    className="group flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-[#E8EEF7] bg-[#FAFCFF] px-4 py-3 transition-colors hover:border-[#BFD2FF] hover:bg-white"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-bold text-[var(--memova-navy)]">{item.title}</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-[#8C96A8]">{item.category}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-[#A4B0C2] transition-colors group-hover:text-[var(--memova-blue)]" />
                  </a>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Stacked Cases - Optimized with Compact Desktop Multi-Column Layout */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--memova-blue)]">
            Interactive workspace demos
          </p>
          <h3 className="font-display text-2xl font-bold text-[var(--memova-navy)] md:text-3xl">
            Three private workspaces for agents.
          </h3>
        </div>
        <div className="space-y-24">
          {cases.map((c, index) => (
            <CaseCard key={c.id} c={c} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedRealCase({ item, index, isInView }: { item: UserCase; index: number; isInView: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, delay: 0.12 + index * 0.12 }}
      className="overflow-hidden rounded-[1.75rem] border border-[#DDE6FF] bg-white shadow-xl shadow-[var(--memova-navy)]/[0.05]"
    >
      <div className="grid min-h-full grid-cols-1 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="border-b border-[#E8EEF7] bg-gradient-to-br from-[#F8FBFF] via-white to-[#F5F7FF] p-4 lg:border-b-0 lg:border-r">
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C96A8]">
              <NotebookPen className="h-3.5 w-3.5" />
              Source note
            </span>
            <span className="rounded-full border border-[#DDE6FF] bg-white px-2.5 py-1 text-[10px] font-bold text-[var(--memova-blue)]">
              0{index + 1}
            </span>
          </div>
          <img
            src={item.sourceImage}
            alt={`${item.title} source note`}
            className="mx-auto aspect-[886/1848] max-h-[430px] w-auto rounded-2xl border border-white bg-[#F4F4FA] object-contain shadow-inner"
            loading="lazy"
          />
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="border-b border-[#E8EEF7] p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#F2F6FF] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--memova-blue)]">
                {item.category}
              </span>
              <span className="text-[11px] font-semibold text-[#8C96A8]">{item.person}</span>
            </div>
            <h3 className="mt-3 font-display text-xl font-bold leading-tight text-[var(--memova-navy)] md:text-2xl">
              {item.title}
            </h3>
            <p className="mt-2 text-[13px] font-medium leading-6 text-[#637083]">{item.description}</p>
          </div>

          <a
            href={item.demoHref || "/user-cases"}
            target="_blank"
            rel="noreferrer"
            className="group relative block min-h-[300px] flex-1 overflow-hidden bg-[#F6F9FF]"
            aria-label={`Open ${item.title}`}
          >
            <img
              src={item.image || item.sourceImage}
              alt={`${item.title} preview`}
              className="h-full min-h-[300px] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--memova-navy)]/85 to-transparent p-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[12px] font-bold text-[var(--memova-navy)] shadow-lg">
                <Sparkles className="h-4 w-4 text-[var(--memova-blue)]" />
                Open interactive case
                <ExternalLink className="h-4 w-4 text-[var(--memova-blue)]" />
              </div>
            </div>
          </a>
        </div>
      </div>
    </motion.article>
  );
}

interface CaseCardProps {
  c: any;
  index: number;
}

function CaseCard({ c, index }: CaseCardProps) {
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { once: true, margin: "-100px" });

  const [passcodeInput, setPasscodeInput] = useState("");
  const [decryptionState, setDecryptionState] = useState<"locked" | "scanning" | "unlocked">("locked");
  const [isShaking, setIsShaking] = useState(false);

  const unlockVault = () => {
    setDecryptionState("scanning");
    setTimeout(() => {
      setDecryptionState("unlocked");
      toast.success(`${c.title} unlocked. Output rendered locally.`);
    }, 1650);
  };

  const handleDecrypt = (overrideCode?: string) => {
    const code = (overrideCode ?? passcodeInput).trim();
    if (code === c.passcode) {
      setPasscodeInput(code);
      unlockVault();
    } else {
      setIsShaking(true);
      toast.error("Passcode does not match.");
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleUseDemoKey = () => {
    setPasscodeInput(c.passcode);
    setTimeout(() => handleDecrypt(c.passcode), 120);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDecrypt();
    }
  };

  const handleResetLock = () => {
    setDecryptionState("locked");
    setPasscodeInput("");
    toast.info(`${c.title} locked again.`);
  };

  const getPrivacyBadgeStyles = (color: string) => {
    switch (color) {
      case "green":
        return "border-emerald-200 bg-[#EFFBF5] text-[#148A52]";
      case "purple":
        return "border-purple-200 bg-[#FAF5FF] text-[#6B46C1]";
      default:
        return "border-[#DDE6FF] bg-[#F2F6FF] text-[var(--memova-blue)]";
    }
  };

  const getButtonBg = (theme: string) => {
    switch (theme) {
      case "emerald":
        return "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10";
      case "purple":
        return "bg-purple-600 hover:bg-purple-700 shadow-purple-500/10";
      default:
        return "bg-blue-600 hover:bg-blue-700 shadow-blue-500/10";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isCardInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="border-b border-[#E8EEF7] pb-20 last:border-0 last:pb-0 relative"
    >
      {/* Subtle background glow behind each card */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.glowBg} blur-3xl opacity-30 pointer-events-none rounded-[40px]`} />

      {/* 1. Header Bar */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <span className="text-[11px] font-mono font-bold text-[var(--memova-blue)] tracking-wider">
          CASE {c.number}
        </span>
        <div className="h-[1px] flex-1 bg-[#E8EEF7]" />
        <div className="flex gap-2">
          {c.privacyTags.map((tag: string) => (
            <span
              key={tag}
              className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${getPrivacyBadgeStyles(c.privacyColor)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Text Info (Always on top, concise) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8 relative z-10">
        <div className="lg:col-span-5">
          <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--memova-navy)] flex items-center gap-2.5">
            <c.icon className="h-5.5 w-5.5 text-[var(--memova-blue)]" />
            {c.title}
          </h3>
          <p className="text-[12px] font-bold text-[#637083] mt-1 leading-tight">{c.tagline}</p>
        </div>
        <div className="lg:col-span-7">
          <p className="text-[11px] font-medium text-[#8C96A8] leading-relaxed">
            {c.context}
          </p>
        </div>
      </div>

      {/* 3. Case content: top scenario image + lower context/output workspace */}
      <div className="relative z-10 space-y-5">
        {/* Top Row: Scenario image, intentionally compact so the full use case remains visible */}
        <motion.div 
          whileHover={{ y: -3, scale: 1.005 }}
          className={`rounded-2xl border border-[#E8EEF7] bg-white p-3 shadow-md overflow-hidden relative group transition-all duration-300 cursor-pointer ${c.accentColor}`}
        >
          <div className="relative mx-auto aspect-[4/3] min-h-[300px] max-h-[560px] w-full max-w-[900px] overflow-hidden rounded-xl bg-[#F6F9FF]">
            <img
              src={c.bgImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-18 blur-lg transition-transform duration-500 group-hover:scale-[1.08]"
            />
            <img
              src={c.bgImage}
              alt={`${c.title} Scenario`}
              className="relative z-[1] h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.015]"
            />
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/30 via-black/0 to-transparent" />
            <div className="absolute bottom-3 left-3 z-10 rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur-sm">
              <span className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white">
                <Sparkles className="h-3 w-3 text-[var(--memova-blue)]" />
                Scenario preview
              </span>
            </div>
            <div className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-white/85 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--memova-navy)] backdrop-blur-sm">
              image layer
            </div>
          </div>
        </motion.div>

        {/* Bottom Row: Context inputs + private HTML output */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
          {/* Left Bottom: Raw Inputs */}
          <motion.div 
            whileHover={{ y: -4 }}
            className={`rounded-2xl border border-[#E8EEF7] bg-white p-4 shadow-md flex flex-col justify-between gap-4 transition-all duration-300 ${c.accentColor}`}
          >
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-[#8C96A8]">
                  Context inputs
                </span>
                <span className="rounded-full border border-[#DDE6FF] bg-[#F2F6FF] px-2 py-0.5 text-[8px] font-bold text-[var(--memova-blue)]">
                  source packet
                </span>
              </div>
              <div className="space-y-2">
                {c.inputItems.map((item: any, itemIndex: number) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={isCardInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.25 + itemIndex * 0.08 }}
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-2.5 rounded-xl border border-[#E8EEF7] bg-[#FAFCFF] p-3 cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-white border border-[#E8EEF7] flex items-center justify-center text-[var(--memova-blue)] shadow-sm shrink-0">
                      <item.icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-[var(--memova-navy)] leading-tight">{item.label}</span>
                      <span className="mt-0.5 block text-[8px] font-medium text-[#8C96A8]">Captured locally · linked to case</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#E8EEF7] bg-[#FAFCFF] p-3">
              <span className="mb-0.5 block text-[8px] font-bold uppercase tracking-widest text-[#148A52]">
                Permission boundary
              </span>
              <p className="text-[9px] font-medium leading-relaxed text-[#637083]">
                Local-first. Sharing needs consent. The output unlocks only after the user approves access.
              </p>
            </div>
          </motion.div>

          {/* Right Bottom: Decrypted Output HTML Sandbox */}
          <motion.div 
            whileHover={{ y: -4 }}
            className={`rounded-2xl border border-[#E8EEF7] bg-white shadow-md flex flex-col min-h-[360px] relative overflow-hidden transition-all duration-300 ${c.accentColor}`}
          >
            {/* Window header */}
            <div className="bg-[#FAFCFF] border-b border-[#E8EEF7] px-4 py-2.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                  <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2 h-2 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-[9px] font-mono text-[#8C96A8] ml-1.5">memova://private_output</span>
              </div>
              <span className="text-[8px] font-bold text-[var(--memova-blue)] bg-[#F2F6FF] px-2 py-0.5 rounded border border-[#DDE6FF] uppercase tracking-wider">
                MEMOVA OUTPUT
              </span>
            </div>

            {/* Sandbox viewport */}
            <div className="flex-1 relative bg-[#FAFCFF] min-h-[310px]">
              <AnimatePresence mode="wait">
                {decryptionState === "unlocked" && (
                  /* 1. Decrypted Real HTML View */
                  <motion.div
                    key="unlocked-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full relative flex flex-col"
                  >
                    <iframe
                      srcDoc={c.outputHTML}
                      title={`${c.title} Decrypted Output`}
                      className="w-full flex-1 border-none bg-transparent"
                    />
                    {/* Reset button inside decrypted view */}
                    <div className="absolute bottom-3 right-3 z-20">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleResetLock}
                        className="px-2.5 py-1 bg-black/75 backdrop-blur-md border border-white/10 hover:bg-black/90 rounded-md text-[8px] font-bold text-white transition-colors flex items-center gap-1 cursor-pointer shadow-md"
                      >
                        <Lock className="w-2.5 h-2.5" />
                        <span>Lock again</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {decryptionState === "scanning" && (
                  /* 2. Natural local unlock sequence */
                  <motion.div
                    key="scanning-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 overflow-hidden p-5"
                  >
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1.65, ease: "easeInOut" }}
                      className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-[var(--memova-blue)]/10 to-transparent skew-x-[-12deg]"
                    />

                    <div className="w-full max-w-[300px] rounded-2xl border border-[#DDE6FF] bg-white shadow-xl p-4 relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative h-10 w-10 rounded-xl bg-[#F2F6FF] border border-[#DDE6FF] flex items-center justify-center text-[var(--memova-blue)] shadow-sm">
                          <Unlock className="h-5 w-5" />
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0.6 }}
                            animate={{ scale: 1.35, opacity: 0 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                            className="absolute inset-0 rounded-xl border border-[var(--memova-blue)]/30"
                          />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-[var(--memova-navy)]">Opening vault</h4>
                          <p className="text-[8.5px] font-mono text-[#8C96A8]">Passcode accepted · rendering output</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {["Verify passcode", "Mount private wiki", "Render agent output"].map((step, i) => (
                          <motion.div
                            key={step}
                            initial={{ opacity: 0.25, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.28 }}
                            className="flex items-center gap-2 text-[9px] font-semibold text-[#637083]"
                          >
                            <span className="h-3.5 w-3.5 rounded-full bg-[#E8F6EF] border border-emerald-200 text-[9px] text-emerald-600 flex items-center justify-center">✓</span>
                            {step}
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-3 h-1.5 rounded-full bg-[#EEF3FA] overflow-hidden">
                        <motion.div
                          initial={{ width: "10%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.55, ease: "easeInOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {decryptionState === "locked" && (
                  /* 3. Conversational encrypted preview and passcode gate */
                  <motion.div
                    key="locked-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#FAFCFF] z-10 overflow-hidden"
                  >
                    <div className="absolute inset-4 rounded-2xl border border-[#E8EEF7] bg-white/80 p-4 opacity-45 blur-[1.5px]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-3 w-28 rounded-full bg-[#DDE6FF]" />
                        <div className="h-3 w-16 rounded-full bg-[#E8F6EF]" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="h-16 rounded-xl bg-[#F2F6FF] border border-[#DDE6FF]" />
                        <div className="h-16 rounded-xl bg-[#F6F8FC] border border-[#E8EEF7]" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 rounded-full bg-[#E8EEF7] w-full" />
                        <div className="h-2 rounded-full bg-[#E8EEF7] w-4/5" />
                        <div className="h-2 rounded-full bg-[#E8EEF7] w-2/3" />
                      </div>
                    </div>

                    <div className="absolute inset-0 backdrop-blur-[2px] bg-white/70 flex items-center justify-center p-4 text-center">
                      <motion.div
                        animate={isShaking ? { x: [-6, 6, -4, 4, -2, 2, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-[315px] rounded-2xl border border-[#DDE6FF] bg-white/95 shadow-xl p-4 flex flex-col items-center"
                      >
                        <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shadow-sm mb-2 ${
                          isShaking ? "border-red-300 text-red-500 bg-red-50" : "border-[#DDE6FF] text-[var(--memova-blue)] bg-[#F2F6FF]"
                        }`}>
                          <Lock className="h-5 w-5" />
                        </div>
                        <div className="space-y-1 mb-3">
                          <h4 className="text-[11px] font-bold text-[var(--memova-navy)]">Private output is ready</h4>
                          <p className="text-[9px] font-medium text-[#637083] leading-relaxed">
                            Unlock local output.
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 w-full mb-3">
                          {["Capture", "Align", "Unlock"].map((label, i) => (
                            <div key={label} className={`rounded-lg border px-2 py-1.5 ${i < 2 ? "border-emerald-200 bg-[#EFFBF5] text-emerald-700" : "border-[#DDE6FF] bg-[#F2F6FF] text-[var(--memova-blue)]"}`}>
                              <div className="text-[7px] font-mono font-bold opacity-70">0{i + 1}</div>
                              <div className="text-[8px] font-bold leading-none mt-0.5">{label}</div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2 w-full">
                          <div className="flex gap-1.5">
                            <input
                              type="password"
                              inputMode="numeric"
                              maxLength={4}
                              placeholder="••••"
                              value={passcodeInput}
                              onChange={e => setPasscodeInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              onKeyDown={handleKeyPress}
                              className={`flex-1 bg-white border rounded-lg px-2.5 py-1.5 text-center text-[11px] font-mono font-bold tracking-widest outline-none transition-all placeholder-[#8C96A8] ${
                                isShaking 
                                  ? "border-red-400 focus:border-red-400 ring-2 ring-red-100" 
                                  : "border-[#DDE6FF] focus:border-[var(--memova-blue)] focus:ring-2 focus:ring-[var(--memova-blue)]/10"
                              }`}
                            />
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleDecrypt()}
                              className={`px-3 text-white text-[9px] font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95 ${getButtonBg(c.themeClass)}`}
                            >
                              Unlock
                            </motion.button>
                          </div>
                          <button
                            type="button"
                            onClick={handleUseDemoKey}
                            className="w-full rounded-md bg-[#F2F6FF] hover:bg-[#EAF1FF] border border-[#DDE6FF] px-2 py-1.5 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <KeyRound className="w-2.5 h-2.5 text-[var(--memova-blue)]" />
                            <span className="text-[8px] font-mono text-[#637083] leading-none">
                              Demo key: {c.passcode}
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
