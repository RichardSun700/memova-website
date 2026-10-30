import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { parseHTML } from "linkedom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CloudProcessingDemo } from "../../../homepage-watch/src/CloudProcessingDemo.jsx";

const quotes = [
  { id: "trip", source: { en: "Travel conversation", zh: "旅行对话" }, speaker: "George", quote: "Visit Cades Cove.",
    result: { key: "travel", title: { en: "Travel plan", zh: "旅行计划" }, image: "/travel-cover.png", alt: "Travel page cover" } },
  { id: "work", source: { en: "Work conversation", zh: "工作对话" }, speaker: "Michael", quote: "What do you mean by that?",
    result: { key: "myday", title: { en: "My Day", zh: "每日回顾" }, image: "/myday-cover.png", alt: "My Day cover" } },
  { id: "meeting", source: { en: "Meeting conversation", zh: "会议对话" }, speaker: "Michael", quote: "Make the next step clearer.",
    result: { key: "meeting", title: { en: "Meeting outcomes", zh: "会议成果" }, image: "/meeting-cover.png", alt: "Meeting page cover" } },
];

let root: Root | undefined;

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = undefined;
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function mount({ phone = false, reduced = false } = {}) {
  vi.useFakeTimers();
  const { document, window } = parseHTML('<html><body><div id="mount"></div></body></html>');
  const matchMedia = vi.fn((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? reduced : phone,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
  }));
  vi.stubGlobal("window", window);
  vi.stubGlobal("document", document);
  vi.stubGlobal("navigator", { userAgent: "Cloud demo interaction test" });
  vi.stubGlobal("matchMedia", matchMedia);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  window.matchMedia = matchMedia;
  // linkedom intentionally supplies no layout. Bounds are not used as evidence
  // that the mobile panel keeps its visual height; that needs browser QA.
  window.HTMLElement.prototype.getBoundingClientRect = () => ({
    x: 0, y: 0, top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0,
    toJSON: () => ({}),
  });
  // Model dialog lifecycle only; native focus trapping and visual viewport fit
  // remain browser checks rather than claims made from this DOM fixture.
  window.HTMLElement.prototype.showModal = function () {
    this.open = true;
    this.setAttribute("open", "");
  };
  window.HTMLElement.prototype.close = function () {
    this.open = false;
    this.removeAttribute("open");
  };
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  const onPhaseChange = vi.fn();
  const container = document.getElementById("mount")!;
  root = createRoot(container as unknown as HTMLElement);
  function render(lang = "en") {
    act(() => root!.render(createElement(CloudProcessingDemo, { quotes, lang, onPhaseChange })));
  }
  render();
  function click(selector: string) {
    const element = container.querySelector(selector)!;
    expect(element, selector).not.toBeNull();
    act(() => element.dispatchEvent(new window.Event("click", { bubbles: true })));
  }
  function finish() { act(() => vi.advanceTimersByTime(2000)); }
  const phase = () => container.querySelector(".cloud-processing-demo")?.getAttribute("data-phase");
  const readyKeys = () => [...container.querySelectorAll(".cloud-result-card.is-ready")]
    .map(card => card.getAttribute("data-result"));
  return { container, document, window, render, click, finish, phase, readyKeys, onPhaseChange };
}

describe("cloud processing selection and results", () => {
  it("does not process an empty selection", () => {
    const demo = mount();
    expect(demo.container.querySelector(".lower-choice-confirm")?.hasAttribute("disabled")).toBe(true);
    demo.click(".lower-choice-confirm");
    demo.finish();
    expect(demo.phase()).toBe("selecting");
    expect(demo.readyKeys()).toEqual([]);
    expect(demo.onPhaseChange).not.toHaveBeenCalled();
  });

  for (const reduced of [false, true]) {
    it(`makes only the selected outcomes ready${reduced ? " with reduced motion" : " after processing"}`, () => {
      const demo = mount({ reduced });
      demo.click('input[aria-label="Travel conversation"]');
      demo.click('input[aria-label="Meeting conversation"]');
      demo.click(".lower-choice-confirm");
      demo.finish();
      expect(demo.phase()).toBe("ready");
      expect(demo.readyKeys()).toEqual(["travel", "meeting"]);
      const unselected = demo.container.querySelector('[data-result="myday"]')!;
      expect(unselected.classList.contains("is-ready")).toBe(false);
      expect(unselected.getAttribute("aria-label")).toContain("Not selected");
      expect(demo.container.querySelector(".lower-choice-confirm")?.hasAttribute("disabled")).toBe(true);
    });
  }

  it("restores selection after completion and removes the previous results", () => {
    const demo = mount();
    demo.click(".cloud-select-all");
    demo.click(".lower-choice-confirm");
    demo.finish();
    expect(demo.readyKeys()).toEqual(["travel", "myday", "meeting"]);
    demo.click(".lower-choice-actions .lower-text-button:not(.cloud-select-all)");
    expect(demo.phase()).toBe("selecting");
    expect(demo.readyKeys()).toEqual([]);
    expect([...demo.container.querySelectorAll("input")].every(input => !(input as unknown as HTMLInputElement).checked)).toBe(true);
    expect(demo.container.querySelector(".lower-choice-confirm")?.hasAttribute("disabled")).toBe(true);
  });

  it("cancels a processing run when reset so stale timers cannot reveal outcomes", () => {
    const demo = mount();
    demo.click('input[aria-label="Travel conversation"]');
    demo.click(".lower-choice-confirm");
    expect(demo.phase()).toBe("moving");
    demo.click(".lower-choice-actions .lower-text-button:not(.cloud-select-all)");
    demo.finish();
    expect(demo.phase()).toBe("selecting");
    expect(demo.readyKeys()).toEqual([]);
    expect(demo.onPhaseChange.mock.calls.map(([phase]) => phase)).toEqual(["moving", "selecting"]);
  });

  it("keeps the selected results when switching between English and Chinese", () => {
    const demo = mount({ reduced: true });
    demo.click('input[aria-label="Work conversation"]');
    demo.click(".lower-choice-confirm");
    expect(demo.readyKeys()).toEqual(["myday"]);
    demo.render("zh");
    expect(demo.phase()).toBe("ready");
    expect(demo.readyKeys()).toEqual(["myday"]);
    expect(demo.container.querySelector('[data-result="myday"] strong')?.textContent).toBe("每日回顾");
    demo.render("en");
    expect(demo.readyKeys()).toEqual(["myday"]);
    expect(demo.container.querySelector('[data-result="myday"] strong')?.textContent).toBe("My Day");
  });

  for (const dismissal of ["choose again", "native cancel"]) {
    it(`cancels mobile processing and restores the existing scroll lock on ${dismissal}`, () => {
      const demo = mount({ phone: true });
      demo.document.body.style.overflow = "clip";
      demo.click('input[aria-label="Travel conversation"]');
      demo.click(".lower-choice-confirm");
      const dialog = demo.container.querySelector("dialog")!;
      expect(dialog.hasAttribute("open")).toBe(true);
      expect(demo.document.body.style.overflow).toBe("hidden");
      if (dismissal === "native cancel") {
        act(() => dialog.dispatchEvent(new demo.window.Event("cancel", { cancelable: true })));
      } else {
        demo.click(".cloud-mobile-outcomes-back");
      }
      demo.finish();
      expect(demo.phase()).toBe("selecting");
      expect(demo.container.querySelector("dialog")).toBeNull();
      expect(demo.readyKeys()).toEqual([]);
      expect(demo.document.body.style.overflow).toBe("clip");
    });
  }
});
