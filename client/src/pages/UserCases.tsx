import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import {
  ArrowUpRight,
  CalendarCheck,
  FileCheck2,
  HeartPulse,
  NotebookPen,
  Stethoscope,
  UserRoundCheck,
} from "lucide-react";

type UserCase = {
  title: string;
  category: string;
  person: string;
  description: string;
  source: string;
  sourceImage: string;
  output: string;
  bullets: string[];
  demoHref?: string;
  image?: string;
  accent: string;
};

const cases: UserCase[] = [
  {
    title: "Maya Allergy Action Plan",
    category: "Health follow-up",
    person: "Maya",
    description:
      "Allergist notes, test results, suspected triggers, refills, and work forms become one calm action plan.",
    source:
      "Skin test result + phone notes: shrimp? new detergent? pollen week. Need refill, work form, follow-up question.",
    sourceImage: "/user-cases/notes/maya_allergy_note.png",
    output:
      "7-day trigger log, refill checklist, MyChart draft, and next appointment email.",
    bullets: ["Track suspected triggers", "Prepare refill tasks", "Draft doctor follow-up"],
    demoHref: "/user-cases/demos/maya_allergy_action_plan.html",
    image: "/user-cases/thumbs/maya_allergy_action_plan.png",
    accent: "emerald",
  },
  {
    title: "Carlos Post-Visit Follow-up Card",
    category: "Primary care",
    person: "Carlos",
    description:
      "A doctor visit turns into takeaways, a lightweight seven-day monitoring log, and a summary for the next PCP update.",
    source:
      "PCP said: BP + glucose + sleep/mood for a week. Keep it doable. Bring a clearer update next time.",
    sourceImage: "/user-cases/notes/carlos_post_visit_note.png",
    output:
      "3 takeaways, BP/glucose/sleep/mood log, and one-page export for the next visit.",
    bullets: ["Remember visit instructions", "Log daily signals", "Export one-page summary"],
    demoHref: "/user-cases/demos/carlos_post_visit_followup.html",
    image: "/user-cases/thumbs/carlos_post_visit_followup.png",
    accent: "teal",
  },
  {
    title: "Kellogg Coffee Chat Follow-up",
    category: "MBA application",
    person: "Jerry",
    description:
      "A messy alum chat and handwritten application notes become essay edits, reference asks, and a thank-you email.",
    source:
      "Sarah: collaboration = active building. Jerry note: co-founder conflict, 2022 pivot, ask Alex metrics, Priya ambiguity.",
    sourceImage: "/user-cases/notes/kellogg_alum_chat_note.png",
    output:
      "Why Kellogg rewrite, emails to Alex and Priya, research task, and thank-you note to Sarah.",
    bullets: ["Turn chat into essay evidence", "Ask for outside validation", "Send warm follow-up"],
    demoHref: "/user-cases/demos/memova_jerry_kellogg_followup.html",
    image: "/user-cases/thumbs/memova_jerry_kellogg_followup.png",
    accent: "violet",
  },
  {
    title: "CPA Call Follow-up Card",
    category: "Tax prep",
    person: "Lena",
    description:
      "A CPA prep call becomes a document-readiness board, missing-material tasks, and a next-meeting calendar invite.",
    source:
      "Call notes: Etsy + Stripe exports, 1099s, software subscriptions, travel receipts, estimated tax confirmations.",
    sourceImage: "/user-cases/notes/tax_filing_prep_note.png",
    output:
      "Filing checklist, upload tasks, CPA review questions, and final prep meeting invite.",
    bullets: ["Group missing documents", "Separate prep from advice", "Create review agenda"],
    demoHref: "/user-cases/demos/tax_filing_prep_card.html",
    image: "/user-cases/thumbs/tax_filing_prep_card.png",
    accent: "amber",
  },
  {
    title: "6-Month Eye Watch Tracker",
    category: "Long-cycle health",
    person: "Alex",
    description:
      "A high eye-pressure scare, OCT results, doctor instructions, and anxious personal notes become a six-month observation tracker.",
    source:
      "Eye pressure was high. Existing floaters. Doctor says no diagnosis now, recheck IOP / fundus / OCT in six months.",
    sourceImage: "/user-cases/notes/eye_watch_tracker_note.png",
    output:
      "Review countdown, appointment reminders, symptom log, red-flag list, and next-visit questions.",
    bullets: ["Track uncertainty without panic", "Know red-flag symptoms", "Prepare next appointment"],
    demoHref: "/user-cases/demos/eye_watch_tracker.html",
    image: "/user-cases/thumbs/eye_watch_tracker.png",
    accent: "blue",
  },
];

const accentClasses: Record<string, { dot: string; panel: string; text: string }> = {
  amber: {
    dot: "bg-amber-400",
    panel: "from-amber-50 via-white to-[#F8FAFF]",
    text: "text-amber-700",
  },
  blue: {
    dot: "bg-sky-400",
    panel: "from-sky-50 via-white to-[#F8FAFF]",
    text: "text-sky-700",
  },
  emerald: {
    dot: "bg-emerald-400",
    panel: "from-emerald-50 via-white to-[#F8FAFF]",
    text: "text-emerald-700",
  },
  teal: {
    dot: "bg-teal-400",
    panel: "from-teal-50 via-white to-[#F8FAFF]",
    text: "text-teal-700",
  },
  violet: {
    dot: "bg-violet-400",
    panel: "from-violet-50 via-white to-[#F8FAFF]",
    text: "text-violet-700",
  },
};

function CaseIcon({ category }: { category: string }) {
  if (category.includes("Health")) return <HeartPulse className="h-4 w-4" />;
  if (category.includes("Primary")) return <Stethoscope className="h-4 w-4" />;
  if (category.includes("MBA")) return <UserRoundCheck className="h-4 w-4" />;
  if (category.includes("Tax")) return <FileCheck2 className="h-4 w-4" />;
  return <CalendarCheck className="h-4 w-4" />;
}

function SourceNote({ item }: { item: UserCase }) {
  const accent = accentClasses[item.accent];

  return (
    <div className={`overflow-hidden rounded-2xl border border-[#DDE6FF] bg-gradient-to-br ${accent.panel} p-3 shadow-sm`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C96A8]">
          <NotebookPen className="h-3.5 w-3.5" />
          Source note
        </div>
        <span className={`h-2.5 w-2.5 rounded-full ${accent.dot}`} />
      </div>
      <img
        src={item.sourceImage}
        alt={`${item.title} source note`}
        className="aspect-[9/13] w-full rounded-xl border border-white/80 bg-[#F4F4FA] object-cover object-top shadow-inner"
      />
    </div>
  );
}

function OutputPreview({ item }: { item: UserCase }) {
  if (item.demoHref) {
    return (
      <a
        href={item.demoHref}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${item.title} interactive demo`}
        className="group relative block overflow-hidden rounded-2xl border border-[#DDE6FF] bg-white shadow-xl shadow-[var(--memova-navy)]/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--memova-navy)]/[0.10]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[#F6F9FF]">
          <iframe
            src={item.demoHref}
            title={`${item.title} embedded preview`}
            loading="lazy"
            tabIndex={-1}
            className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
            style={{
              width: "166.667%",
              height: "166.667%",
              transform: "scale(0.6)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--memova-navy)]/30 via-transparent to-white/5 opacity-70 transition-opacity duration-300 group-hover:opacity-45" />
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-full border border-white/70 bg-white/90 px-4 py-3 text-[12px] font-bold text-[var(--memova-navy)] shadow-lg shadow-[var(--memova-navy)]/10 backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1">
            <span>Open interactive case</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--memova-navy)] text-white">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#DDE6FF] bg-white shadow-xl shadow-[var(--memova-navy)]/[0.05]">
      {item.image ? (
        <img
          src={item.image}
          alt={`${item.title} demo preview`}
          className="aspect-[16/10] w-full object-cover object-top"
        />
      ) : (
        <div className="aspect-[16/10] bg-[#F6F9FF] p-5">
          <div className="h-full rounded-xl border border-[#DDE6FF] bg-white p-5">
            <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C96A8]">
              Memova output
            </div>
            <h3 className="font-display text-xl font-bold text-[var(--memova-navy)]">
              {item.output}
            </h3>
            <div className="mt-5 space-y-2">
              {item.bullets.map((bullet) => (
                <div key={bullet} className="rounded-lg border border-[#E8EEF7] bg-[#FAFCFF] px-3 py-2 text-[12px] font-semibold text-[#637083]">
                  {bullet}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CaseCard({ item, index }: { item: UserCase; index: number }) {
  const accent = accentClasses[item.accent];

  return (
    <article className="overflow-hidden rounded-[28px] border border-[#DDE6FF] bg-white p-5 shadow-xl shadow-[var(--memova-navy)]/[0.04] md:p-7">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="max-w-2xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#DDE6FF] bg-[#F6F9FF] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8C96A8]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-[#F6F9FF] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${accent.text}`}>
              <CaseIcon category={item.category} />
              {item.category}
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight text-[var(--memova-navy)] md:text-3xl">
            {item.title}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#637083]">
            {item.description}
          </p>
        </div>
        {item.demoHref ? (
          <a
            href={item.demoHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--memova-navy)] px-5 text-[13px] font-bold text-white shadow-lg shadow-[var(--memova-navy)]/10 transition-all hover:-translate-y-0.5 md:w-auto"
          >
            Open demo
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.25fr]">
        <SourceNote item={item} />
        <OutputPreview item={item} />
      </div>

      <div className="mt-5 grid gap-2 md:grid-cols-3">
        {item.bullets.map((bullet) => (
          <div
            key={bullet}
            className="rounded-xl border border-[#E8EEF7] bg-[#FAFCFF] px-3 py-2 text-[12px] font-semibold text-[var(--memova-navy)]"
          >
            {bullet}
          </div>
        ))}
      </div>
    </article>
  );
}

export default function UserCases() {
  return (
    <div className="min-h-screen bg-[var(--memova-light)] text-[var(--memova-navy)]">
      <Navbar />
      <main className="pt-28">
        <section className="relative overflow-hidden px-4 py-16 md:py-24">
          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--memova-blue)]">
                User cases
              </p>
              <h1 className="mx-auto max-w-[18rem] font-serif text-[2.25rem] font-normal leading-[1.12] text-[var(--memova-navy)] sm:max-w-2xl sm:text-5xl md:text-6xl">
                Messy notes become personal workflows.
              </h1>
              <p className="mx-auto mt-5 max-w-[18rem] text-[15px] leading-7 text-[#637083] sm:max-w-2xl sm:text-[16px] sm:leading-8">
                These demos are built from real scenario notes: health follow-ups,
                coffee chats, tax prep, and long-cycle reminders where the important
                next step is easy to lose.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 md:pb-28">
          <div className="mx-auto w-full max-w-7xl space-y-7">
            {cases.map((item, index) => (
              <CaseCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
