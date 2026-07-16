import React from "react";
import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AgentMemory from "./AgentMemory";
import HowItWorks from "./HowItWorks";
import IOS from "./IOS";
import { UseCaseDetailPage, useCaseDetails } from "./UseCaseDetail";
import HeroSection from "@/components/sections/HeroSection";
import CTASection from "@/components/sections/CTASection";
import { privacyPolicyPaths } from "@/App";

function render(component: React.ReactElement) {
  return renderToStaticMarkup(component);
}

describe("US iOS acquisition pages", () => {
  it("keeps both public privacy policy URLs mapped to the legal page", () => {
    expect(privacyPolicyPaths).toEqual(["/privacy", "/privacy-policy"]);
  });

  it("makes US iOS acquisition and the agent-memory promise primary on the homepage", () => {
    const html = render(<HeroSection onSeeWorkflow={() => undefined} />);

    expect(html).toContain("Your everyday context");
    expect(html).toContain("ready for agents");
    expect(html).toContain("Join iOS Early Access");
    expect(html).toContain('data-analytics-event="ios_early_access_click"');
    expect(html).toContain("You choose what to capture");
    expect(html).not.toContain("Your personal");
  });

  it("keeps the destination waitlist consistent with the iOS acquisition promise", () => {
    const html = render(<CTASection />);

    expect(html).toContain("Start with Memova on iPhone");
    expect(html).toContain("Join iOS Early Access");
    expect(html).toContain('data-analytics-event="ios_early_access_click"');
    expect(html).toContain("You choose what to capture");
    expect(html).not.toContain("Build your workflow OS");
  });

  it("tracks waitlist success only after a successful API response", () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), "client/src/components/sections/CTASection.tsx"),
      "utf8",
    );
    const responseGuard = source.indexOf("if (!response.ok)");
    const successEvent = source.indexOf('trackAnalyticsEvent("waitlist_submit_success"');

    expect(responseGuard).toBeGreaterThan(-1);
    expect(successEvent).toBeGreaterThan(responseGuard);
  });

  it("mounts SPA page tracking after route metadata", () => {
    const source = fs.readFileSync(path.resolve(process.cwd(), "client/src/App.tsx"), "utf8");

    expect(source).toContain("<AnalyticsTracker />");
    expect(source.indexOf("<SiteMetadata />")).toBeLessThan(source.indexOf("<AnalyticsTracker />"));
  });

  it("removes the legacy optional analytics loader to prevent duplicate measurement", () => {
    const source = fs.readFileSync(path.resolve(process.cwd(), "client/src/main.tsx"), "utf8");

    expect(source).not.toContain("VITE_ANALYTICS_ENDPOINT");
    expect(source).not.toContain("VITE_ANALYTICS_WEBSITE_ID");
  });

  it("discloses Google Analytics collection and withdrawal controls", () => {
    const policy = fs.readFileSync(
      path.resolve(process.cwd(), "client/src/content/privacy-policy.md"),
      "utf8",
    );

    expect(policy).toContain("### Website Analytics and Cookies");
    expect(policy).toContain("Google Analytics 4");
    expect(policy).toContain("G\\-9YJQ994J98");
    expect(policy).toContain("Privacy choices");
    expect(policy).toContain("withdraw");
  });

  it.each([
    ["iOS", <IOS />, "Memova for iPhone"],
    ["agent memory", <AgentMemory />, "Agent memory"],
    ["how it works", <HowItWorks />, "From everyday context"],
  ])("renders the %s page with a clear H1, user control, and iOS CTA", (_name, page, heading) => {
    const html = render(page);

    expect(html).toContain(`<h1`);
    expect(html).toContain(heading);
    expect(html).toContain("You choose what to capture");
    expect(html).toContain("Join iOS Early Access");
  });

  it("defines three crawlable use-case stories with the complete transformation", () => {
    expect(useCaseDetails).toHaveLength(3);

    for (const detail of useCaseDetails) {
      const html = render(<UseCaseDetailPage slug={detail.slug} />);
      expect(html).toContain(detail.title);
      expect(html).toContain("Everyday context");
      expect(html).toContain("Agent memory");
      expect(html).toContain("Workflow outcome");
      expect(html).toContain("Review and approve");
      expect(html).toContain("Join iOS Early Access");
    }
  });
});
