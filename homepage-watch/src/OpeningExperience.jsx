import React, { useEffect, useId, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  ArrowCounterClockwise,
  Check,
  Pause,
  Play,
  Hand,
  HandGrabbing,
} from "@phosphor-icons/react";
import { StoryOrbit } from "./StoryOrbit";
import {
  EmotionWatch,
  getWatchSignalGroups,
  WATCH_SIGNAL_ROWS,
} from "./EmotionWatch";
import palettes from "./storyPalettes.json";
import { APP_STORE_URL as STORE } from "./siteLinks";

const clamp = (n) => Math.max(0, Math.min(1, n));
const smooth = (n) => {
  const p = clamp(n);
  return p * p * (3 - 2 * p);
};
const signalGroups = getWatchSignalGroups(palettes);
function FlowField({
  stageRef,
  geometryRef,
  transitionRef,
  unlocked,
  active,
  reduced,
  draggingRef,
  positionRef,
}) {
  const canvas = useRef(null);
  const revealTime = useRef(null);
  useEffect(() => {
    revealTime.current = unlocked ? performance.now() : null;
  }, [unlocked]);
  useEffect(() => {
    const node = canvas.current,
      ctx = node.getContext("2d");
    let frame,
      last = 0,
      width = 0,
      height = 0,
      watchWidth = 238,
      watchHeight = 374;
    const fit = () => {
      width = stageRef.current.clientWidth;
      height = stageRef.current.clientHeight;
      const watch = stageRef.current.querySelector(".emotion-watch");
      watchWidth = watch?.clientWidth || 238;
      watchHeight = watch?.clientHeight || 374;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      node.width = Math.round(width * dpr);
      node.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (now) => {
      ctx.clearRect(0, 0, width, height);
      const gather = transitionRef.current.gather;
      const alpha = smooth((gather - 0.03) / 0.3);
      const points = geometryRef.current;
      if (!points?.length || !alpha) return;
      const phase = reduced ? 0 : now / 1000;
      // Quiet colour motes replace literal wires between scenes and the device.
      // Every story contributes its sampled palette; the only full curves are on the Watch.
      palettes.forEach((palette, index) => {
        const origin = points[index];
        const source = origin && {
          x:
            origin.x +
            (origin.x < width / 2 ? 1 : -1) * (origin.width || 130) * 0.44,
          y: origin.y + ((index % 3) - 1) * (origin.height || 90) * 0.16,
        };
        if (!source) return;
        for (let mote = 0; mote < 3; mote++) {
          const t = reduced
            ? 0.28 + mote * 0.22
            : (phase * 0.105 + index * 0.127 + mote * 0.333) % 1;
          const ease = t * t * (3 - 2 * t),
            side = source.x < width / 2 ? 1 : -1;
          const drift =
            Math.sin(t * Math.PI) * Math.sin(t * 7 + index * 1.7) * 20;
          const x = source.x + (width / 2 - source.x) * ease + drift;
          const y =
            source.y +
            (height * 0.52 - source.y) * ease +
            Math.sin(t * Math.PI) * (index % 2 ? 35 : -35);
          const opacity = Math.sin(t * Math.PI) * alpha * 0.55;
          const radius = 2.2 + Math.sin(t * Math.PI) * 2.3;
          const haze = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
          const sampled = mote % 2 ? palette.secondary : palette.color;
          const color =
            "#" +
            [1, 3, 5]
              .map((i) =>
                Math.round(
                  parseInt(sampled.slice(i, i + 2), 16) * 0.55 + 255 * 0.45,
                )
                  .toString(16)
                  .padStart(2, "0"),
              )
              .join("");
          haze.addColorStop(
            0,
            color +
              Math.round(opacity * 110)
                .toString(16)
                .padStart(2, "0"),
          );
          haze.addColorStop(
            0.28,
            color +
              Math.round(opacity * 48)
                .toString(16)
                .padStart(2, "0"),
          );
          haze.addColorStop(1, color + "00");
          ctx.fillStyle = haze;
          ctx.fillRect(x - radius * 3, y - radius * 3, radius * 6, radius * 6);
          ctx.globalAlpha = opacity * 0.72;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });
      // Gesture-only fragments share their colours and arrival rows with the Watch.
      const sinceReveal =
        revealTime.current === null
          ? Infinity
          : (now - revealTime.current) / 1800;
      const drag = clamp(positionRef.current);
      const trace = reduced
        ? 0
        : unlocked
          ? 1 - smooth(sinceReveal)
          : draggingRef.current
            ? smooth(drag)
            : 0;
      if (trace > 0.001)
        signalGroups.forEach((group, line) => {
          // Voice and Daily Activities enter from the left; Health from the right.
          const side = line === 1 ? 1 : -1;
          const end = {
            // Match the screen's actual Canvas ends (x=31 / 416 in 447px).
            x:
              width / 2 - watchWidth * 0.5 +
              ((59 + (side < 0 ? 31 : 447 - 31)) / 560) * watchWidth,
            y:
              height * 0.52 -
              watchHeight * 0.5 +
              watchHeight * 0.222727 +
              (WATCH_SIGNAL_ROWS[line] / 498) * watchHeight * 0.565909 +
              (parseFloat(
                getComputedStyle(stageRef.current).getPropertyValue(
                  "--assembly-shift",
                ),
              ) || 0),
          };
          const origins = points
            .map((origin, index) => ({
              origin,
              index,
              x: origin.x - side * (origin.width || 130) * 0.44,
            }))
            .filter(({ origin, x }) =>
              (origin.x < width / 2 ? -1 : 1) === side &&
              side * (x - end.x) > 0,
            );
          // Prefer a contributing story on the requested side, then the closest
          // available inward edge. The row's shared gradient is never reassigned.
          const matching = origins.filter(({ index }) =>
            group.some((palette) => palette.id === palettes[index]?.id),
          );
          const anchor = (matching.length ? matching : origins).reduce(
            (closest, candidate) =>
              !closest || Math.abs(candidate.origin.y - end.y) <
                Math.abs(closest.origin.y - end.y)
                ? candidate
                : closest,
            null,
          );
          if (!anchor) return;
          const source = { x: anchor.x, y: anchor.origin.y };
          const p1 = {
            x: source.x + (end.x - source.x) * 0.32,
            y: source.y + (end.y - source.y) * 0.18,
          };
          const p2 = { x: end.x + side * 66, y: end.y - 12 + line * 6 };
          const point = (t) => {
            const a = 1 - t;
            return {
              x:
                a * a * a * source.x +
                3 * a * a * t * p1.x +
                3 * a * t * t * p2.x +
                t * t * t * end.x,
              y:
                a * a * a * source.y +
                3 * a * a * t * p1.y +
                3 * a * t * t * p2.y +
                t * t * t * end.y +
                Math.sin(t * Math.PI) *
                  Math.sin(t * 8 - phase * 0.8 + line) *
                  5,
            };
          };
          const head = unlocked ? 1 : 0.43 + drag * 0.57,
            tail = Math.max(0.02, head - (0.32 + drag * 0.58));
          const start = point(tail),
            stop = point(head);
          const gradient = ctx.createLinearGradient(
            start.x,
            start.y,
            stop.x,
            stop.y,
          );
          // A left entry arrives at the Watch's first colour, a right entry at
          // its last, so the colour at the port agrees with the on-screen row.
          const flowColors = side < 0 ? [...group].reverse() : group;
          gradient.addColorStop(0, flowColors[0].color + "00");
          gradient.addColorStop(0.2, flowColors[0].color + "b0");
          gradient.addColorStop(0.58, group[1].color);
          gradient.addColorStop(0.87, flowColors[2].color);
          gradient.addColorStop(1, flowColors[2].color + "22");
          ctx.save();
          ctx.globalAlpha = trace;
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          ctx.shadowColor = group[1].secondary;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          for (let step = 0; step <= 42; step++) {
            const p = point(tail + ((head - tail) * step) / 42);
            step ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
          }
          ctx.stroke();
          ctx.shadowBlur = 13;
          ctx.fillStyle = group[1].secondary;
          ctx.beginPath();
          ctx.arc(start.x, start.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      // The disappearing panel releases a brief mist around the real hardware.
      const reveal =
        revealTime.current === null ? 2 : (now - revealTime.current) / 1800;
      if (!reduced && reveal >= 0 && reveal < 1) {
        for (let i = 0; i < 108; i++) {
          const angle = i * 2.39996,
            startX = Math.cos(angle) * ((i % 11) * 10),
            startY = Math.sin(angle) * ((i % 7) * 12);
          const speed = 38 + (i % 13) * 9,
            t = 1 - Math.pow(1 - reveal, 2);
          const x = width / 2 + startX + Math.cos(angle) * speed * t,
            y = height * 0.52 + startY + Math.sin(angle) * speed * t - 25 * t;
          const radius = (4 + (i % 5) * 3) * (1 + reveal * 1.7),
            mist = ctx.createRadialGradient(x, y, 0, x, y, radius);
          const color =
            i % 4 === 0
              ? "#f4e7be"
              : i % 3 === 0
                ? palettes[i % 9].secondary
                : "#9eb7df";
          const opacity = Math.round((1 - reveal) * 82)
            .toString(16)
            .padStart(2, "0");
          mist.addColorStop(0, color + opacity);
          mist.addColorStop(1, color + "00");
          ctx.fillStyle = mist;
          ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
          ctx.globalAlpha = Math.sin(reveal * Math.PI) * (1 - reveal) * 0.65;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, 0.9 + (i % 3) * 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    };
    const tick = (now) => {
      if (now - last > 1000 / 30) {
        draw(now);
        last = now;
      }
      frame = requestAnimationFrame(tick);
    };
    fit();
    draw(performance.now());
    const resize = new ResizeObserver(() => {
      fit();
      draw(performance.now());
    });
    resize.observe(stageRef.current);
    const repaint = () => draw(performance.now());
    window.addEventListener("scroll", repaint, { passive: true });
    window.addEventListener("memova:opening-progress", repaint);
    if (active && !reduced) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", repaint);
      window.removeEventListener("memova:opening-progress", repaint);
    };
  }, [active, reduced, unlocked, stageRef, geometryRef, transitionRef]);
  return (
    <canvas className="story-flow-field" ref={canvas} aria-hidden="true" />
  );
}

export function OpeningExperience({
  lang,
  stories,
  onOpen,
  frozen,
  compact = false,
}) {
  const L = (zh, en) => (lang === "zh" ? zh : en);
  const runway = useRef(null),
    stage = useRef(null),
    rail = useRef(null),
    action = useRef(null),
    liveWatch = useRef(null),
    liveWatchKeyboard = useRef(false),
    liveWatchCleanup = useRef(null),
    geometry = useRef([]);
  const transition = useRef({ gather: 0, progress: 0 });
  const dragStart = useRef(0),
    dragStartY = useRef(0),
    pendingTouch = useRef(false),
    unlockedRef = useRef(false);
  const dragging = useRef(false),
    unlockPosition = useRef(0),
    returnFrame = useRef(null);
  const uid = useId().replace(/:/g, "");
  const [progress, setProgress] = useState(0),
    [position, setPosition] = useState(0),
    [unlocked, setUnlocked] = useState(false);
  const [isDragging, setDragging] = useState(false),
    [curvesPaused, setCurvesPaused] = useState(false),
    [watchActive, setWatchActive] = useState(false),
    [watchMounted, setWatchMounted] = useState(false),
    [watchReady, setWatchReady] = useState(false);
  const [visible, setVisible] = useState(true),
    [documentVisible, setDocumentVisible] = useState(true),
    [reduced, setReduced] = useState(false);
  const desktop = !compact;
  const assemblyVisible = progress > 0.26 || !desktop;

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const prefs = () => setReduced(motion.matches);
    prefs();
    const visibility = () => setDocumentVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(stage.current);
    motion.addEventListener("change", prefs);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", prefs);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    let frame;
    const paint = () => {
      frame = null;
      const rect = runway.current.getBoundingClientRect(),
        travel = runway.current.offsetHeight - stage.current.offsetHeight;
      const p = desktop ? clamp((77 - rect.top) / Math.max(1, travel)) : 0;
      const gather = smooth((p - 0.15) / 0.7),
        title = 1 - smooth((p - 0.025) / 0.25),
        panel = smooth((p - 0.28) / 0.35);
      transition.current = { progress: p, gather };
      stage.current.style.setProperty("--gather", gather);
      stage.current.style.setProperty("--intro-opacity", title);
      stage.current.style.setProperty(
        "--intro-shift",
        `${-title * 0 - (1 - title) * 60}px`,
      );
      stage.current.style.setProperty("--assembly-opacity", panel);
      stage.current.style.setProperty(
        "--assembly-shift",
        `${(1 - panel) * 45}px`,
      );
      setProgress(p);
      window.dispatchEvent(new Event("memova:opening-progress"));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [desktop]);
  useEffect(() => () => cancelAnimationFrame(returnFrame.current), []);
  useEffect(() => () => liveWatchCleanup.current?.(), []);
  useEffect(() => {
    if (unlocked && document.activeElement === rail.current) {
      const frame = requestAnimationFrame(() =>
        action.current?.focus({ preventScroll: true }),
      );
      return () => cancelAnimationFrame(frame);
    }
  }, [unlocked, desktop]);
  useEffect(() => {
    if (!watchActive || !watchReady || !liveWatchKeyboard.current) return;
    const frame = requestAnimationFrame(() => {
      const child = liveWatch.current?.contentDocument;
      const start = child?.querySelector("button.watch-logo-action:not([disabled])")
        || child?.querySelector(".watch-native-screen button:not([disabled])");
      start?.focus({ preventScroll: true });
      liveWatchKeyboard.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [watchActive, watchReady]);
  useEffect(() => {
    if (watchMounted) setWatchReady(false);
  }, [lang, watchMounted]);

  function setLight(value, canUnlock = true) {
    const p = clamp(value);
    unlockPosition.current = p;
    setPosition(p);
    // The device appears only at the actual right-hand endpoint, never by scrolling.
    if (p >= 1 && canUnlock) {
      unlockedRef.current = true;
      setUnlocked(true);
    }
  }
  function pointerPosition(e, initial = false) {
    const bounds = rail.current.getBoundingClientRect();
    const raw = (e.clientX - bounds.left) / bounds.width;
    const dragged = Math.abs(e.clientX - dragStart.current) >= 24;
    setLight(raw >= 0.995 ? 1 : raw, !initial && dragged);
  }
  function release(e) {
    pendingTouch.current = false;
    dragging.current = false;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    if (!unlockedRef.current) {
      const settle = () => {
        const next = unlockPosition.current * 0.8;
        setLight(next < 0.002 ? 0 : next);
        if (next >= 0.002) returnFrame.current = requestAnimationFrame(settle);
      };
      returnFrame.current = requestAnimationFrame(settle);
    }
  }
  function reset() {
    cancelAnimationFrame(returnFrame.current);
    liveWatchCleanup.current?.();
    liveWatchCleanup.current = null;
    unlockedRef.current = false;
    setWatchActive(false);
    setWatchMounted(false);
    setWatchReady(false);
    setUnlocked(false);
    setLight(0);
    returnFrame.current = requestAnimationFrame(() => rail.current?.focus({ preventScroll: true }));
  }
  function returnToCurves() {
    setWatchActive(false);
    returnFrame.current = requestAnimationFrame(() => action.current?.focus({ preventScroll: true }));
  }
  function onWatchLoad(event) {
    liveWatchCleanup.current?.();
    const frame = event.currentTarget;
    const child = frame.contentDocument;
    if (!child) return;
    const leave = (keyEvent) => {
      if (keyEvent.key === "Escape") {
        keyEvent.preventDefault();
        keyEvent.stopPropagation();
        action.current?.focus({ preventScroll: true });
      }
    };
    child.addEventListener("keydown", leave, true);
    liveWatchCleanup.current = () => child.removeEventListener("keydown", leave, true);
    setWatchReady(true);
  }
  function activateWatch(event) {
    liveWatchKeyboard.current = event.detail === 0;
    setWatchMounted(true);
    setWatchActive(true);
  }
  function useCrown() {
    const frame = liveWatch.current;
    const crown = frame?.contentDocument?.querySelector(".watch-memory-crown");
    if (crown && frame.contentWindow) {
      crown.dispatchEvent(new frame.contentWindow.MouseEvent("dblclick", { bubbles: true }));
    }
  }
  function jumpToWatch(e) {
    e.preventDefault();
    const start =
      runway.current.getBoundingClientRect().top + window.scrollY - 77;
    const travel = runway.current.offsetHeight - stage.current.offsetHeight;
    window.scrollTo({ top: start + travel * 0.92, behavior: "instant" });
  }
  const animationActive =
    visible && documentVisible && !frozen && !curvesPaused;

  return (
    <section className="opening-runway" id="top" ref={runway}>
      <div
        className="assembly-scroll-anchor"
        id="already-here"
        aria-hidden="true"
      />
      {desktop && <div className="assembly-scroll-anchor" id="watch-demo" aria-hidden="true" />}
      <div
        className="opening-stage hero hero-stories"
        ref={stage}
        data-assembling={assemblyVisible}
        data-unlocked={unlocked}
      >
        <StoryOrbit
          stories={stories}
          lang={lang}
          onOpen={onOpen}
          frozen={frozen}
          transitionRef={transition}
          geometryRef={geometry}
        />
        <FlowField
          stageRef={stage}
          geometryRef={geometry}
          transitionRef={transition}
          unlocked={unlocked}
          active={animationActive && progress > 0.12}
          reduced={reduced}
          draggingRef={dragging}
          positionRef={unlockPosition}
        />
        <div
          className="hero-copy"
          inert={progress > 0.25}
          aria-hidden={progress > 0.25}
        >
          <div className="eyebrow">MEMOVA FOR APPLE WATCH</div>
          <h1>
            {L(
              <>
                全天候记录生活，
                <br />
                积累个人知识库。
              </>,
              <>
                Record all day.
                <br />
                <em>Build your knowledge.</em>
              </>,
            )}
          </h1>
          <p className="hero-intro">
            {L(
              <>
                轻点 Apple Watch 开始录音，熄屏后继续。
                <br />在 iPhone 上离线转写、搜索，找回当时的原话。
              </>,
              <>
                Tap to record on Apple Watch. Keep going with the screen off.
                <br />
                Transcribe and search offline on iPhone. Find the original words.
              </>,
            )}
          </p>
          <div className="hero-actions">
            <a
              className="button dark"
              href={STORE}
              target="_blank"
              rel="noreferrer"
              aria-label={L("在 App Store 下载 Memova AI", "Download Memova AI on the App Store")}
            >
              {L("免费下载", "Download free")}
              <ArrowUpRight size={17} />
            </a>
            <button className="button ghost" onClick={() => onOpen("video")}>
              <Play size={16} weight="fill" />
              {L("观看产品短片", "Watch the film")}
              <span className="duration">1:25</span>
            </button>
          </div>
          <p className="trust-line">
            <Check size={14} />
            {L(
              "默认本地保存，上传内容由你决定",
              "Saved locally by default. You choose what to upload.",
            )}
          </p>
          <div className="story-invitation">
            <span className="desktop-story-invitation">
            {L(
              "点击场景图片，查看完整 My Day 示例",
              "Choose a picture to read a complete My Day example",
            )}
            </span>
            <span className="mobile-story-invitation">{L("左右滑动，探索 9 个日常故事", "Swipe through 9 everyday stories")}<ArrowRight size={14} /></span>
          </div>
        </div>
        <a
          className="scroll-cue opening-scroll-cue"
          href="#already-here"
          onClick={jumpToWatch}
          aria-hidden={assemblyVisible}
        >
          <ArrowDown size={16} />
          <span>
            {L(
              "向下滚动，看看记录如何汇成你的一天",
              "Scroll to see your day come together",
            )}
          </span>
        </a>

        <div
          className="watch-assembly"
          id={compact ? "watch-demo" : undefined}
          data-narrative-block="1"
          inert={!assemblyVisible}
          aria-hidden={!assemblyVisible}
        >
          <div className="assembly-heading">
            <span className="eyebrow">
              {unlocked
                ? "APPLE WATCH + MEMOVA"
                : L("无需另买录音硬件", "NO EXTRA RECORDING DEVICE")}
            </span>
            <h2>
              {unlocked
                ? L(
                    <>
                      {watchActive ? "轻点开始录音，" : "戴在手上，"}
                      <br />
                      {watchActive ? "熄屏也继续。" : "记录你的一天。"}
                    </>,
                    <>
                      {watchActive ? "Tap to record." : "On your wrist."}
                      <br />
                      {watchActive ? "Screen off. Still recording." : "Throughout your day."}
                    </>,
                  )
                : L(
                    <>
                      最好的 AI 听记产品，
                      <br />
                      其实就在你身边。
                    </>,
                    <>
                      Your best AI voice recorder
                      <br />
                      might already be on your wrist.
                    </>,
                  )}
            </h2>
          </div>
          <div className={"assembly-device" + (unlocked ? " is-unlocked" : "")}>
            <EmotionWatch
              lang={lang} unlocked={unlocked}
              active={animationActive && assemblyVisible && !(watchActive && watchReady)}
              palettes={palettes}
              interactive={unlocked && watchActive && watchReady}
              onCrown={useCrown}
            >
              {unlocked && watchMounted && (
                <iframe
                  ref={liveWatch}
                  title={L("Memova 手表交互原型", "Memova interactive Watch prototype")}
                  src={"/examples/watch-prototype.html?sample=legacy&embed=screen&lang=" + lang}
                  onLoad={onWatchLoad}
                />
              )}
            </EmotionWatch>
            <div
              ref={rail}
              className={"mystery-panel" + (isDragging ? " is-dragging" : "")}
              role={unlocked ? undefined : "slider"}
              tabIndex={unlocked ? -1 : 0}
              aria-hidden={unlocked}
              aria-label={L(
                "按住黑屏向右拖动，揭晓答案",
                "Hold the dark panel and drag right to reveal",
              )}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(position * 100)}
              aria-valuetext={L(
                `已拖动 ${Math.round(position * 100)}%，拖到最右边解锁`,
                `At ${Math.round(position * 100)}%. Drag to the right edge to unlock.`,
              )}
              style={{ "--unlock-x": `${position * 100}%` }}
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                cancelAnimationFrame(returnFrame.current);
                dragStart.current = e.clientX;
                dragStartY.current = e.clientY;
                // Let a vertical touch remain a normal page scroll. Only an
                // intentional horizontal gesture takes ownership of the panel.
                if (e.pointerType === "touch" && !desktop) {
                  pendingTouch.current = true;
                  return;
                }
                e.preventDefault();
                dragging.current = true;
                pointerPosition(e, true);
                setDragging(true);
                e.currentTarget.setPointerCapture(e.pointerId);
                e.currentTarget.focus({ preventScroll: true });
              }}
              onPointerMove={(e) => {
                if (pendingTouch.current) {
                  const dx = Math.abs(e.clientX - dragStart.current);
                  const dy = Math.abs(e.clientY - dragStartY.current);
                  if (dy > 8 && dy >= dx) { pendingTouch.current = false; return; }
                  if (dx <= 8 || dx <= dy) return;
                  pendingTouch.current = false;
                  dragging.current = true;
                  setDragging(true);
                  e.currentTarget.setPointerCapture(e.pointerId);
                  e.currentTarget.focus({ preventScroll: true });
                }
                if (dragging.current) pointerPosition(e);
              }}
              onPointerUp={release}
              onPointerCancel={release}
              onLostPointerCapture={() => {
                pendingTouch.current = false;
                dragging.current = false;
                setDragging(false);
              }}
              onKeyDown={(e) => {
                const keys = {
                  ArrowRight: position + 0.1,
                  ArrowLeft: position - 0.1,
                  Home: 0,
                  End: 1,
                };
                if (keys[e.key] !== undefined) {
                  e.preventDefault();
                  setLight(keys[e.key] > 0.999 ? 1 : keys[e.key]);
                }
              }}
            >
              <div className="mystery-grid" />
              <svg
                viewBox="0 0 320 190"
                className="mystery-answer"
                aria-hidden="true"
              >
                <defs>
                  <radialGradient
                    id={uid + "-glow"}
                    gradientUnits="userSpaceOnUse"
                    cx={position * 320}
                    cy="96"
                    r="94"
                  >
                    <stop offset="0" stopColor="white" />
                    <stop offset=".22" stopColor="white" />
                    <stop offset="1" stopColor="black" />
                  </radialGradient>
                  <linearGradient
                    id={uid + "-silver"}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop stopColor="#eff7ff" />
                    <stop offset=".4" stopColor="#718092" />
                    <stop offset=".55" stopColor="#edf5ff" />
                    <stop offset="1" stopColor="#576d87" />
                  </linearGradient>
                  <mask id={uid + "-spot"}>
                    <rect width="320" height="190" fill={`url(#${uid}-glow)`} />
                  </mask>
                </defs>
                <text
                  x="160"
                  y="106"
                  textAnchor="middle"
                  className="mystery-outline"
                >
                  APPLE WATCH
                </text>
                <text
                  x="160"
                  y="106"
                  textAnchor="middle"
                  fill={`url(#${uid}-silver)`}
                  mask={`url(#${uid}-spot)`}
                >
                  APPLE WATCH
                </text>
              </svg>
              <span className="mystery-label">
                <span className="mystery-hand-gesture" aria-hidden="true"
                  style={{ animationPlayState: animationActive && assemblyVisible ? "running" : "paused" }}>
                  <Hand className="gesture-open-hand" size={26} weight="light" />
                  <HandGrabbing className="gesture-closed-hand" size={26} weight="light" />
                </span>
                <span className="mystery-hint-title">
                  {L(
                    isDragging ? "继续向右拖动" : "按住黑屏，向右拖动",
                    isDragging
                      ? "Keep dragging right"
                      : "Hold the screen. Drag right.",
                  )}
                </span>
                <span className="mystery-hint-detail">
                  {L(
                    "拖到右边缘，拆开你的礼物",
                    "Reach the right edge. Unwrap the reveal.",
                  )}
                  <ArrowRight size={17} />
                </span>
              </span>
            </div>
          </div>
          <div className="assembly-controls">
            {unlocked && (
              <div className="assembly-unlocked-actions">
                {!watchActive ? <button
                  ref={action} className="button dark compact"
                  onClick={activateWatch}
                >
                  {L("体验手表操作", "Try Watch controls")}<ArrowRight size={16} />
                </button> : <a ref={action} className="text-link assembly-recordings-link" href="#privacy">
                  {L("接着看离线转写", "Next: offline transcription")}
                  <ArrowDown size={15} />
                </a>}
                <button className="assembly-reset" onClick={watchActive ? returnToCurves : reset}>
                  <ArrowCounterClockwise size={13} />
                  {watchActive ? L("返回曲线", "Back to signals") : L("再看一次", "Replay")}
                </button>
              </div>
            )}
            <span className="assembly-status" role="status" aria-live="polite">
              {unlocked
                ? watchActive
                  ? watchReady
                    ? L("轻点表盘 Logo 开始体验。示例不采集真实音频。", "Tap the logo to try it. This demo does not capture audio.")
                    : L("正在准备手表操作…", "Preparing Watch controls…")
                  : L("三条示意曲线：声音、健康、日常活动。", "Illustrative signals: Voice, Health and Daily Activities.")
                : L(
                    "用手表24小时记录你的日常，不遗漏任何一个细节。",
                    "Record your everyday life, 24/7, with your Watch. Never miss a detail.",
                  )}
            </span>
          </div>
          {unlocked && !watchActive && (
            <button
              className="assembly-motion"
              onClick={() => setCurvesPaused(!curvesPaused)}
              aria-pressed={curvesPaused}
              disabled={reduced}
            >
              {curvesPaused ? <Play size={12} /> : <Pause size={12} />}{" "}
              {reduced
                ? L("静态曲线", "Still view")
                : curvesPaused
                  ? L("继续曲线", "Resume curves")
                  : L("暂停曲线", "Pause curves")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
