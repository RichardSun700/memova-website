/**
 * App download section and footer
 * Design: Clean, minimal, strong CTA with trust signals
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Lock, Zap } from "lucide-react";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section
      id="waitlist"
      aria-labelledby="app-download-heading"
      className="memova-site-cta scroll-mt-20 py-24 md:py-32 relative overflow-hidden bg-[#F8FAFF]"
      ref={ref}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="memova-cta-card"
        >
          <h2
            id="app-download-heading"
            className="memova-section-heading scroll-mt-28 font-display text-3xl md:text-5xl font-bold text-[var(--memova-navy)] leading-tight"
          >
            Start with Memova on iPhone
            <br />
            <span className="memova-gradient-text text-[var(--memova-blue)]">
              Your context, ready for agents.
            </span>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex justify-center"
          >
            <a
              href="https://apps.apple.com/us/app/memova-ai/id6796284954"
              target="_blank"
              rel="noopener noreferrer"
              className="memova-download-button"
              aria-label="Download Memova AI on the App Store"
            >
              Download the app
            </a>
          </motion.div>
          <p className="mt-4 text-sm text-[#637083]">Available for iPhone.</p>

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
              <span
                key={text}
                className="flex items-center gap-1.5 text-[11px] font-medium text-[#637083]"
              >
                <Icon className="w-3 h-3 text-[var(--memova-blue)]" />
                {text}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="memova-marketing-footer mt-20 pt-6 border-t border-[#E8EEF7]"
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
        </motion.footer>
      </div>
    </section>
  );
}
