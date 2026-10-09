import fs from "node:fs";
import path from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const source = fs.readFileSync(path.resolve("client/homepage/index.html"), "utf8");
const hook = source.slice(source.indexOf("function useHeroScrollProgress("), source.indexOf("function OrbitSignalIcon("));

function renderProgress({ staticIntro, reducedMotion = false, previousProgress }) {
  const section = { offsetHeight: 3600, getBoundingClientRect: vi.fn(() => ({ top: -300 })) };
  const window = {
    innerWidth: 1440, innerHeight: 900, scrollY: 300,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    requestAnimationFrame: vi.fn(() => 1), cancelAnimationFrame: vi.fn(),
  };
  let effect;
  let state;
  const useProgress = runInNewContext(`${hook}; useHeroScrollProgress`, {
    window, document: {},
    clampProgress: value => Math.min(1, Math.max(0, value)),
    useState: initial => {
      state = previousProgress ?? initial;
      return [state, next => { state = typeof next === "function" ? next(state) : next; }];
    },
    useEffect: callback => { effect = callback; },
  });
  const progress = useProgress({ current: section }, reducedMotion, staticIntro);
  const cleanup = effect();
  return { window, section, progress, state, cleanup };
}

describe("static phone introduction", () => {
  it("shows the opening immediately and does no scroll work after switching from desktop", () => {
    const result = renderProgress({ staticIntro: true, previousProgress: 0.8 });
    expect(result.progress).toBe(0);
    expect(result.state).toBe(0);
    expect(result.section.getBoundingClientRect).not.toHaveBeenCalled();
    expect(result.window.addEventListener).not.toHaveBeenCalled();
    expect(result.window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("keeps the opening visible when the phone also requests reduced motion", () => {
    const result = renderProgress({ staticIntro: true, reducedMotion: true });
    expect(result.progress).toBe(0);
    expect(result.window.addEventListener).not.toHaveBeenCalled();
  });

  it("preserves the desktop scroll sequence and removes listeners on teardown", () => {
    const result = renderProgress({ staticIntro: false });
    expect(result.state).toBeCloseTo(300 / 2700);
    expect(result.window.addEventListener.mock.calls.map(([name]) => name)).toEqual(["scroll", "resize", "pageshow"]);
    result.cleanup();
    expect(result.window.removeEventListener.mock.calls.map(([name]) => name)).toEqual(["scroll", "resize", "pageshow"]);
  });
});
