// Adapted from Magic UI Animated Beam. Copyright (c) Magic UI, MIT.
// Upstream and license: docs/enterprise-ui-component-notices.md.
import { useEffect, useId, useState, type RefObject } from "react";
import { motion } from "framer-motion";
import { useReducedMotionPreference } from "./useReducedMotionPreference";

type BeamProps = {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  delay?: number;
  paused?: boolean;
};

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  delay = 0,
  paused = false,
}: BeamProps) {
  const id = useId();
  const reducedMotion = useReducedMotionPreference();
  const [geometry, setGeometry] = useState({ width: 0, height: 0, path: "" });

  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;
      const box = containerRef.current.getBoundingClientRect();
      const start = fromRef.current.getBoundingClientRect();
      const end = toRef.current.getBoundingClientRect();
      const x1 = start.left - box.left + start.width / 2;
      const y1 = start.top - box.top + start.height / 2;
      const x2 = end.left - box.left + end.width / 2;
      const y2 = end.top - box.top + end.height / 2;
      const stacked = Math.abs(y2 - y1) > Math.abs(x2 - x1);
      const path = stacked
        ? `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`
        : `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;
      setGeometry({ width: box.width, height: box.height, path });
    };
    const observer = new ResizeObserver(updatePath);
    for (const ref of [containerRef, fromRef, toRef]) {
      if (ref.current) observer.observe(ref.current);
    }
    updatePath();
    return () => observer.disconnect();
  }, [containerRef, fromRef, toRef]);

  if (!geometry.width || !geometry.height) return null;
  return (
    <svg
      className="ent-beam"
      aria-hidden="true"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      fill="none"
    >
      <path d={geometry.path} stroke="#cbd9ef" strokeWidth="1.5" />
      {!paused && !reducedMotion && (
        <path
          d={geometry.path}
          stroke={`url(#${id})`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {!paused && !reducedMotion && (
        <defs>
          <motion.linearGradient
            id={id}
            gradientUnits="userSpaceOnUse"
            initial={{ x1: "-100%", x2: "0%", y1: "0%", y2: "0%" }}
            animate={
              !paused && !reducedMotion
                ? {
                    x1: ["-100%", "100%"],
                    x2: ["0%", "200%"],
                    y1: ["0%", "100%"],
                    y2: ["0%", "100%"],
                  }
                : {}
            }
            transition={{
              duration: 3.5,
              delay,
              repeat: Infinity,
              repeatDelay: 0.8,
              ease: "linear",
            }}
          >
            <stop stopColor="#586dcc" stopOpacity="0" />
            <stop offset="0.5" stopColor="#6c91de" />
            <stop offset="1" stopColor="#9fb9ed" stopOpacity="0" />
          </motion.linearGradient>
        </defs>
      )}
    </svg>
  );
}
