/**
 * Social Proof Section - Granola-inspired social feedback cards for Memova
 * Design: editorial heading, realistic account-style cards, avatars and social metadata.
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, MessageSquare, Repeat2, ShieldCheck, Sparkles, UserRoundCheck, ExternalLink } from "lucide-react";

export default function SocialProofSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      name: "Maya Lin",
      role: "Product lead",
      handle: "@mayalin_pm",
      avatar: "https://i.pravatar.cc/160?img=47",
      quote: "Memova is the first place where my meeting notes, screenshots and project decisions feel like one usable memory instead of scattered fragments.",
      tag: "Private wiki",
      time: "9:18 AM · May 21, 2026",
      likes: "1.8K",
      replies: "42",
      accent: "from-blue-500 to-indigo-500",
    },
    {
      name: "Ethan Park",
      role: "Founder / engineer",
      handle: "@ethanbuilds",
      avatar: "https://i.pravatar.cc/160?img=12",
      quote: "The approval gate is the part that clicked for me. Agents can prepare the work, but nothing runs until I explicitly send it forward.",
      tag: "Approval gate",
      time: "4:06 PM · May 24, 2026",
      likes: "926",
      replies: "28",
      accent: "from-indigo-500 to-purple-500",
    },
    {
      name: "Nora Patel",
      role: "Healthcare operator",
      handle: "@norapatel_ops",
      avatar: "https://i.pravatar.cc/160?img=32",
      quote: "I can capture sensitive context without feeling like I am handing the whole thing to a random cloud workspace.",
      tag: "Local-first",
      time: "12:44 PM · May 18, 2026",
      likes: "712",
      replies: "19",
      accent: "from-emerald-500 to-teal-500",
    },
    {
      name: "Leo Martinez",
      role: "Design strategist",
      handle: "@leomdesign",
      avatar: "https://i.pravatar.cc/160?img=53",
      quote: "It feels less like a notes app and more like a consent layer between my messy thinking and the agents I actually want to use.",
      tag: "Agent-ready",
      time: "8:02 AM · May 26, 2026",
      likes: "1.1K",
      replies: "31",
      accent: "from-fuchsia-500 to-purple-500",
    },
    {
      name: "Iris Chen",
      role: "Program manager",
      handle: "@irischen_pm",
      avatar: "https://i.pravatar.cc/160?img=25",
      quote: "I stopped rewriting context before every handoff. Memova already knows the project, the owner, the source and the constraint.",
      tag: "Context handoff",
      time: "3:35 PM · May 27, 2026",
      likes: "643",
      replies: "16",
      accent: "from-sky-500 to-blue-500",
    },
    {
      name: "Sam Rivera",
      role: "AI workflow builder",
      handle: "@samxagents",
      avatar: "https://i.pravatar.cc/160?img=68",
      quote: "Most agent tools start at execution. Memova starts earlier: capture, align, approve, then run. That sequence matters.",
      tag: "Workflow loop",
      time: "10:11 AM · May 28, 2026",
      likes: "887",
      replies: "24",
      accent: "from-violet-500 to-indigo-500",
    },
    {
      name: "Clara Weiss",
      role: "Research lead",
      handle: "@clara_research",
      avatar: "https://i.pravatar.cc/160?img=45",
      quote: "The source links are what make the private KB trustworthy. I can trace a recommendation back to the original note or file.",
      tag: "Trace sources",
      time: "2:23 PM · May 19, 2026",
      likes: "534",
      replies: "12",
      accent: "from-amber-500 to-orange-500",
    },
    {
      name: "Owen Brooks",
      role: "Client team lead",
      handle: "@owenbrooks",
      avatar: "https://i.pravatar.cc/160?img=14",
      quote: "Client alignment finally feels permissioned. The workspace can prepare next steps, but sharing remains a human decision.",
      tag: "Permissioned",
      time: "5:47 PM · May 22, 2026",
      likes: "1.3K",
      replies: "37",
      accent: "from-rose-500 to-pink-500",
    },
    {
      name: "Rina Kato",
      role: "Developer experience",
      handle: "@rinakato_dev",
      avatar: "https://i.pravatar.cc/160?img=60",
      quote: "Sending a reviewed plan to Codex with the right context beats pasting a huge prompt and hoping the agent guesses correctly.",
      tag: "Codex handoff",
      time: "11:29 AM · May 29, 2026",
      likes: "759",
      replies: "22",
      accent: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-slate-100 bg-[#FBFCFF] py-24" ref={ref} id="testimonials">
      <div className="pointer-events-none absolute left-10 top-1/4 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-10 h-80 w-80 rounded-full bg-purple-50 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#EEF2FF_1px,transparent_1px),linear-gradient(to_bottom,#EEF2FF_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-25 [mask-image:radial-gradient(ellipse_55%_45%_at_50%_45%,#000_35%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DDE6FF] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--memova-blue)] shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Built for agent-era context
          </p>
          <h2 className="font-serif text-3xl font-normal leading-tight text-[var(--memova-navy)] md:text-4xl lg:text-5xl">
            People are using Memova
            <br />
            <span className="font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              before they hand work to agents.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[13px] font-medium leading-6 text-[#637083]">
            Lightweight social proof for a workflow that starts with private context, pauses at approval, and only then hands work to agents.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.handle}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.08 + index * 0.06, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`group flex min-h-[235px] flex-col justify-between rounded-[1.35rem] border border-slate-200/70 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/[0.05] ${
                index === 0 || index === 5 ? "lg:row-span-2 lg:min-h-[320px]" : ""
              }`}
            >
              <div>
                <div className="mb-4 flex items-start gap-3">
                  <div className={`relative h-11 w-11 shrink-0 rounded-full bg-gradient-to-br ${item.accent} p-[2px] shadow-md shadow-slate-900/10`}>
                    <img
                      src={item.avatar}
                      alt={`${item.name} avatar`}
                      className="h-full w-full rounded-full border-2 border-white object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="truncate text-xs font-bold text-slate-900">{item.name}</h4>
                      <UserRoundCheck className="h-3.5 w-3.5 shrink-0 text-blue-500 fill-blue-500/10" />
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[10px] font-semibold text-slate-500">{item.handle}</span>
                      <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                      <span className="text-[10px] font-medium text-slate-400">{item.role}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-1.5 transition-colors group-hover:border-indigo-100 group-hover:bg-indigo-50">
                    <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                  </div>
                </div>

                <p className="text-[13px] font-medium leading-6 text-slate-700">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 space-y-3 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[#DDE6FF] bg-[#F6F9FF] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--memova-blue)]">
                    {item.tag}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">{item.time}</span>
                </div>
                <div className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1 transition-colors group-hover:text-rose-500">
                    <Heart className="h-3.5 w-3.5" /> {item.likes}
                  </span>
                  <span className="flex items-center gap-1 transition-colors group-hover:text-indigo-500">
                    <MessageSquare className="h-3.5 w-3.5" /> {item.replies}
                  </span>
                  <span className="flex items-center gap-1 transition-colors group-hover:text-indigo-500">
                    <Repeat2 className="h-3.5 w-3.5" /> Repost
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mx-auto mt-12 flex max-w-2xl items-center justify-center gap-2 rounded-full border border-slate-200/70 bg-white px-5 py-3 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 shadow-sm"
        >
          <ShieldCheck className="h-4 w-4 text-[var(--memova-blue)]" />
          local-first · consent-first · agent-ready
        </motion.div>
      </div>
    </section>
  );
}
