import fs from "node:fs";
import path from "node:path";
import { runInNewContext } from "node:vm";
import { parseHTML } from "linkedom";
import { describe, expect, it, vi } from "vitest";

const publicDir = path.resolve("client/public");

function analyticsFixture(complete = false, supportsIdle = true) {
  const scripts: any[] = [];
  const windowListeners: Record<string, () => void> = {};
  const documentListeners: Record<string, () => void> = {};
  const idle: (() => void)[] = [];
  const document = {
    readyState: complete ? "complete" : "loading",
    title: "Memova",
    head: { appendChild: (element: any) => { if (element.tagName === "script") scripts.push(element); } },
    body: { append: vi.fn() },
    createElement: (tagName: string) => ({ tagName, dataset: {}, style: {}, setAttribute: vi.fn(), addEventListener: vi.fn() }),
    getElementById: () => null,
    querySelector: (selector: string) => selector.includes("data-memova-ga4") ? scripts[0] : null,
    addEventListener: (name: string, callback: () => void) => { documentListeners[name] = callback; },
  };
  const window: any = {
    location: { pathname: "/", search: "", hash: "", href: "https://memova.ai/" },
    localStorage: { getItem: () => null },
    addEventListener: (name: string, callback: () => void) => { windowListeners[name] = callback; },
    setTimeout: (callback: () => void) => { idle.push(callback); },
  };
  window.self = window.top = window;
  if (supportsIdle) window.requestIdleCallback = (callback: () => void) => { idle.push(callback); };
  runInNewContext(fs.readFileSync(path.join(publicDir, "analytics/ga4-consent.js"), "utf8"), {
    window, document, URLSearchParams,
  });
  return { scripts, window, windowListeners, documentListeners, idle };
}

function socialFixture(reducedMotion = false) {
  const { document, window: domWindow } = parseHTML("<html><body><section id='share'></section></body></html>");
  const observers: any[] = [];
  const play = vi.fn(() => Promise.resolve());
  const pause = vi.fn();
  const createElement = document.createElement.bind(document);
  document.createElement = ((name: string) => {
    const element = createElement(name);
    if (name === "video") Object.assign(element, { play, pause });
    return element;
  }) as typeof document.createElement;
  domWindow.HTMLElement.prototype.getBoundingClientRect = () => ({ width: 390, height: 844, top: 0 }) as DOMRect;
  const window = {
    innerHeight: 844,
    matchMedia: () => ({ matches: reducedMotion, addEventListener: vi.fn() }),
    addEventListener: vi.fn(),
  };
  class IntersectionObserver {
    constructor(public callback: (entries: any[], observer: any) => void, public options: any) { observers.push(this); }
    observe = vi.fn();
    disconnect = vi.fn();
  }
  runInNewContext(fs.readFileSync(path.join(publicDir, "share-return-social-fan.js"), "utf8"), {
    document, window, IntersectionObserver,
    ResizeObserver: class { observe() {} },
    requestAnimationFrame: () => 1,
  });
  return { document, observers, play, pause };
}

describe("noncritical homepage requests", () => {
  it("queues consent and events without requesting Google until after load and idle", () => {
    const fixture = analyticsFixture();
    fixture.window.memovaAnalytics.trackEvent("early_access_click");
    fixture.documentListeners.DOMContentLoaded();
    expect(fixture.scripts).toHaveLength(0);
    expect(fixture.window.dataLayer.some((event: any) => event[1] === "early_access_click")).toBe(true);
    fixture.windowListeners.load();
    expect(fixture.scripts).toHaveLength(0);
    fixture.idle[0]();
    expect(fixture.scripts).toHaveLength(1);
    expect(fixture.scripts[0].src).toContain("googletagmanager.com/gtag/js");
    fixture.idle[0]();
    expect(fixture.scripts).toHaveLength(1);
  });

  it("also schedules analytics when installed after load or without requestIdleCallback", () => {
    for (const supportsIdle of [true, false]) {
      const fixture = analyticsFixture(true, supportsIdle);
      expect(fixture.scripts).toHaveLength(0);
      fixture.idle[0]();
      expect(fixture.scripts).toHaveLength(1);
    }
  });

  it("downloads social images near the section and starts video requests only when visible", () => {
    const fixture = socialFixture();
    const videos = [...fixture.document.querySelectorAll("video")] as any[];
    const images = [...fixture.document.querySelectorAll("img")];
    expect(videos).toHaveLength(2);
    expect(images.every(image => !image.hasAttribute("src"))).toBe(true);
    expect(videos.every(video => !video.src && !video.poster)).toBe(true);
    const near = fixture.observers.find(observer => observer.options.rootMargin);
    near.callback([{ isIntersecting: true }], near);
    expect(images.every(image => image.hasAttribute("src"))).toBe(true);
    expect(videos.every(video => video.poster && !video.src)).toBe(true);
    const visible = fixture.observers.find(observer => observer.options.threshold);
    visible.callback([{ isIntersecting: true }], visible);
    expect(videos.every(video => video.src.endsWith(".mp4"))).toBe(true);
    expect(fixture.play).toHaveBeenCalledTimes(2);
    visible.callback([{ isIntersecting: false }], visible);
    expect(fixture.pause).toHaveBeenCalled();
  });

  it("uses posters without downloading videos when reduced motion is requested", () => {
    const fixture = socialFixture(true);
    const visible = fixture.observers.find(observer => observer.options.threshold);
    visible.callback([{ isIntersecting: true }], visible);
    const videos = [...fixture.document.querySelectorAll("video")] as any[];
    expect(videos.every(video => video.poster && !video.src)).toBe(true);
    expect(fixture.play).not.toHaveBeenCalled();
  });
});
