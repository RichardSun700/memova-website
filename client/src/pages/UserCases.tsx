import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import {
  ArrowUpRight,
  ArrowRight,
  CalendarCheck,
  FileCheck2,
  HeartPulse,
  NotebookPen,
  Sparkles,
  Stethoscope,
  UserRoundCheck,
} from "lucide-react";

export type UserCase = {
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

export const cases: UserCase[] = [
  {
    title: "Gift-Style Car Shortlist",
    category: "Sales follow-up",
    person: "Eric + James",
    description:
      "A customer brief becomes a polished interactive gift page that celebrates a new Amazon role while comparing four German car options.",
    source:
      "James just joined Amazon in the Bay Area. Wants a German car, around $5,000 down and roughly $1,000 per month. Make it feel like a gift, not a spreadsheet.",
    sourceImage: "/user-cases/notes/case2.1-source-note.png",
    output:
      "A gift-style web page with an animated ribbon, four vehicle cards, budget context, and shareable recommendations.",
    bullets: ["Personalize the emotion", "Compare four options", "Share a polished web page"],
    demoHref: "/user-cases/demos/amazon_german_car_gift.html",
    image: "/user-cases/thumbs/amazon_german_car_gift.png",
    accent: "amber",
  },
  {
    title: "Daily Allergy Tracker",
    category: "Health follow-up",
    person: "Maya",
    description:
      "Allergist notes, symptoms, triggers, local weather, medication readiness, and trend signals become one daily tracker.",
    source:
      "Skin test result + phone notes: shrimp? new detergent? pollen week. Need refill, work form, follow-up question.",
    sourceImage: "/user-cases/notes/maya_allergy_note.png",
    output:
      "Daily check-ins, severity trends, trigger correlations, medication readiness, and printable reports.",
    bullets: ["Track symptom severity", "Correlate weather triggers", "Export daily report"],
    demoHref: "/user-cases/demos/maya_allergy_action_plan.html",
    image: "/user-cases/thumbs/maya_allergy_action_plan.png",
    accent: "emerald",
  },
  {
    title: "Wedding Venue Shortlist",
    category: "Wedding planning",
    person: "Lina + Emily & Jason",
    description:
      "A planner's venue materials and couple preferences become a polished client-facing shortlist for choosing a San Francisco wedding venue.",
    source:
      "Emily & Jason want a 70-80 guest San Francisco wedding with a $90K-$130K budget, museum-inspired style, and a one-day venue tour plan.",
    sourceImage: "/user-cases/notes/wedding_venue_shortlist_note.png",
    output:
      "Four venue cards, comparison context, fit notes, trade-offs, and a one-day tour plan packaged as an elegant proposal page.",
    bullets: ["Shortlist four venues", "Compare fit and trade-offs", "Plan the venue tour"],
    demoHref: "/user-cases/demos/wedding_venue_shortlist.html",
    image: "/user-cases/thumbs/wedding_venue_shortlist.jpg",
    accent: "rose",
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
    title: "Eye Watch Plan",
    category: "Long-cycle health",
    person: "Alex",
    description:
      "A high eye-pressure scare, OCT results, doctor instructions, and anxious personal notes become a six-month observation tracker.",
    source:
      "Eye pressure was high. Existing floaters. Doctor says no diagnosis now, recheck IOP / fundus / OCT in six months.",
    sourceImage: "/user-cases/notes/eye_watch_plan_note.png",
    output:
      "Review countdown, appointment reminders, symptom log, red-flag list, and next-visit questions.",
    bullets: ["Track uncertainty without panic", "Know red-flag symptoms", "Prepare next appointment"],
    demoHref: "/user-cases/demos/eye_watch_plan.html",
    image: "/user-cases/thumbs/eye_watch_plan.png",
    accent: "blue",
  },
  {
    title: "90-Day A1C Lifestyle Experiment",
    category: "Health experiment",
    person: "Mia",
    description:
      "A borderline A1C visit becomes a calm 90-day experiment across food, walking, sleep, weight, and recheck timing.",
    source:
      "Doctor visit notes: A1C 6.1, pre-diabetes range, less sugar, no soda, walk after meals, track food spikes.",
    sourceImage: "/user-cases/notes/a1c_lifestyle_note.png",
    output:
      "Daily targets, food-spike notes, high-risk habit flags, weekly review, and recheck preparation.",
    bullets: ["Make habits measurable", "Notice food spikes", "Prepare the recheck"],
    demoHref: "/user-cases/demos/a1c_lifestyle_experiment.html",
    image: "/user-cases/thumbs/a1c_lifestyle_experiment.png",
    accent: "sage",
  },
  {
    title: "Gout Flare Recovery Card",
    category: "Flare recovery",
    person: "Ben",
    description:
      "A painful gout flare turns into a daily recovery card for pain, swelling, medication, hydration, triggers, and follow-up.",
    source:
      "Foot swollen, big toe pain, maybe gout flare. Check uric acid, meds with food, more water, avoid trigger foods.",
    sourceImage: "/user-cases/notes/gout_flare_note.png",
    output:
      "Flare snapshot, pain and swelling log, hydration target, medication checklist, trigger watch, and next-visit notes.",
    bullets: ["Track flare severity", "Follow medication basics", "Plan uric acid recheck"],
    demoHref: "/user-cases/demos/gout_flare_recovery_card.html",
    image: "/user-cases/thumbs/gout_flare_recovery_card.png",
    accent: "rose",
  },
  {
    title: "Product Iteration Alignment",
    category: "Product work",
    person: "Richard",
    description:
      "A product sync and dev notes become a requirements board that separates confirmed asks, ready work, and AI uncertainty.",
    source:
      "Manual marks matter. Yellow means new action. Red means AI uncertainty. Keep source context and confirm warnings.",
    sourceImage: "/user-cases/notes/product_iteration_note.png",
    output:
      "AI trust check, requirements queue, source-context review, ambiguity resolver, and ready-for-sprint handoff.",
    bullets: ["Preserve source context", "Separate ready vs uncertain", "Confirm before dev handoff"],
    demoHref: "/user-cases/demos/product_iteration_alignment_dashboard.html",
    image: "/user-cases/thumbs/product_iteration_alignment_dashboard.png",
    accent: "indigo",
  },
  {
    title: "Mentor Follow-up Card",
    category: "Founder follow-up",
    person: "Dan",
    description:
      "A mentor call becomes a focused founder reset: key advice, pricing tests, outreach targets, and a thank-you update.",
    source:
      "Call with Mark Cuban: raise price, sell the maker story, premium tiers, corporate gifts, local media, 30-day follow-up.",
    sourceImage: "/user-cases/notes/mentor_followup_note.png",
    output:
      "Advice highlights, 30-day actions, early signals, outreach lists, and an auto-drafted update back to the mentor.",
    bullets: ["Turn advice into motion", "Track early signals", "Draft warm follow-up"],
    demoHref: "/user-cases/demos/mentor_followup_card.html",
    image: "/user-cases/thumbs/mentor_followup_card.png",
    accent: "copper",
  },
  {
    title: "90-Day Financial Reset Card",
    category: "Financial reset",
    person: "Nelly",
    description:
      "A debt-reset conversation becomes a shared 90-day plan for priorities, behavior changes, and monthly review.",
    source:
      "Ramsey call notes: stop new debt, sell condo, freeze cards, start debt snowball, bare-bones budget, weekly money meeting.",
    sourceImage: "/user-cases/notes/financial_reset_note.png",
    output:
      "Starting snapshot, advice summary, debt snowball order, 90-day actions, behavior tracker, and monthly review.",
    bullets: ["Clarify next debt move", "Track behavior change", "Review together monthly"],
    demoHref: "/user-cases/demos/financial_reset_card.html",
    image: "/user-cases/thumbs/financial_reset_card.png",
    accent: "violet",
  },
  {
    title: "Household Reset Card",
    category: "Shared life",
    person: "Partner A + B",
    description:
      "A tense household conversation becomes a shared card for invisible work, ownership, standards, reminders, and weekly reset.",
    source:
      "Chores fight again. Cooking, trash, dentist, fridge filter, bills, groceries. Define done and who owns each task.",
    sourceImage: "/user-cases/notes/household_reset_note.png",
    output:
      "Task ownership, visible and invisible load, done criteria, reminder planning, and next-week household review.",
    bullets: ["Expose invisible work", "Assign clear ownership", "Review without blame"],
    demoHref: "/user-cases/demos/household_reset_card.html",
    image: "/user-cases/thumbs/household_reset_card.png",
    accent: "olive",
  },
  {
    title: "Weekly Date Night Card",
    category: "Relationship check-in",
    person: "Grace + Clara",
    description:
      "A date-night conversation becomes a gentle shared check-in for appreciation, repair, support, quality time, and next date.",
    source:
      "Dinner drifted into phones, bills, work stress, and small things. Capture appreciation, support needed, repair note, next plan.",
    sourceImage: "/user-cases/notes/date_night_note.png",
    output:
      "Appreciation notes, repair note, quality-time checklist, support needed, next-date planner, and saved ideas.",
    bullets: ["Remember small signals", "Plan quality time", "Make repair concrete"],
    demoHref: "/user-cases/demos/date_night_card.html",
    image: "/user-cases/thumbs/date_night_card.png",
    accent: "plum",
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
  copper: {
    dot: "bg-orange-300",
    panel: "from-orange-50 via-white to-[#F8FAFF]",
    text: "text-orange-700",
  },
  indigo: {
    dot: "bg-indigo-400",
    panel: "from-indigo-50 via-white to-[#F8FAFF]",
    text: "text-indigo-700",
  },
  olive: {
    dot: "bg-lime-500",
    panel: "from-lime-50 via-white to-[#F8FAFF]",
    text: "text-lime-700",
  },
  plum: {
    dot: "bg-fuchsia-400",
    panel: "from-fuchsia-50 via-white to-[#F8FAFF]",
    text: "text-fuchsia-700",
  },
  rose: {
    dot: "bg-rose-400",
    panel: "from-rose-50 via-white to-[#F8FAFF]",
    text: "text-rose-700",
  },
  sage: {
    dot: "bg-green-400",
    panel: "from-green-50 via-white to-[#F8FAFF]",
    text: "text-green-700",
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
    <div className={`w-full min-w-0 overflow-hidden rounded-2xl border border-[#DDE6FF] bg-gradient-to-br ${accent.panel} p-3 shadow-sm lg:max-w-[300px]`}>
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
        className="mx-auto h-auto w-full max-w-[280px] rounded-xl border border-white/80 bg-[#F4F4FA] shadow-inner sm:max-w-full"
      />
    </div>
  );
}

function TransformCue() {
  return (
    <div className="flex min-h-24 items-center justify-center py-1 lg:min-h-[520px]">
      <div className="flex w-full max-w-[250px] flex-row items-center justify-center gap-3 rounded-2xl border border-[#DDE6FF] bg-white/85 px-4 py-3 text-center shadow-sm shadow-[var(--memova-navy)]/[0.04] backdrop-blur-sm lg:flex-col lg:px-3 lg:py-5">
        <span className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--memova-blue)] text-white shadow-lg shadow-[var(--memova-blue)]/25">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--memova-blue)]">
            Memova
          </p>
          <p className="mt-1 text-[12px] font-bold leading-5 text-[var(--memova-navy)]">
            Automatically turns your note into an interactive web app.
          </p>
        </div>
        <ArrowRight className="hidden h-5 w-5 text-[var(--memova-blue)] lg:block" />
      </div>
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
        className="group relative block h-full min-h-[420px] min-w-0 overflow-hidden rounded-2xl border border-[#DDE6FF] bg-white shadow-xl shadow-[var(--memova-navy)]/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--memova-navy)]/[0.10] md:min-h-[520px]"
      >
        <div className="relative h-full overflow-hidden bg-[#F6F9FF]">
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
    <article className="min-w-0 overflow-hidden rounded-[28px] border border-[#DDE6FF] bg-white p-5 shadow-xl shadow-[var(--memova-navy)]/[0.04] md:p-7">
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

      <div className="grid min-w-0 items-stretch gap-5 lg:grid-cols-[300px_240px_minmax(0,1fr)]">
        <SourceNote item={item} />
        <TransformCue />
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
