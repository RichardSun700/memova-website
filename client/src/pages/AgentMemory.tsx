import MarketingPage from "@/components/marketing/MarketingPage";

export default function AgentMemory() {
  return (
    <MarketingPage
      eyebrow="Memova definition"
      title="Agent memory is context an agent can use responsibly."
      intro="It is more than chat history. Agent memory preserves what matters about people, projects, decisions, commitments, preferences, and sources so useful work can continue across sessions."
    >
      <section className="rounded-[28px] border border-[#DDE6FF] bg-white p-7 shadow-sm md:p-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--memova-blue)]">Practical definition</p>
        <blockquote className="mt-4 max-w-4xl font-serif text-2xl leading-relaxed md:text-4xl">
          Agent memory is durable, editable, source-grounded context that helps an agent understand what happened, what matters, and what should happen next.
        </blockquote>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          ["Durable", "Useful context survives beyond one chat or model session."],
          ["Correctable", "People can inspect, edit, remove, and clarify what the system remembers."],
          ["Actionable", "Memory prepares relevant workflows without silently taking control."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-3xl border border-[#DDE6FF] bg-white p-6">
            <h2 className="font-display text-xl font-bold">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#637083]">{body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-[#E8EEF7] bg-[#FAFCFF] p-7">
          <h2 className="font-display text-2xl font-bold">Chat history</h2>
          <p className="mt-4 text-sm leading-7 text-[#637083]">A chronological record of messages, often tied to one conversation and difficult to reuse safely.</p>
        </article>
        <article className="rounded-3xl border border-[var(--memova-blue)]/30 bg-white p-7 shadow-sm">
          <h2 className="font-display text-2xl font-bold">Agent memory</h2>
          <p className="mt-4 text-sm leading-7 text-[#637083]">Structured context with sources, relationships, ownership, timing, corrections, and approval boundaries.</p>
        </article>
      </section>
    </MarketingPage>
  );
}
