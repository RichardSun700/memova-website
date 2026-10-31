import { act, createElement, createRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { parseHTML } from "linkedom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductDemoVideo } from "../../../homepage-watch/src/ProductDemoVideo";

const defaults = {
  lang: "en", kind: "timeline", src: "/demo.mp4", poster: "/poster.jpg",
  caption: "A sample conversation", description: "Read the original words",
  chapters: [{ time: 12, label: "Original words" }],
};
const roots: Root[] = [];
afterEach(async () => {
  for (const root of roots.splice(0)) await act(() => root.unmount());
  vi.unstubAllGlobals();
});

async function fixture(overrides: Record<string, unknown> = {}, reduced = false, nativeFullscreen = false) {
  const { document, window } = parseHTML('<html><body><main class="journey-sticky"><div id="root"></div></main></body></html>');
  const observers: any[] = [];
  const play = vi.fn(() => Promise.resolve()), pause = vi.fn();
  const enterFullscreen = vi.fn(function (this: any) {
    if (this.readyState < 1) throw new Error("InvalidStateError: metadata unavailable");
  });
  const create = document.createElement.bind(document);
  document.createElement = ((tag: string) => {
    const element = create(tag);
    if (tag === "video") {
      Object.assign(element, { play, pause, readyState: 0, duration: 60, currentTime: 0 });
      if (nativeFullscreen) Object.assign(element, { webkitEnterFullscreen: enterFullscreen });
    }
    return element;
  }) as typeof document.createElement;
  Object.assign(window.HTMLElement.prototype, { focus: vi.fn() });
  const queries = new Map<string, any>();
  const matchMedia = (query: string) => {
    if (!queries.has(query)) queries.set(query, {
      matches: query.includes("prefers-reduced-motion") ? reduced : query.includes("min-width"),
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
    });
    return queries.get(query);
  };
  class Observer {
    constructor(public callback: (entries: any[]) => void, public options: any) { observers.push(this); }
    observe = vi.fn(); disconnect = vi.fn();
  }
  vi.stubGlobal("window", window);
  vi.stubGlobal("document", document);
  vi.stubGlobal("matchMedia", matchMedia);
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const root = createRoot(document.getElementById("root")!);
  roots.push(root);
  const handle = createRef<{ replay: () => void }>();
  let props = { ...defaults, ...overrides };
  const render = async (next: Record<string, unknown> = {}) => {
    props = { ...props, ...next };
    await act(() => root.render(createElement(ProductDemoVideo, { ...props, ref: handle })));
  };
  await render();
  const video = document.querySelector("video") as any;
  const near = observers.find(observer => observer.options.rootMargin);
  const visibility = observers.find(observer => observer.options.threshold === .2);
  const intersect = async (observer: any, visible: boolean) => {
    await act(() => observer.callback([{ isIntersecting: visible, intersectionRatio: visible ? 1 : 0 }]));
  };
  const click = async (selector: string) => {
    await act(() => (document.querySelector(selector) as HTMLElement).click());
  };
  const metadata = async () => {
    video.readyState = 1;
    await act(() => video.dispatchEvent(new window.Event("loadedmetadata")));
  };
  return { document, window, video, near, visibility, render, intersect, click, metadata, play, pause, handle, enterFullscreen };
}

describe("production demo media loading", () => {
  it("ships readable server-rendered controls without triggering video or poster requests", () => {
    const html = renderToStaticMarkup(createElement(ProductDemoVideo, defaults));
    const { document } = parseHTML(html);
    const video = document.querySelector("video")!;
    expect(video.getAttribute("preload")).toBe("none");
    expect(video.hasAttribute("src")).toBe(false);
    expect(video.hasAttribute("poster")).toBe(false);
    expect(document.querySelector('link[rel="preload"]')).toBeNull();
    expect(document.querySelector(".product-demo-chapters")?.textContent).toContain("Original words");
  });

  it("requests media once near the stationary deck and retains it after scrolling away", async () => {
    const f = await fixture();
    expect(f.near.options.rootMargin).toBe("400px 0px");
    expect(f.near.observe).toHaveBeenCalledWith(f.document.querySelector(".journey-sticky"));
    expect(f.video.hasAttribute("src")).toBe(false);
    expect(f.play).not.toHaveBeenCalled();
    await f.intersect(f.near, true);
    expect(f.video.getAttribute("src")).toBe(defaults.src);
    expect(f.video.getAttribute("poster")).toBe(defaults.poster);
    expect(f.video.getAttribute("preload")).toBe("metadata");
    expect(f.near.disconnect).toHaveBeenCalled();
    expect(f.play).not.toHaveBeenCalled();
    await f.intersect(f.visibility, true);
    expect(f.play).toHaveBeenCalled();
    await f.intersect(f.visibility, false);
    expect(f.pause).toHaveBeenCalled();
    expect(f.video.getAttribute("src")).toBe(defaults.src);
    expect(f.video.getAttribute("poster")).toBe(defaults.poster);
  });

  it("does not play an inactive or suspended chapter even when its media is available", async () => {
    const f = await fixture({ active: false });
    await f.intersect(f.near, true);
    await f.intersect(f.visibility, true);
    expect(f.play).not.toHaveBeenCalled();
    await f.render({ active: true });
    expect(f.play).toHaveBeenCalled();
    f.pause.mockClear();
    await f.render({ suspended: true });
    expect(f.pause).toHaveBeenCalled();
    expect(f.video.getAttribute("src")).toBe(defaults.src);
  });

  it("loads on the first chapter jump and applies its queued seek after metadata arrives", async () => {
    const f = await fixture();
    await f.click(".product-demo-chapters button");
    expect(f.video.getAttribute("src")).toBe(defaults.src);
    expect(f.video.currentTime).toBe(0);
    await f.metadata();
    expect(f.video.currentTime).toBe(12);
  });

  it("allows replay and manual play to load a not-yet-observed video under reduced motion", async () => {
    const f = await fixture({}, true);
    await f.intersect(f.visibility, true);
    expect(f.play).not.toHaveBeenCalled();
    await act(() => f.handle.current!.replay());
    expect(f.video.getAttribute("src")).toBe(defaults.src);
    expect(f.play).toHaveBeenCalled();
    f.video.currentTime = 28;
    await f.metadata();
    expect(f.video.currentTime).toBe(0);
  });

  it("lets a direct play click request media before the loading observer fires", async () => {
    const f = await fixture({}, true);
    await f.intersect(f.visibility, true);
    await f.click('button[aria-label="Play demo"]');
    expect(f.video.getAttribute("src")).toBe(defaults.src);
    expect(f.play).toHaveBeenCalled();
  });

  it("keeps iOS fullscreen available when the first tap starts loading before metadata", async () => {
    const f = await fixture({}, false, true);
    const button = 'button[aria-label="View demo fullscreen"]';
    await f.click(button);
    expect(f.video.getAttribute("src")).toBe(defaults.src);
    expect(f.enterFullscreen).not.toHaveBeenCalled();
    expect(f.document.querySelector(button)).not.toBeNull();
    await f.metadata();
    expect(f.enterFullscreen).not.toHaveBeenCalled();
    await f.click(button);
    expect(f.enterFullscreen).toHaveBeenCalledOnce();
    expect(f.document.querySelector(button)).not.toBeNull();
  });
});
