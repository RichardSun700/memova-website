import { afterEach, describe, expect, it, vi } from "vitest";
import { trackAnalyticsEvent, trackAnalyticsPageView } from "./events";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("analytics event bridge", () => {
  it("forwards typed events and SPA page views to the consent-aware bootstrap", () => {
    const trackEvent = vi.fn();
    const trackPageView = vi.fn();
    vi.stubGlobal("window", { memovaAnalytics: { trackEvent, trackPageView } });

    trackAnalyticsEvent("waitlist_submit_success", { source: "home-ios-early-access" });
    trackAnalyticsPageView();

    expect(trackEvent).toHaveBeenCalledWith("waitlist_submit_success", {
      source: "home-ios-early-access",
    });
    expect(trackPageView).toHaveBeenCalledOnce();
  });

  it("does not break product behavior when analytics is unavailable", () => {
    vi.stubGlobal("window", {});

    expect(() => trackAnalyticsEvent("ios_early_access_click")).not.toThrow();
    expect(() => trackAnalyticsPageView()).not.toThrow();
  });
});
