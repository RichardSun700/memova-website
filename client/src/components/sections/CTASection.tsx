/**
 * CTA / Waitlist Section + Footer
 * Design: Clean, minimal, strong CTA with trust signals
 */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Shield, Lock, Zap } from "lucide-react";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleWaitlist = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          source: "home-ios-early-access",
        }),
      });

      if (!response.ok) {
        throw new Error("waitlist request failed");
      }

      setEmail("");
      setStatus("success");
      setMessage("You're on the iOS early access list.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="waitlist" className="py-24 md:py-32 relative overflow-hidden bg-[#F8FAFF]" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[var(--memova-navy)] leading-tight">
            Start with Memova on iPhone
            <br />
            <span className="text-[var(--memova-blue)]">Your context, ready for agents.</span>
          </h2>

          <motion.form
            onSubmit={handleWaitlist}
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto mt-8 flex max-w-xl flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={status === "loading"}
              placeholder="Work email"
              className="h-12 w-full rounded-full border border-[#DDE6FF] bg-white px-5 text-[13px] font-medium text-[var(--memova-navy)] outline-none transition-all placeholder:text-[#A9B9D8] focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:opacity-70 sm:flex-1"
            />
            <motion.button
              type="submit"
              disabled={status === "loading"}
              whileHover={status === "loading" ? undefined : { scale: 1.03 }}
              whileTap={status === "loading" ? undefined : { scale: 0.97 }}
              className="h-12 w-full rounded-full bg-[var(--memova-navy)] px-8 text-[14px] font-bold text-white shadow-lg shadow-[var(--memova-navy)]/15 transition-all duration-200 disabled:opacity-70 sm:w-auto"
            >
              {status === "loading" ? "Joining..." : "Join iOS Early Access"}
            </motion.button>
          </motion.form>

          <p
            className={`mt-4 min-h-5 text-[12px] font-medium ${
              status === "error" ? "text-[#B45309]" : "text-[#637083]"
            }`}
          >
            {message}
          </p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-4 flex-wrap"
          >
            {[
              { icon: Shield, text: "You choose what to capture" },
              { icon: Lock, text: "Private, exportable memory" },
              { icon: Zap, text: "Review before action" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 text-[11px] font-medium text-[#637083]">
                <Icon className="w-3 h-3 text-[var(--memova-blue)]" />
                {text}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 pt-6 border-t border-[#E8EEF7]"
        >
          <div className="flex items-center justify-center mb-3">
            <img
              src="/memova-logo-transparent.png"
              alt="Memova Logo"
              className="h-10 sm:h-12 w-auto max-w-[140px] object-contain opacity-70 transition-opacity hover:opacity-90"
            />
          </div>
          <div className="mb-3 flex flex-wrap items-center justify-center gap-5">
            <a
              href="/mcp"
              className="text-[11px] font-bold text-[#637083] transition-colors hover:text-[var(--memova-navy)]"
            >
              Plugins & MCP
            </a>
            <a
              href="/research-lab/nvidia-2026-gtc/"
              className="text-[11px] font-bold text-[#637083] transition-colors hover:text-[var(--memova-navy)]"
            >
              Research
            </a>
            <a
              href="mailto:hello@memova.ai"
              className="text-[11px] font-bold text-[#637083] transition-colors hover:text-[var(--memova-navy)]"
            >
              hello@memova.ai
            </a>
            <a
              href="/privacy"
              className="text-[11px] font-bold text-[#637083] transition-colors hover:text-[var(--memova-navy)]"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-[11px] font-bold text-[#637083] transition-colors hover:text-[var(--memova-navy)]"
            >
              Terms
            </a>
          </div>
          <p className="text-[10px] font-medium text-[#A9B9D8]">
            © 2026 Memova. Everyday context, ready for agents.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
