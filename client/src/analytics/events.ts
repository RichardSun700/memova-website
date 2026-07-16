export type AnalyticsEventName =
  | "ios_early_access_click"
  | "waitlist_submit_success";

type AnalyticsParameters = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: (...args: unknown[]) => void;
    memovaAnalytics?: {
      trackEvent: (name: string, parameters?: AnalyticsParameters) => void;
      trackPageView: () => void;
      updateConsent?: (choice: "granted" | "denied") => void;
    };
  }
}

export function trackAnalyticsEvent(
  name: AnalyticsEventName,
  parameters: AnalyticsParameters = {},
) {
  if (typeof window === "undefined") return;
  window.memovaAnalytics?.trackEvent(name, parameters);
}

export function trackAnalyticsPageView() {
  if (typeof window === "undefined") return;
  window.memovaAnalytics?.trackPageView();
}
