import MarketingPage from "@/components/marketing/MarketingPage";

export type UseCaseDetail = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  context: string;
  memory: string;
  outcome: string;
};

export const useCaseDetails: UseCaseDetail[] = [
  {
    slug: "meeting-to-follow-up",
    eyebrow: "Meeting workflow",
    title: "Meeting notes become decisions and follow-ups.",
    intro: "Preserve the context behind a meeting, not just a transcript, so agents can prepare the right follow-up work.",
    context: "A product meeting includes decisions, owners, dates, uncertainty, and side comments that are easy to lose in a flat summary.",
    memory: "Memova links the decision, responsible person, deadline, supporting source, and unresolved question as reusable context.",
    outcome: "A reviewable follow-up email, owner checklist, decision log, and next-meeting brief are prepared from the same memory.",
  },
  {
    slug: "idea-to-product-brief",
    eyebrow: "Founder workflow",
    title: "A founder idea becomes a product brief and tasks.",
    intro: "Capture the idea while it is fresh, then preserve the reasoning and constraints an agent needs to turn it into useful work.",
    context: "A voice note mixes the customer problem, a possible feature, a launch constraint, and questions that still need evidence.",
    memory: "Memova separates hypotheses from decisions and connects the idea to the relevant user, project, constraint, and prior discussion.",
    outcome: "A concise product brief, research questions, acceptance criteria, and a task proposal are prepared for the founder to edit.",
  },
  {
    slug: "conversation-to-action-plan",
    eyebrow: "Personal workflow",
    title: "An important conversation becomes a calm action plan.",
    intro: "Remember commitments and timing without reducing a meaningful conversation to a generic task list.",
    context: "An important conversation contains commitments, concerns, emotional context, dates, and small signals that matter later.",
    memory: "Memova preserves who committed to what, the source context, timing, sensitivities, and what should not be shared automatically.",
    outcome: "A private action plan, reminder schedule, follow-up draft, and next-conversation brief are prepared for review.",
  },
];

export function UseCaseDetailPage({ slug }: { slug: string }) {
  const detail = useCaseDetails.find((candidate) => candidate.slug === slug);

  if (!detail) {
    return (
      <main className="min-h-screen bg-[var(--memova-light)] px-6 py-24 text-center text-[var(--memova-navy)]">
        <h1 className="font-serif text-5xl">Use case not found.</h1>
        <a className="mt-6 inline-block underline" href="/user-cases">Browse Memova use cases</a>
      </main>
    );
  }

  const stages = [
    ["Everyday context", detail.context],
    ["Agent memory", detail.memory],
    ["Workflow outcome", detail.outcome],
    ["Review and approve", "The user inspects the sources, edits the remembered context, and approves consequential communication or execution."],
  ];

  return (
    <MarketingPage eyebrow={detail.eyebrow} title={detail.title} intro={detail.intro}>
      <section className="grid gap-5 md:grid-cols-2">
        {stages.map(([title, body], index) => (
          <article key={title} className="rounded-3xl border border-[#DDE6FF] bg-white p-7 shadow-sm">
            <span className="text-[11px] font-bold text-[var(--memova-blue)]">0{index + 1}</span>
            <h2 className="mt-3 font-display text-xl font-bold">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#637083]">{body}</p>
          </article>
        ))}
      </section>
    </MarketingPage>
  );
}

export default UseCaseDetailPage;
