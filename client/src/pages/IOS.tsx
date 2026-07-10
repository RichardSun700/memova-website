import MarketingPage from "@/components/marketing/MarketingPage";

const capabilities = [
  {
    title: "Capture naturally",
    body: "Start with a note, voice thought, meeting, photo, or file. Capture first instead of stopping to design folders and prompts.",
  },
  {
    title: "Build agent memory",
    body: "Memova structures the people, projects, decisions, commitments, sources, and open questions that should remain useful later.",
  },
  {
    title: "Prepare useful workflows",
    body: "Turn remembered context into follow-ups, briefs, reminders, plans, and agent-ready work that you can inspect before acting.",
  },
];

export default function IOS() {
  return (
    <MarketingPage
      eyebrow="iOS early access"
      title="Memova for iPhone"
      intro="Your everyday context, ready for agents. Capture naturally, build private agent memory, and prepare useful workflows without organizing everything first."
    >
      <section className="grid gap-5 md:grid-cols-3">
        {capabilities.map((capability, index) => (
          <article key={capability.title} className="rounded-3xl border border-[#DDE6FF] bg-white p-6 shadow-sm">
            <span className="text-[11px] font-bold text-[var(--memova-blue)]">0{index + 1}</span>
            <h2 className="mt-3 font-display text-xl font-bold">{capability.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#637083]">{capability.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-7 rounded-[28px] border border-[#DDE6FF] bg-white p-7 md:grid-cols-2 md:p-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--memova-blue)]">Designed around control</p>
          <h2 className="mt-3 font-serif text-3xl">Memory should remain yours.</h2>
        </div>
        <ul className="space-y-3 text-sm leading-7 text-[#637083]">
          <li>Private, exportable, agent-readable memory.</li>
          <li>Source-grounded context you can inspect and correct.</li>
          <li>Human approval before consequential communication or execution.</li>
        </ul>
      </section>
    </MarketingPage>
  );
}
