import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { parseHTML } from "linkedom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "../../../homepage-watch/src/App";

vi.mock("../../../homepage-watch/src/OpeningExperience", () => ({
  OpeningExperience: ({ onOpen }: { onOpen: (name: string) => void }) => createElement("div", null,
    createElement("button", { id: "open-case", onClick: () => onOpen("myday") }, "Open case"),
    createElement("button", { id: "open-day", onClick: () => onOpen("day") }, "Open day")),
}));
vi.mock("../../../homepage-watch/src/ExperienceJourney", () => ({ ExperienceJourney: () => null }));
vi.mock("../../../homepage-watch/src/LowerSections", () => ({ PrivacyBlock: () => null, LowerSections: () => null }));
vi.mock("../../../homepage-watch/src/ProFeatureVisual", () => ({ ProFeatureVisual: () => null }));
vi.mock("../../../homepage-watch/src/useCompactLayout", () => ({ useCompactLayout: () => false }));
vi.mock("../../../homepage-watch/src/useSiteNavigation", () => ({ useSiteNavigation: () => ({ headerRef: { current: null }, activeNav: null }) }));

const roots: Root[] = [];
afterEach(async () => {
  for (const root of roots.splice(0)) await act(() => root.unmount());
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function fixture() {
  vi.useFakeTimers();
  const { document, window } = parseHTML('<html><body><div id="root"></div><button id="privacy-choices">Privacy choices</button></body></html>');
  const active = new Map<any, any>([[document, document.body]]);
  const frames = new Map<any, any>();
  Object.defineProperty(document, "activeElement", { get: () => active.get(document) });
  Object.defineProperty(window.HTMLElement.prototype, "tabIndex", {
    configurable: true,
    get() { return this.hasAttribute("tabindex") ? Number(this.getAttribute("tabindex")) : this.matches('a[href],button,input,select,textarea,iframe,summary,video[controls]') ? 0 : -1; },
    set(value) { this.setAttribute("tabindex", String(value)); },
  });
  window.HTMLElement.prototype.getClientRects = () => [{ width: 100, height: 30 }];
  window.HTMLElement.prototype.focus = function () {
    if (!active.has(this.ownerDocument)) return;
    active.set(this.ownerDocument, this);
    if (frames.has(this.ownerDocument)) active.set(document, frames.get(this.ownerDocument));
    this.dispatchEvent(new window.Event("focusin", { bubbles: true }));
  };
  Object.assign(document, { fonts: { ready: Promise.resolve() } });
  Object.assign(window, { location: { hash: "" } });
  vi.stubGlobal("window", window);
  vi.stubGlobal("document", document);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  const root = createRoot(document.getElementById("root")!);
  roots.push(root);
  await act(() => root.render(createElement(App)));
  const click = async (selector: string) => {
    const node = document.querySelector(selector) as HTMLElement;
    await act(() => { node.focus(); node.click(); });
    await act(() => vi.advanceTimersByTime(31));
  };
  const key = async (target: any, value: string, shiftKey = false) => {
    const event = new window.Event("keydown", { bubbles: true, cancelable: true });
    Object.assign(event, { key: value, shiftKey });
    await act(() => target.dispatchEvent(event));
    return event;
  };
  const loadCase = async () => {
    const frame = document.querySelector(".modal iframe")!;
    const child = parseHTML('<html><body><a id="first" href="#first">First source</a><button id="middle">Read quote</button><a id="last" href="https://example.com/">Last source</a></body></html>').document;
    active.set(child, child.body);
    frames.set(child, frame);
    Object.defineProperty(child, "activeElement", { get: () => active.get(child) });
    Object.defineProperty(frame, "contentDocument", { configurable: true, value: child });
    await act(() => frame.dispatchEvent(new window.Event("load")));
    return child;
  };
  return { document, window, click, key, loadCase };
}

describe("homepage modal keyboard containment", () => {
  it("cycles the case frame's first and last links to the close button while preserving internal navigation", async () => {
    const f = await fixture();
    await f.click("#open-case");
    const child = await f.loadCase();
    const middle = child.getElementById("middle")!;
    middle.focus();
    expect((await f.key(middle, "Tab")).defaultPrevented).toBe(false);
    const last = child.getElementById("last")!;
    last.focus();
    expect((await f.key(last, "Tab")).defaultPrevented).toBe(true);
    expect(f.document.activeElement).toBe(f.document.querySelector(".modal-close"));
    const first = child.getElementById("first")!;
    first.focus();
    expect((await f.key(first, "Tab", true)).defaultPrevented).toBe(true);
    expect(f.document.activeElement).toBe(f.document.querySelector(".modal-close"));
  });

  it("recaptures focus if iframe navigation sends it to an injected background control", async () => {
    const f = await fixture();
    await f.click("#open-case");
    const child = await f.loadCase();
    child.getElementById("last")!.focus();
    f.document.getElementById("privacy-choices")!.focus();
    expect(f.document.activeElement).toBe(f.document.querySelector(".modal-close"));
  });

  it("closes on Escape from the frame and restores the original entry and scroll lock", async () => {
    const f = await fixture();
    f.document.body.style.overflow = "clip";
    await f.click("#open-case");
    const child = await f.loadCase();
    child.getElementById("middle")!.focus();
    await f.key(child.body, "Escape");
    expect(f.document.querySelector(".modal")).toBeNull();
    expect(f.document.activeElement).toBe(f.document.getElementById("open-case"));
    expect(f.document.body.style.overflow).toBe("clip");
    f.document.getElementById("privacy-choices")!.focus();
    expect(f.document.activeElement).toBe(f.document.getElementById("privacy-choices"));
  });

  it("keeps the original entry when navigating from the day modal to a case", async () => {
    const f = await fixture();
    await f.click("#open-day");
    await f.click(".day-detail button");
    await f.click(".modal-close");
    expect(f.document.activeElement).toBe(f.document.getElementById("open-day"));
  });

  it("retains the generic community dialog's keyboard loop", async () => {
    const f = await fixture();
    await f.click(".header-community");
    const close = f.document.querySelector(".modal-close")!;
    close.focus();
    expect((await f.key(close, "Tab", true)).defaultPrevented).toBe(true);
    expect(f.document.activeElement).toBe(f.document.querySelector(".community-action"));
    await f.key(f.document.querySelector(".community-action"), "Tab");
    expect(f.document.activeElement).toBe(close);
  });
});
