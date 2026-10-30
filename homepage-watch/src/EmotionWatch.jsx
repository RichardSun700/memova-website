import React, { useEffect, useMemo, useRef, useState } from "react";
import storyPalettes from "./storyPalettes.json";
import "./EmotionWatch.css";

// Pixel coordinates in the original 560 × 880 transparent hardware photograph.
// The Canvas uses this fixed local coordinate space, independent of its CSS size.
const SCREEN = { x: 59, y: 196, width: 447, height: 498 };
export const WATCH_SIGNAL_ROWS = [212, 297, 382];
const TAU = Math.PI * 2;
const HEX = /^#[0-9a-f]{6}$/i;
const DIMENSIONS = [
  { id: "voice", zh: "声音", en: "Voice" },
  { id: "health", zh: "健康", en: "Health" },
  { id: "daily-activities", zh: "日常活动", en: "Daily Activities" },
];

function colorHue(color) {
  const rgb = [1, 3, 5].map(
    (start) => parseInt(color.slice(start, start + 2), 16) / 255,
  );
  const max = Math.max(...rgb),
    min = Math.min(...rgb),
    delta = max - min;
  if (delta === 0) return 0;
  const [r, g, b] = rgb;
  const hue =
    max === r
      ? (g - b) / delta
      : max === g
        ? (b - r) / delta + 2
        : (r - g) / delta + 4;
  return (hue + 6) % 6;
}

export function getWatchSignalGroups(palettes = storyPalettes) {
  const supplied = Array.isArray(palettes) ? palettes : [];
  const all = storyPalettes.map((fallback, index) => {
    const candidate =
      supplied.find((palette) => palette.id === fallback.id) ||
      supplied[index] ||
      fallback;
    return {
      ...fallback,
      color: HEX.test(candidate.color) ? candidate.color : fallback.color,
      secondary: HEX.test(candidate.secondary)
        ? candidate.secondary
        : fallback.secondary,
    };
  });
  // Adjacent hues form smooth gradients; every one of the nine stories is used.
  all.sort((a, b) => colorHue(a.color) - colorHue(b.color));
  return [all.slice(0, 3), all.slice(3, 6), all.slice(6, 9)];
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  return reduced;
}

function waveY(x, time, line) {
  if (line === 0) {
    // Voice: closely spaced, uneven oscillations with changing phrase envelopes.
    const envelope = 0.28 + 0.72 * Math.sin(x * 13.3 - time * 0.6) ** 2;
    const texture =
      Math.sin(x * TAU * 11.2 - time * 2.7) * 0.65 +
      Math.sin(x * TAU * 23.7 + time * 1.8) * 0.25 +
      Math.sin(x * TAU * 37.1 - time * 0.7) * 0.1;
    return WATCH_SIGNAL_ROWS[0] + texture * envelope * 17;
  }
  if (line === 1) {
    // Health: a soft pulse motif, without a numerical scale or measured values.
    const pulse = (((x * 3.1 - time * 0.24 + 0.17) % 1) + 1) % 1;
    const bump = (centre, width) =>
      Math.exp(-(((pulse - centre) / width) ** 2));
    return (
      WATCH_SIGNAL_ROWS[1] +
      Math.sin(x * TAU * 1.1 - time * 0.6) * 2.5 +
      bump(0.24, 0.09) * 3.5 -
      bump(0.38, 0.035) * 24 +
      bump(0.44, 0.05) * 9 -
      bump(0.65, 0.12) * 8
    );
  }
  // Daily activities: slow, broad hills and quiet plateaus between periods.
  const drift = Math.sin(time * 0.22) * 0.035;
  const hill = (centre, width) => Math.exp(-(((x - centre) / width) ** 4));
  return (
    WATCH_SIGNAL_ROWS[2] -
    hill(0.23 + drift, 0.13) * 17 -
    hill(0.69 - drift, 0.19) * 23 +
    Math.sin(x * TAU * 0.8 + time * 0.35) * 2.5
  );
}

function drawCurves(context, time, groups) {
  const { width, height } = SCREEN;
  context.clearRect(0, 0, width, height);
  const xStart = 31,
    xEnd = width - 31,
    span = xEnd - xStart;

  // A quiet field under the illustration, with no numerical or medical axes.
  const ambient = context.createRadialGradient(
    width * 0.53,
    283,
    15,
    width * 0.53,
    283,
    210,
  );
  ambient.addColorStop(0, "rgba(117, 151, 180, 0.075)");
  ambient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = ambient;
  context.fillRect(0, 147, width, 272);

  groups.forEach((colors, line) => {
    const gradient = context.createLinearGradient(xStart, 0, xEnd, 0);
    colors.forEach((palette, index) =>
      gradient.addColorStop(index / 2, palette.color),
    );

    const trace = () => {
      context.beginPath();
      const steps = line === 0 ? 192 : 112;
      for (let step = 0; step <= steps; step += 1) {
        const progress = step / steps;
        const x = xStart + progress * span;
        const y = waveY(progress, time, line);
        if (step === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
    };
    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = gradient;
    trace();
    context.globalAlpha = 0.14;
    context.lineWidth = 12;
    context.shadowColor = colors[1].color;
    context.shadowBlur = 17;
    context.stroke();
    context.globalAlpha = 1;
    context.shadowBlur = 0;
    context.lineWidth = line === 0 ? 2.7 : 3.6;
    context.stroke();

    // Each line has its own softly moving point, rather than a shared scanner.
    const progress =
      0.48 + Math.sin(time * (0.27 + line * 0.035) + line * 2.1) * 0.31;
    const x = xStart + progress * span;
    const y = waveY(progress, time, line);
    const glow = context.createRadialGradient(x, y, 0, x, y, 15);
    glow.addColorStop(0, `${colors[1].secondary}a8`);
    glow.addColorStop(0.38, `${colors[1].color}55`);
    glow.addColorStop(1, `${colors[1].color}00`);
    context.fillStyle = glow;
    context.beginPath();
    context.arc(x, y, 15, 0, TAU);
    context.fill();
    context.fillStyle = colors[1].secondary;
    context.beginPath();
    context.arc(x, y, 3.4, 0, TAU);
    context.fill();
    context.fillStyle = "rgba(255, 248, 232, 0.86)";
    context.beginPath();
    context.arc(x, y, 1.45, 0, TAU);
    context.fill();
    context.restore();
  });
}

/**
 * A transparent Apple Watch photograph with Voice, Health and Daily Activities.
 * `palettes` accepts the nine { id, image, color, secondary } extracted swatches.
 * `active` is the parent's visibility / animation gate. Nothing shows until unlocked.
 */
export function EmotionWatch({
  lang = "zh",
  unlocked = false,
  active = true,
  palettes,
  interactive = false,
  onCrown,
  children,
}) {
  const canvasRef = useRef(null);
  const clockRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const groups = useMemo(() => getWatchSignalGroups(palettes), [palettes]);

  useEffect(() => {
    if (!unlocked || !canvasRef.current) return undefined;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return undefined;
    let frame = null;
    let previousTime = null;
    let lastPaint = 0;
    let onScreen = true;

    const paint = () => drawCurves(context, clockRef.current, groups);
    const fit = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
      context.setTransform(
        canvas.width / SCREEN.width,
        0,
        0,
        canvas.height / SCREEN.height,
        0,
        0,
      );
      paint();
    };
    const shouldAnimate = () =>
      active && !reducedMotion && onScreen && !document.hidden;
    const tick = (timestamp) => {
      frame = null;
      if (!shouldAnimate()) return;
      if (previousTime !== null)
        clockRef.current += Math.min((timestamp - previousTime) / 1000, 0.06);
      previousTime = timestamp;
      // Small display: 30 paints / second is smooth and avoids unnecessary work.
      if (timestamp - lastPaint >= 1000 / 30) {
        paint();
        lastPaint = timestamp;
      }
      frame = requestAnimationFrame(tick);
    };
    const syncAnimation = () => {
      if (shouldAnimate()) {
        if (frame === null) {
          previousTime = null;
          frame = requestAnimationFrame(tick);
        }
      } else {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        previousTime = null;
      }
    };
    fit();
    const resize = new ResizeObserver(fit);
    resize.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      syncAnimation();
    });
    visibility.observe(canvas);
    document.addEventListener("visibilitychange", syncAnimation);
    syncAnimation();
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", syncAnimation);
    };
  }, [unlocked, active, reducedMotion, groups]);

  const zh = lang === "zh";
  return (
    <div
      className={`emotion-watch${unlocked ? " is-unlocked" : ""}${interactive ? " is-interactive" : ""}`}
      role={unlocked ? (interactive ? "group" : "img") : undefined}
      aria-hidden={!unlocked}
      aria-label={
        interactive
          ? (zh ? "同一块 Apple Watch 上的 Memova 录音操作" : "Memova recording controls on the same Apple Watch")
          : zh
          ? "Apple Watch 上的 Memova：声音、健康、日常活动三个维度的示例曲线，配色来自九个日常故事。"
          : "Memova on Apple Watch. Illustrative Voice, Health and Daily Activities curves, using colours from nine everyday stories."
      }
      data-active={active && !reducedMotion ? "true" : "false"}
    >
      <img
        className="emotion-watch-hardware"
        src="/assets/watch-hardware.png"
        width="560"
        height="880"
        alt=""
        draggable="false"
      />
      <div className="emotion-watch-screen">
        <div className="emotion-watch-signals" aria-hidden="true">
          <canvas ref={canvasRef} className="emotion-watch-curves" />
          <div className="emotion-watch-status">
            <span className="emotion-watch-brand">
              <img
                src="/assets/memova-icon-transparent.png"
                width="18"
                height="18"
                alt=""
              />
              <span>Memova</span>
            </span>
            <time dateTime="09:41">09:41</time>
          </div>
          {DIMENSIONS.map((dimension, index) => (
            <div
              key={dimension.id}
              className="emotion-watch-track-label"
              data-dimension={dimension.id}
              style={{
                top: `${30 + index * 17}%`,
                "--track-color": groups[index][1].color,
              }}
            >
              <span />
              {zh ? dimension.zh : dimension.en}
            </div>
          ))}
          <div className="emotion-watch-caption">{zh ? "示例" : "Example"}</div>
        </div>
        <div className="emotion-watch-live" inert={!interactive} aria-hidden={!interactive}>
          {children}
        </div>
      </div>
      {interactive && onCrown && <button className="emotion-watch-crown" type="button"
        aria-label={zh ? "双击表冠，打开 Rewind" : "Double-click the crown to open Rewind"}
        title={zh ? "双击表冠 · Rewind（键盘 Enter 也可体验）" : "Double-click crown · Rewind (or press Enter)"}
        onDoubleClick={onCrown} onClick={(event) => { if (event.detail === 0) onCrown(); }} />}
    </div>
  );
}
