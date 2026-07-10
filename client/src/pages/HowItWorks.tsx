import MarketingPage from "@/components/marketing/MarketingPage";

const steps = [
  ["Capture", "Add the note, conversation, image, file, or thought you choose to preserve."],
  ["Structure", "Identify people, projects, decisions, commitments, constraints, sources, and open questions."],
  ["Remember", "Keep the useful context in private, editable, agent-readable memory."],
  ["Prepare", "Create the relevant follow-up, brief, plan, reminder, or agent workflow."],
  ["Approve", "Review consequential actions and correct the memory before anything important happens."],
];

export default function HowItWorks() {
  return (
    <MarketingPage
      eyebrow="How Memova works"
      title="From everyday context to useful workflows."
      intro="Memova reduces the work between capturing something important and giving an agent enough trustworthy context to help with the next step."
    >
      <section className="grid gap-4">
        {steps.map(([title, body], index) => (
          <article key={title} className="grid gap-4 rounded-2xl border border-[#DDE6FF] bg-white p-6 md:grid-cols-[72px_180px_1fr] md:items-center">
            <span className="text-[11px] font-bold text-[var(--memova-blue)]">0{index + 1}</span>
            <h2 className="font-display text-xl font-bold">{title}</h2>
            <p className="text-sm leading-7 text-[#637083]">{body}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-[#DDE6FF] bg-white p-7 md:p-10">
        <h2 className="font-serif text-3xl">The goal is continuity, not automation for its own sake.</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#637083]">
          Memova helps an agent continue from the context you already created in daily life. Sources stay traceable, memory stays correctable, and consequential execution stays human-led.
        </p>
      </section>
    </MarketingPage>
  );
}
