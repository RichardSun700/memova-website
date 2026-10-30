import { useCallback, useEffect, useRef, useState } from "react";

const END_HOLD = 0.08;
export const JOURNEY_WIDE_QUERY = "(min-width: 850px)";
export const JOURNEY_LANDSCAPE_QUERY = "(max-width: 1000px) and (max-height: 500px)";
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const safeCount = (count) => Math.max(1, Math.floor(Number(count) || 1));
const progressForFraction = (fraction, count) =>
  clamp((fraction - END_HOLD) / (1 - END_HOLD * 2)) * (count - 1);
const chapterForProgress = (progress, count) =>
  clamp(Math.floor(progress + 0.4), 0, count - 1);
const fractionForChapter = (chapter, count) => {
  if (chapter === 0) return END_HOLD / 2;
  if (chapter === count - 1) return 1 - END_HOLD / 2;
  return END_HOLD + (chapter / (count - 1)) * (1 - END_HOLD * 2);
};

function metrics(runway, sticky) {
  return {
    rect: runway.getBoundingClientRect(),
    top: parseFloat(window.getComputedStyle(sticky).top) || 0,
    travel: Math.max(0, runway.offsetHeight - sticky.offsetHeight),
  };
}

/**
 * CSS owns the runway height and the sticky panel's height/top.
 * progressRef.current and --journey-progress are positions from 0 to count - 1.
 * The first/last 8% of travel hold the end cards; the middle 84% maps linearly.
 * data-active and chapter change at i + 0.6, using the same threshold backwards.
 * Mobile, short phone-landscape and reduced motion use ordinary tabs.
 */
export function useExperienceJourney({ count = 3 } = {}) {
  const total = safeCount(count);
  const runwayRef = useRef(null);
  const stickyRef = useRef(null);
  const progressRef = useRef(0);
  const chapterRef = useRef(0);
  const requestPaintRef = useRef(() => {});
  const [chapter, setChapter] = useState(0);
  const [desktop, setDesktop] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(JOURNEY_WIDE_QUERY).matches &&
      !window.matchMedia(JOURNEY_LANDSCAPE_QUERY).matches,
  );
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const scrollDriven = desktop && !reduced;

  const selectChapter = useCallback((next) => {
    if (chapterRef.current !== next) {
      chapterRef.current = next;
      setChapter(next);
    }
  }, []);

  useEffect(() => {
    const size = window.matchMedia(JOURNEY_WIDE_QUERY);
    const landscape = window.matchMedia(JOURNEY_LANDSCAPE_QUERY);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setDesktop(size.matches && !landscape.matches);
      setReduced(motion.matches);
    };
    update();
    size.addEventListener("change", update);
    landscape.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      size.removeEventListener("change", update);
      landscape.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    let frame = null;
    const paint = () => {
      frame = null;
      const runway = runwayRef.current;
      const sticky = stickyRef.current;
      if (!runway || !sticky) return;
      let position = clamp(progressRef.current, 0, total - 1);
      if (scrollDriven) {
        const { rect, top, travel } = metrics(runway, sticky);
        if (travel > 0) position = progressForFraction((top - rect.top) / travel, total);
      }
      const active = chapterForProgress(position, total);
      progressRef.current = position;
      // All imperative DOM writes stay inside this scheduled paint.
      const cssProgress = position.toFixed(5);
      if (sticky.style.getPropertyValue("--journey-progress") !== cssProgress)
        sticky.style.setProperty("--journey-progress", cssProgress);
      if (sticky.dataset.active !== String(active)) sticky.dataset.active = String(active);
      if (sticky.dataset.scrollDriven !== String(scrollDriven))
        sticky.dataset.scrollDriven = String(scrollDriven);
      selectChapter(active);
    };
    const requestPaint = () => {
      if (frame === null) frame = window.requestAnimationFrame(paint);
    };
    requestPaintRef.current = requestPaint;
    const resize = new ResizeObserver(requestPaint);
    if (runwayRef.current) resize.observe(runwayRef.current);
    if (stickyRef.current) resize.observe(stickyRef.current);
    if (scrollDriven) window.addEventListener("scroll", requestPaint, { passive: true });
    window.addEventListener("resize", requestPaint, { passive: true });
    requestPaint();
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      resize.disconnect();
      if (scrollDriven) window.removeEventListener("scroll", requestPaint);
      window.removeEventListener("resize", requestPaint);
      requestPaintRef.current = () => {};
    };
  }, [total, scrollDriven, selectChapter]);

  const navigate = useCallback((index) => {
    const next = clamp(Math.round(Number(index) || 0), 0, total - 1);
    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    if (scrollDriven && runway && sticky) {
      const { rect, top, travel } = metrics(runway, sticky);
      if (travel > 0) {
        const start = window.scrollY + rect.top - top;
        window.scrollTo({
          top: start + travel * fractionForChapter(next, total),
          behavior: "smooth",
        });
        requestPaintRef.current();
        return;
      }
    }
    progressRef.current = next;
    selectChapter(next);
    requestPaintRef.current();
  }, [total, scrollDriven, selectChapter]);

  const onTabKeyDown = useCallback((event, index = chapterRef.current) => {
    const current = clamp(Math.round(Number(index) || 0), 0, total - 1);
    const next = event.key === "ArrowRight" ? (current + 1) % total
      : event.key === "ArrowLeft" ? (current + total - 1) % total
        : event.key === "Home" ? 0
          : event.key === "End" ? total - 1
            : null;
    if (next === null) return;
    event.preventDefault();
    navigate(next);
    const tabs = event.currentTarget.closest('[role="tablist"]')?.querySelectorAll('[role="tab"]');
    tabs?.[next]?.focus({ preventScroll: true });
  }, [total, navigate]);

  return {
    runwayRef,
    stickyRef,
    progressRef,
    chapter,
    reduced,
    desktop,
    scrollDriven,
    navigate,
    onTabKeyDown,
  };
}
