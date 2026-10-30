import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "@phosphor-icons/react";

// Original opening: orbit first, gather and fade to both sides on scroll, then rest.
export function StoryOrbit({
  stories,
  lang,
  onOpen,
  frozen,
  transitionRef,
  geometryRef,
}) {
  const field = useRef(null),
    elapsed = useRef(0);
  const [paused, setPaused] = useState(false),
    [hovered, setHovered] = useState(false),
    [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true),
    [documentVisible, setDocumentVisible] = useState(true),
    [reduced, setReduced] = useState(false);
  const L = (zh, en) => (lang === "zh" ? zh : en);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion:reduce)");
    const prefs = () => setReduced(motion.matches),
      doc = () => setDocumentVisible(!document.hidden);
    prefs();
    doc();
    motion.addEventListener("change", prefs);
    document.addEventListener("visibilitychange", doc);
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(field.current);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", prefs);
      document.removeEventListener("visibilitychange", doc);
    };
  }, []);
  useEffect(() => {
    const node = field.current,
      items = [...node.children];
    let width = node.clientWidth,
      height = node.clientHeight,
      frame = null,
      previous = 0;
    const stopped =
      paused ||
      hovered ||
      focused ||
      frozen ||
      reduced ||
      !visible ||
      !documentVisible;
    const compact = () => width < 850 || matchMedia("(max-width:1000px) and (max-height:500px)").matches;
    const paint = () => {
      const narrow = compact(),
        gather = narrow ? 0 : transitionRef?.current?.gather || 0;
      const rx = Math.max(0, width / 2 - (width < 1150 ? 82 : 104)),
        ry = height / 2 - (height < 760 ? 95 : 105);
      const angles = items.map(
        (_, i) =>
          -Math.PI / 2 +
          (i * Math.PI * 2) / items.length +
          (elapsed.current / 160000) * Math.PI * 2,
      );
      const lanes = [-1, 1].map((side) =>
        angles
          .map((angle, i) => ({ angle, i }))
          .filter((p) => (Math.cos(p.angle) >= 0 ? 1 : -1) === side)
          .sort((a, b) => Math.sin(a.angle) - Math.sin(b.angle)),
      );
      const positions = items.map((item, i) => {
        const angle = angles[i],
          side = Math.cos(angle) >= 0 ? 1 : -1,
          lane = lanes[side === -1 ? 0 : 1],
          index = lane.findIndex((p) => p.i === i);
        const orbitX = width / 2 + rx * Math.cos(angle),
          orbitY = height / 2 - 20 + ry * Math.sin(angle);
        const edgeX = width / 2 + side * rx * 0.86,
          edgeY =
            height * (0.14 + (0.7 * index) / Math.max(1, lane.length - 1));
        const x = orbitX + (edgeX - orbitX) * gather,
          y = orbitY + (edgeY - orbitY) * gather;
        item.style.transform = narrow
          ? ""
          : `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${1 - gather * 0.24})`;
        item.style.opacity = narrow ? "" : 1 - gather * 0.85;
        item.dataset.edge = x < width / 2 ? "left" : "right";
        const scale = 1 - gather * 0.24;
        return {
          x,
          y,
          width: item.clientWidth * scale,
          height: ((item.clientWidth * 2) / 3) * scale,
        };
      });
      if (geometryRef) geometryRef.current = positions;
      node.dataset.gathering = gather > 0.05 ? "true" : "false";
      node.inert = gather > 0.65;
      node.dataset.ready = "true";
    };
    const tick = (time) => {
      frame = null;
      const gather = transitionRef?.current?.gather || 0;
      if (previous && gather < 0.01)
        elapsed.current += Math.min(time - previous, 50);
      previous = time;
      paint();
      if (!stopped && !compact() && gather < 0.999)
        frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      paint();
      const gather = transitionRef?.current?.gather || 0;
      if (!stopped && !compact() && gather < 0.999 && frame === null) {
        previous = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const resize = new ResizeObserver(() => {
      width = node.clientWidth;
      height = node.clientHeight;
      sync();
    });
    resize.observe(node);
    window.addEventListener("memova:opening-progress", sync);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("memova:opening-progress", sync);
    };
  }, [
    stories,
    transitionRef,
    geometryRef,
    paused,
    hovered,
    focused,
    frozen,
    reduced,
    visible,
    documentVisible,
  ]);
  return (
    <>
      <ul
        ref={field}
        className="story-orbit"
        aria-label={L("探索九个 My Day 故事", "Explore nine My Day stories")}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
        }}
      >
        {stories.map((story, i) => (
          <li className="orbit-item" key={story.id}>
            <a
              className="orbit-story"
              href={story.page}
              aria-label={L(
                "阅读 My Day：" + story.titleZh,
                "Read My Day: " + story.titleEn,
              )}
              style={{ "--tilt": `${[-3, 2, -2, 3, -1, 2, -3, 2, -1][i]}deg` }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                onOpen(story.id);
              }}
            >
              <span className="orbit-image">
                <img
                  src={story.image}
                  alt=""
                  width="1536"
                  height="1024"
                  fetchPriority={i < 3 ? "high" : "auto"}
                />
                <span className="orbit-open">
                  <ArrowUpRight size={19} />
                </span>
              </span>
              <span className="orbit-caption">
                <span>{L(story.titleZh, story.titleEn)}</span>
                <span className="orbit-caption-arrow">
                  <ArrowUpRight size={13} />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <button
        className="orbit-motion"
        aria-pressed={paused || reduced}
        aria-label={L(
          paused ? "继续旋转故事图片" : "暂停旋转故事图片",
          paused ? "Resume story motion" : "Pause story motion",
        )}
        disabled={reduced}
        onClick={() => setPaused(!paused)}
      >
        {paused || reduced ? (
          <Play size={12} weight="fill" />
        ) : (
          <Pause size={12} weight="fill" />
        )}
        <span>
          {reduced
            ? L("静态浏览", "Still view")
            : paused
              ? L("继续旋转", "Resume motion")
              : L("暂停旋转", "Pause motion")}
        </span>
      </button>
    </>
  );
}
