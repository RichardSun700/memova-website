// Adapted from Aceternity UI Timeline's scroll-progress pattern.
// Official source and usage terms: docs/enterprise-ui-component-notices.md.
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, type LucideIcon } from "lucide-react";
import { useReducedMotionPreference } from "./useReducedMotionPreference";

type Stage = {
  title: string;
  name: string;
  text: string;
  output: string;
  icon: LucideIcon;
};

export function WorkflowTimeline({ stages }: { stages: Stage[] }) {
  const container = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 65%", "end 70%"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div className="ent-timeline" ref={container}>
      <div className="ent-timeline-rail" aria-hidden="true">
        <motion.div style={{ scaleY: reducedMotion ? 1 : scale }} />
      </div>
      {stages.map((stage, i) => (
        <article className="ent-timeline-step" key={stage.title}>
          <div className="ent-timeline-label">
            <span className="ent-timeline-dot">
              <stage.icon size={18} />
            </span>
            <span>0{i + 1}</span>
            <h3>{stage.title}</h3>
          </div>
          <div className="ent-timeline-copy">
            <h4>{stage.name}</h4>
            <p>{stage.text}</p>
            <span className="ent-deliverable">
              <Check size={15} />
              {stage.output}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
