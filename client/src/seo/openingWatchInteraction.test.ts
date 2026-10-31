import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { parseHTML } from "linkedom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OpeningExperience } from "../../../homepage-watch/src/OpeningExperience";

vi.mock("../../../homepage-watch/src/StoryOrbit", () => ({ StoryOrbit: () => null }));
vi.mock("../../../homepage-watch/src/EmotionWatch", () => ({
  EmotionWatch: ({ children }: { children: unknown }) => createElement("div", { className: "emotion-watch" }, children as any),
  getWatchSignalGroups: () => [],
  WATCH_SIGNAL_ROWS: [],
}));

const roots: Root[] = [];
afterEach(async () => {
  for (const root of roots.splice(0)) await act(() => root.unmount());
  vi.unstubAllGlobals();
});

async function fixture(compact = true) {
  const { document, window } = parseHTML('<html><body><div id="root"></div></body></html>');
  const capture = vi.fn();
  const create = document.createElement.bind(document);
  document.createElement = ((tag: string) => {
    const element = create(tag);
    if (tag === "canvas") Object.assign(element, { getContext: () => ({ setTransform: vi.fn(), clearRect: vi.fn() }) });
    return element;
  }) as typeof document.createElement;
  Object.assign(window.HTMLElement.prototype, {
    focus: vi.fn(),
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 320, height: 600 }),
    setPointerCapture: capture,
    hasPointerCapture: () => false,
    releasePointerCapture: vi.fn(),
  });
  const frames = new Map<number, FrameRequestCallback>();
  let frameId = 0;
  vi.stubGlobal("window", window);
  vi.stubGlobal("document", document);
  vi.stubGlobal("Event", window.Event);
  vi.stubGlobal("devicePixelRatio", 1);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback);
    return frameId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  const root = createRoot(document.getElementById("root")!);
  roots.push(root);
  let props = { compact, lang: "en", stories: [], onOpen: vi.fn(), frozen: true };
  const render = async (next: Partial<typeof props> = {}) => {
    props = { ...props, ...next };
    await act(() => root.render(createElement(OpeningExperience, props)));
  };
  const panel = () => document.querySelector(".mystery-panel")!;
  const unlocked = () => document.querySelector(".opening-stage")!.getAttribute("data-unlocked");
  const dispatch = async (type: string, values: Record<string, unknown> = {}) => {
    const event = new window.Event(type, { bubbles: true, cancelable: true });
    Object.assign(event, values);
    await act(() => panel().dispatchEvent(event));
    return event;
  };
  const click = async (selector = ".mystery-panel") => {
    await act(() => (document.querySelector(selector) as HTMLElement).click());
  };
  const flushFrames = async () => {
    const callbacks = [...frames.values()];
    frames.clear();
    await act(() => callbacks.forEach(callback => callback(1000)));
  };
  await render();
  return { document, panel, unlocked, render, dispatch, click, capture, flushFrames };
}

describe("Watch screen reveal", () => {
  it("opens the phone screen with a click without taking ownership of touch scrolling, including replay", async () => {
    const f = await fixture();
    expect(f.panel().getAttribute("role")).toBe("button");
    const down = await f.dispatch("pointerdown", { button: 0, pointerType: "touch", pointerId: 1, clientX: 140, clientY: 200 });
    await f.dispatch("pointermove", { pointerType: "touch", pointerId: 1, clientX: 142, clientY: 250 });
    await f.dispatch("pointerup", { pointerType: "touch", pointerId: 1 });
    expect(down.defaultPrevented).toBe(false);
    expect(f.capture).not.toHaveBeenCalled();
    expect(f.panel().classList.contains("is-dragging")).toBe(false);
    expect(f.unlocked()).toBe("false");
    await f.click();
    expect(f.unlocked()).toBe("true");
    await f.click(".assembly-reset");
    expect(f.unlocked()).toBe("false");
    await f.click();
    await f.flushFrames();
    expect(f.unlocked()).toBe("true");
  });

  it.each(["Enter", " "])("supports %j for keyboard users on the phone layout", async key => {
    const f = await fixture();
    const event = await f.dispatch("keydown", { key });
    expect(event.defaultPrevented).toBe(true);
    expect(f.unlocked()).toBe("true");
  });

  it("retains the desktop slider and its keyboard endpoint instead of unlocking on click", async () => {
    const f = await fixture(false);
    expect(f.panel().getAttribute("role")).toBe("slider");
    await f.click();
    expect(f.unlocked()).toBe("false");
    await f.dispatch("keydown", { key: "End" });
    expect(f.unlocked()).toBe("true");
  });

  it("does not let an unfinished desktop drag undo a later phone click after resizing", async () => {
    const f = await fixture(false);
    await f.dispatch("pointerdown", { button: 0, pointerType: "mouse", pointerId: 1, clientX: 5, clientY: 200 });
    await f.dispatch("pointermove", { pointerType: "mouse", pointerId: 1, clientX: 160, clientY: 200 });
    await f.dispatch("pointerup", { pointerType: "mouse", pointerId: 1 });
    expect(f.unlocked()).toBe("false");
    await f.render({ compact: true });
    await f.click();
    await f.flushFrames();
    expect(f.unlocked()).toBe("true");
    expect(f.panel().style.getPropertyValue("--unlock-x")).toBe("100%");
  });
});
