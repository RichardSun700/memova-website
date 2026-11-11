// Adapted from Magic UI Animated Beam. Copyright (c) Magic UI, MIT.
// Upstream and license: docs/enterprise-ui-component-notices.md.
import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { useReducedMotionPreference } from "./useReducedMotionPreference";

type BeamProps = {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  delay?: number;
  paused?: boolean;
};

type Bounds = Pick<DOMRect, "left" | "top" | "width" | "height">;

export function createBeamPath(box: Bounds, start: Bounds, end: Bounds) {
  const toRight = end.left >= start.left + start.width;
  const toLeft = start.left >= end.left + end.width;
  if (toRight || toLeft) {
    const x1 = start.left - box.left + (toRight ? start.width : 0);
    const y1 = start.top - box.top + start.height / 2;
    const x2 = end.left - box.left + (toRight ? 0 : end.width);
    const y2 = end.top - box.top + end.height / 2;
    return `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;
  }
  const down = end.top >= start.top;
  const x1 = start.left - box.left + start.width / 2;
  const y1 = start.top - box.top + (down ? start.height : 0);
  const x2 = end.left - box.left + end.width / 2;
  const y2 = end.top - box.top + (down ? 0 : end.height);
  return `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`;
}

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  delay = 0,
  paused = false,
}: BeamProps) {
  const id = useId();
  const reducedMotion = useReducedMotionPreference();
  const [geometry, setGeometry] = useState({
    width: 0,
    height: 0,
    path: "",
    labels: [] as Bounds[],
  });

  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;
      const box = containerRef.current.getBoundingClientRect();
      const start = fromRef.current.getBoundingClientRect();
      const end = toRef.current.getBoundingClientRect();
      const path = createBeamPath(box, start, end);
      const labels = Array.from(
        containerRef.current.querySelectorAll(
          ".ent-flow-policy,.ent-flow-persist"
        )
      ).map(label => {
        const rect = label.getBoundingClientRect();
        return {
          left: rect.left - box.left - 6,
          top: rect.top - box.top - 4,
          width: rect.width + 12,
          height: rect.height + 8,
        };
      });
      setGeometry({ width: box.width, height: box.height, path, labels });
    };
    const observer = new ResizeObserver(updatePath);
    for (const ref of [containerRef, fromRef, toRef]) {
      if (ref.current) observer.observe(ref.current);
    }
    containerRef.current
      ?.querySelectorAll(".ent-flow-policy,.ent-flow-persist")
      .forEach(label => observer.observe(label));
    updatePath();
    return () => observer.disconnect();
  }, [containerRef, fromRef, toRef]);

  if (!geometry.width || !geometry.height) return null;
  return (
    <svg
      className="ent-beam"
      data-running={!paused && !reducedMotion}
      style={{ "--ent-beam-delay": `-${delay}s` } as CSSProperties}
      aria-hidden="true"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      fill="none"
    >
      <defs>
        <mask id={`${id}-labels`}>
          <rect width={geometry.width} height={geometry.height} fill="white" />
          {geometry.labels.map((label, index) => (
            <rect
              key={index}
              x={label.left}
              y={label.top}
              width={label.width}
              height={label.height}
              fill="black"
            />
          ))}
        </mask>
        <linearGradient id={id}>
          <stop stopColor="#a8c8ed" />
          <stop offset="0.5" stopColor="#5d91d9" />
          <stop offset="1" stopColor="#b3d7f8" />
        </linearGradient>
      </defs>
      <g mask={`url(#${id}-labels)`}>
        <path
          d={geometry.path}
          stroke={`url(#${id})`}
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
        <path
          className="ent-beam-trail"
          d={geometry.path}
          pathLength="100"
          strokeDasharray="14 86"
        />
        <path
          className="ent-beam-packets"
          d={geometry.path}
          pathLength="100"
          strokeDasharray="0.8 24.2"
        />
        <path
          className="ent-beam-core"
          d={geometry.path}
          pathLength="100"
          strokeDasharray="1 99"
        />
      </g>
    </svg>
  );
}
