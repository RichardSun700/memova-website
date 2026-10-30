import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { runInNewContext } from "node:vm";
import { parseHTML } from "linkedom";
import { getSitePage } from "./sitePages";

const legacyHomepage = fs.readFileSync(
  path.resolve(process.cwd(), "client/homepage/index.html"),
  "utf8"
);
const publicDir = path.resolve(process.cwd(), "client/public");
const homepage = fs.readFileSync(path.resolve("dist/public/index.html"), "utf8");

function renderedLegacyHomepage(phone: boolean) {
  const { document } = parseHTML('<html><body><div id="root"></div></body></html>');
  const code = [...legacyHomepage.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
    .find(match => match[1].includes('function ApolloHomepagePreview()'))![1];
  runInNewContext(code, {
    document,
    window: {
      location: { hostname: "memova.ai" },
      localStorage: { getItem: () => null },
      matchMedia: (query: string) => ({ matches: phone && /max-width: (760|900)px/.test(query) }),
    },
    setTimeout: () => 0,
  }, { timeout: 5000 });
  return document;
}

function readPngSize(fileName: string) {
  const png = fs.readFileSync(path.join(publicDir, fileName));
  expect(png.subarray(1, 4).toString()).toBe("PNG");
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

describe("production homepage", () => {
  it("opens with matching English document, social metadata and structured data", () => {
    const page = getSitePage("/");
    const source = fs.readFileSync(path.resolve("homepage-watch/index.html"), "utf8");
    for (const html of [source, homepage]) {
      const { document } = parseHTML(html);
      expect(document.documentElement.lang).toBe("en");
      expect(document.title).toBe(page.title);
      expect(document.querySelector('meta[name="description"]')?.getAttribute("content"))
        .toBe(page.description);
      expect(document.querySelector('meta[property="og:title"]')?.getAttribute("content"))
        .toBe(page.title);
      expect(document.querySelector('meta[property="og:description"]')?.getAttribute("content"))
        .toBe(page.description);
    }
    const { document } = parseHTML(homepage);
    const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map(script => JSON.parse(script.textContent || "{}"));
    expect(schemas).toContainEqual(expect.objectContaining({
      url: "https://memova.ai/", name: page.title, description: page.description, inLanguage: "en-US",
    }));
  });

  it("shows nine chronological photo scenes without links to retired My Day stories", () => {
    const { document } = parseHTML(homepage);
    const gallery = document.querySelector(".story-orbit")!;
    const cards = [...gallery.querySelectorAll("figure")];
    expect(cards).toHaveLength(9);
    expect(cards.map(card => {
      const time = card.querySelector("time");
      return time?.getAttribute("datetime") ?? time?.getAttribute("dateTime");
    }))
      .toEqual(["00:30", "07:00", "08:15", "09:30", "12:30", "15:30", "18:30", "20:00", "22:30"]);
    expect(gallery.querySelector("a, button, [tabindex]")).toBeNull();
    expect(gallery.querySelector(".orbit-open, .orbit-caption-arrow")).toBeNull();
    for (const card of cards) {
      expect(card.querySelector("img")?.getAttribute("src")).toContain("/day-photos-v1/");
      expect(card.querySelector("img")?.getAttribute("alt")?.length).toBeGreaterThan(5);
      expect(card.querySelector(".orbit-description")?.textContent?.length).toBeGreaterThan(10);
    }
    expect(homepage).not.toContain("/examples/stories/");
  });

  it("retires the nine old gallery routes while keeping independent feature examples", () => {
    const output = path.resolve("dist/public");
    expect(fs.existsSync(path.join(output, "examples/stories"))).toBe(false);
    for (const source of ["partner-conversation", "dating-boundaries", "colleague-feedback", "parent-child-conversation", "speaking-up"]) {
      expect(fs.existsSync(path.join(output, `examples/mentor-sources/${source}.html`))).toBe(true);
    }
    for (const example of ["MyDay_Workplace_Conversation_Reference_Layout.html", "watch-prototype.html", "meeting-outcome-library.html", "spark-fridge-idea.html"]) {
      expect(fs.existsSync(path.join(output, "examples", example))).toBe(true);
    }
  });

  it("uses the current Liquid Blue Mist icon as the stable search favicon", () => {
    const { document } = parseHTML(homepage);
    expect(document.querySelector('link[rel="icon"][sizes="96x96"]')?.getAttribute("href"))
      .toBe("/favicon-96x96.png");
    expect(document.querySelector('link[rel="icon"][type="image/svg+xml"]')?.getAttribute("href"))
      .toBe("/brand/memova-app-icon-liquid-blue.svg");
    expect(document.querySelector('link[rel="manifest"]')?.getAttribute("href"))
      .toBe("/site.webmanifest");
    const structuredData = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map(script => JSON.parse(script.textContent || "{}"));
    expect(structuredData.length).toBeGreaterThan(0);
    expect(JSON.stringify(structuredData)).toContain("https://memova.ai/");
    expect(homepage).not.toContain("favicon.ico?v=");

    expect(readPngSize("favicon-96x96.png")).toEqual({ width: 96, height: 96 });
    expect(readPngSize("favicon-192x192.png")).toEqual({
      width: 192,
      height: 192,
    });
    expect(readPngSize("favicon.png")).toEqual({ width: 512, height: 512 });
    expect(readPngSize("apple-touch-icon.png")).toEqual({
      width: 180,
      height: 180,
    });

    const ico = fs.readFileSync(path.join(publicDir, "favicon.ico"));
    expect(ico.readUInt16LE(2)).toBe(1);
    expect(ico.readUInt16LE(4)).toBeGreaterThanOrEqual(6);

    const manifest = JSON.parse(
      fs.readFileSync(path.join(publicDir, "site.webmanifest"), "utf8")
    );
    expect(manifest.name).toBe("Memova");
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "/favicon-192x192.png",
          sizes: "192x192",
        }),
        expect.objectContaining({ src: "/favicon.png", sizes: "512x512" }),
      ])
    );
  });

  it("renders the real Watch homepage and every chapter before JavaScript starts", () => {
    const { document } = parseHTML(homepage);
    const root = document.querySelector('#root[data-production-homepage="watch-life-v1"][data-seo-snapshot="true"]')!;
    expect(root).not.toBeNull();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(root.querySelector("h1")?.textContent?.replace(/\s+/g, ""))
      .toBe("Recordallday.Buildyourknowledge.");
    expect(root.querySelector(".hero-intro")?.textContent).toContain("Transcribe and search offline on iPhone");
    expect(root.querySelector(".trust-line")?.textContent).toContain("Saved locally by default. You choose what to upload.");
    for (const id of ["experience", "privacy", "pro", "faq", "download"]) {
      expect(root.querySelector(`#${id}`), id).not.toBeNull();
    }
    expect(root.querySelector("#experience h2")).not.toBeNull();
    expect(root.querySelector("#privacy h2")).not.toBeNull();
    expect(root.querySelector("#pro")?.textContent).toContain("US$39.99");
    expect(root.querySelector("#pro")?.textContent).toContain("Prices shown in USD. Confirm the price and auto-renewal terms in the app.");
    expect(root.querySelector("#top video, #top iframe")).toBeNull();
    expect(root.querySelector("#download form, #download input")).toBeNull();
    expect(homepage).not.toContain('class="memova-seo-shell');
    expect(homepage).not.toContain("Join early access");
  });

  it("keeps downloads, community controls, MCP and legal links reachable", () => {
    const { document } = parseHTML(homepage);
    const appStore = "https://apps.apple.com/us/app/memova-ai/id6796284954";
    expect(document.querySelector('.hero-actions a')?.getAttribute("href")).toBe(appStore);
    expect(document.querySelector('.lower-footer-download')?.getAttribute("href")).toBe(appStore);
    expect(document.querySelectorAll(`a[href="${appStore}"]`).length).toBeGreaterThanOrEqual(4);
    expect(document.querySelector('.header-community[aria-haspopup="dialog"]')).not.toBeNull();
    expect(document.querySelector('.mobile-menu-community[aria-haspopup="dialog"]')).not.toBeNull();
    for (const pathname of ["mcp", "privacy", "support", "terms"]) {
      expect(document.querySelector(`a[href="https://memova.ai/${pathname}/"]`), pathname).not.toBeNull();
    }
    expect(document.querySelector('a.skip-link[href="#main"]')).not.toBeNull();
    expect(document.querySelector('#mobile-navigation[hidden]')).not.toBeNull();
    expect(document.querySelector('.mobile-menu-toggle')?.getAttribute("aria-controls"))
      .toBe("mobile-navigation");
    expect(document.querySelector('.language-button')?.getAttribute("aria-label")).toBe("切换到中文");
  });

  it("preserves the retained legacy account header and account labels", () => {
    const appDownloadControl = legacyHomepage.indexOf(
      'h("a", { className: "memova-download-button", href: "https://apps.apple.com/us/app/memova-ai/id6796284954"'
    );
    const accountControl = legacyHomepage.indexOf(
      'authUser\n                    ? h("div", { className: "five-account-menu"'
    );

    expect(legacyHomepage).toContain(
      'const HOMEPAGE_AUTH_STORAGE_KEY = "memova.auth.v1";'
    );
    expect(legacyHomepage).toContain(
      'const HOMEPAGE_LOGIN_HREF = "/login?source=homepage&v=20260831";'
    );
    expect(legacyHomepage).toContain("window.location.assign(HOMEPAGE_LOGIN_HREF)");
    expect(legacyHomepage).toContain("function readHomepageAuthUser()");
    expect(legacyHomepage).toContain("async function fetchHomepageAuthUser()");
    expect(legacyHomepage).toContain("authUser?.avatar_url_expires_at");
    expect(legacyHomepage).toContain('className: "five-account-trigger"');
    expect(legacyHomepage).toContain('className: "five-account-popover"');
    expect(legacyHomepage).toContain('"aria-haspopup": "menu"');
    expect(legacyHomepage).toContain('h("span", null, "Profile")');
    expect(legacyHomepage).toContain('"Log out"');
    expect(legacyHomepage).toContain(
      'return user?.display_name?.trim() || "Memova account";'
    );
    expect(legacyHomepage).not.toContain('h("small", null, authUser.email)');
    expect(legacyHomepage).not.toContain("authUser.email || homepageAccountLabel");
    expect(legacyHomepage).not.toContain('user?.email?.split("@")[0]');
    expect(appDownloadControl).toBeGreaterThan(-1);
    expect(accountControl).toBeGreaterThan(appDownloadControl);
  });

  it("preserves the original manual cover and standalone guide links", () => {
    const captureScript = fs.readFileSync(
      path.join(publicDir, "capture-personal-manual-integration.js"),
      "utf8"
    );
    const scatterScript = fs.readFileSync(
      path.join(publicDir, "scatter-relations.js"),
      "utf8"
    );
    const workTypesPage = path.join(
      publicDir,
      "personal-manual/work-types/index.html"
    );
    const neilManualPage = path.join(
      publicDir,
      "personal-manual/neil-armstrong/index.html"
    );

    const manualLanding = fs.readFileSync(path.join(publicDir, "personal-manual/index.html"), "utf8");
    expect(legacyHomepage).not.toContain("h(CaptureManualPage, null)");
    expect(legacyHomepage).not.toContain("capture-personal-manual-integration.js?v=");
    expect(legacyHomepage).not.toContain("homepage-manual-cover.css?v=");
    expect(legacyHomepage).toContain('"Work Style"');
    expect(manualLanding).toContain('src="/capture-personal-manual-integration.js"');
    expect(manualLanding).toContain('href="/homepage-manual-cover.css"');
    expect(sampleMarkupAbsolutePaths(captureScript)).toBe(true);
    expect(legacyHomepage).not.toContain("personal-manual-discovery-stack.css?v=");
    const sampleMarkup = captureScript.slice(captureScript.indexOf("function renderNeilSample()"), captureScript.indexOf("function renderInstruction("));
    expect(sampleMarkup).toContain("Neil Armstrong original Personal Manual cover");
    expect(sampleMarkup).toContain("View full manual →");
    expect(sampleMarkup).toContain("/neil-armstrong/cover.html?embed=1");
    expect(sampleMarkup).not.toContain("/neil-armstrong/index.html?embed=1");
    expect(sampleMarkup).not.toContain("agent-manual-cover__hero");
    expect(sampleMarkup).toContain('loading="lazy"');
    expect(captureScript).not.toContain("work-types-discovery");
    expect(captureScript).not.toContain("Discover the 16 work types");
    for (const phone of [false, true]) {
      const document = renderedLegacyHomepage(phone);
      expect(document.querySelectorAll('a[href="/personal-manual/work-types/"]')).toHaveLength(2);
      expect(document.querySelectorAll('#waitlist')).toHaveLength(1);
    }
    expect(manualLanding).toContain('href="/personal-manual/work-types/"');
    expect(manualLanding).toContain('href="/personal-manual/" aria-current="page"');
    const workTypes = fs.readFileSync(workTypesPage, "utf8");
    expect(workTypes).toContain('href="/personal-manual/work-types/" aria-current="page"');
    expect(workTypes).toContain('href="/personal-manual/"');
    expect(captureScript).not.toContain('data-learning-target="types"');
    expect(scatterScript).not.toContain("<iframe");
    expect(scatterScript).toContain('class="memova-crew-manual__portrait-button" href="./personal-manual/neil-armstrong/"');
    expect(scatterScript).toContain(
      "const observationRoot = document.body || document.documentElement;"
    );
    expect(fs.existsSync(workTypesPage)).toBe(true);
    expect(fs.readFileSync(workTypesPage, "utf8")).toContain(
      "MEMOVA Work Types · Dog Work Archetypes"
    );
    expect(fs.readFileSync(neilManualPage, "utf8")).toContain(
      "Neil Armstrong’s Personal Manual · Memova"
    );
    expect(fs.readFileSync(neilManualPage, "utf8")).toContain(
      "Historical reconstruction · Apollo 11"
    );

    const neilManual = fs.readFileSync(neilManualPage, "utf8");
    const selectedPoles = new Map([
      ["Clarity", "Think it through"],
      ["Navigation", "Map the path"],
      ["Scope", "Go deeper"],
      ["Expression", "Understated"],
    ]);
    for (const [axis, label] of selectedPoles) {
      const block = neilManual.match(
        new RegExp(
          `<article class="axis-card"><h3>${axis}</h3>[\\s\\S]*?</article>`
        )
      )?.[0];
      expect(block, `${axis} axis`).toBeTruthy();
      expect(
        block?.match(/class="user-pole"/g),
        `${axis} selected pole`
      ).toHaveLength(1);
      expect(block, `${axis} selected label`).toMatch(
        new RegExp(
          `class="user-pole"[\\s\\S]*?class="axis-subtitle">${label}</span>`
        )
      );
    }

    expect(neilManual).toContain(
      '<meta name="memova-manual-version" content="neil-armstrong-v8" />'
    );
    expect(neilManual).toContain(
      '<meta name="memova-website-embed" content="flat-2" />'
    );
    expect(neilManual.match(/<iframe/g) ?? []).toHaveLength(0);
    expect(neilManual).not.toContain("mobile-card-cover");
    expect(neilManual).not.toContain("phone-specific v5 homepage");
    expect(neilManual).not.toContain("mobileCardSource");
    expect(neilManual.match(/id="dimensions"/g) ?? []).toHaveLength(1);
    expect(neilManual).not.toContain("visibility: hidden");
    expect(neilManual).not.toContain(
      'name="robots" content="noindex,nofollow"'
    );
    expect(neilManual).not.toContain("V7 REMAKE PREVIEW");
  });

  it("routes Personal Manual creation through Codex or Memova MCP instructions", () => {
    const captureScript = fs.readFileSync(
      path.join(publicDir, "capture-personal-manual-integration.js"),
      "utf8"
    );
    const captureStyles = fs.readFileSync(
      path.join(publicDir, "capture-personal-manual-integration.css"),
      "utf8"
    );

    expect(captureScript).toContain('renderClientCard("codex", 1');
    expect(captureScript).toContain('renderClientCard("mcp", 2');
    expect(captureScript).toContain('data-client-type="${clientType}"');
    expect(captureScript).toContain('data-client-card="${clientType}"');
    expect(captureScript).toContain('class="agent-client-flip__inner"');
    expect(captureScript).toContain('data-flip-back="${clientType}"');
    expect(captureScript).toContain("I have run both instructions");
    expect(captureScript).toContain(
      "Please install or update Memova from gxyfred/memova-codex-plugin to the latest version and complete sign-in. When finished, remind me to restart Codex."
    );
    expect(captureScript).toContain("@memova Personal Manual");
    expect(captureScript).not.toContain("one-time website handoff");
    expect(captureScript).not.toContain("submitUrl");
    expect(captureScript).toContain(
      "Please connect to the Memova MCP: https://api.memova.ai/mcp and complete sign-in. If the client needs to be reloaded, remind me."
    );
    expect(captureScript).toContain(
      "Use Memova to generate my Personal Manual."
    );
    expect(captureScript).toContain(
      "After Prompt 01, restart Codex. Then run Prompt 02."
    );
    expect(captureScript).toContain("CHATGPT · CLAUDE · CURSOR · DESKTOP");
    expect(captureScript).toContain("ChatGPT works here too.");
    expect(captureScript).toContain("Start in your AI client’s desktop app.");
    expect(captureScript).not.toContain("THE GUIDE · DESKTOP APP REQUIRED");
    expect(captureScript).not.toContain("A friendly heads-up:");
    expect(captureScript).not.toContain("other agents</span>");
    expect(captureScript).toContain(
      "/personal-manual/work-types/assets/dogs/12_引导者_The_Guide.png"
    );
    expect(captureStyles).toContain(".agent-desktop-app-notice");
    expect(captureStyles).toContain(
      'grid-template-areas:\n    "eyebrow eyebrow"\n    "title description"'
    );
    expect(captureStyles).toContain("min-height: 315px;");
    expect(captureStyles).toContain("font-size: 8.8px;");
    expect(captureStyles).toContain(
      "transition: transform 620ms cubic-bezier(.16, 1, .3, 1);"
    );
    expect(captureStyles).toContain("overflow-y: auto;");
    expect(captureStyles).toContain(
      "grid-template-rows: minmax(min-content, 1.25fr) minmax(min-content, .75fr);"
    );
    expect(captureStyles).toContain(
      "grid-template-rows: minmax(min-content, 1.55fr) auto minmax(min-content, .65fr);"
    );
    expect(captureStyles).toContain("max-height: max(560px, 76vh);");
    expect(captureStyles).toContain("@keyframes agent-client-back-content-in");
    expect(captureStyles).toContain("transition-duration: 460ms !important;");
    expect(captureStyles).toContain(
      ".agent-generated-browser__viewport iframe {\n  width: 200%;\n  height: 200%;\n  transform: scale(.5);"
    );
    expect(captureStyles).toContain(
      ".agent-generated-browser {\n  top: 1.5%;\n  right: 1%;\n  width: 96%;\n  height: 80%;"
    );
    expect(captureStyles).toContain(
      ".agent-generated-browser__viewport iframe { width: 100%; height: 100%; transform: none; }"
    );
    expect(captureScript).toContain(
      "userNickname: session.user.display_name?.trim()"
    );
    expect(captureScript).toContain("function flowAccountLabel(flow)");
    expect(captureScript).not.toContain("manualFlow.userEmail");
    expect(captureScript).toContain("const CLIENT_CARD_FLIP_SETTLE_MS = 660;");
    expect(captureScript).toContain("await flipComplete;");
    const compactInstruction = captureScript.slice(
      captureScript.indexOf("function renderCompactInstruction("),
      captureScript.indexOf("function jobPrompt(")
    );
    expect(compactInstruction.indexOf("data-copy-instruction")).toBeLessThan(
      compactInstruction.indexOf("<p>")
    );
    const defaultSample = captureScript.slice(
      captureScript.indexOf("function renderNeilSample()"),
      captureScript.indexOf("function renderInstruction(")
    );
    expect(defaultSample).not.toContain('data-client-type="codex"');
    expect(defaultSample).not.toContain('data-client-type="mcp"');
    expect(captureScript).toMatch(
      /if \(state === "sample"\)[\s\S]*?data-create-manual/
    );
    expect(captureScript).toContain(
      'const SETUP_STORAGE_KEY = "memova_personal_manual_setup_v1"'
    );
    expect(captureScript).toContain(
      'renderCapture(section, { state: "audience", flow, session, activeClient: flow.clientType })'
    );
    expect(captureScript).toContain("NO SIGN-IN YET");
    expect(captureScript).toContain("No sign-in yet. Instruction 1 will guide you.");
    expect(captureScript).toContain("ensureAuthenticatedFlow(manualFlow, session)");
    expect(captureScript).not.toContain("renderAuthRequired");
    expect(captureScript).not.toContain("Sign in before you create.");
    expect(captureScript).toContain(
      'section.querySelectorAll("[data-reset-manual]").forEach'
    );
    const clientChoiceHandler = captureScript.slice(
      captureScript.indexOf('section.querySelectorAll("[data-client-type]")'),
      captureScript.indexOf('section.querySelectorAll("[data-flip-back]")')
    );
    expect(clientChoiceHandler).toContain(
      'card.classList.toggle("is-flipped", active)'
    );
    expect(clientChoiceHandler).toContain("manualFlow.clientType = clientType");
    expect(clientChoiceHandler).not.toContain("createRemoteJob");
    expect(clientChoiceHandler).not.toContain('state: "handoff"');
    expect(captureScript).toContain(
      'const AUTH_STORAGE_KEY = "memova.auth.v1"'
    );
    expect(captureScript).toContain("/v1/personal-manual/current");
    expect(captureScript).toContain("/overview/preview");
    expect(captureScript).toContain("function snapshot(manual)");
    expect(captureScript).toContain("function isNewResult(baseline, current)");
    expect(captureScript).toContain(
      "current.latest_note_version_id !== baseline.versionId"
    );
    expect(captureScript).toContain('cache: "no-store"');
    expect(captureScript).toContain(
      'document.addEventListener("visibilitychange"'
    );
    expect(captureScript).toContain("const POLL_TIMEOUT_MS = 15 * 60_000");
    expect(captureScript).toContain('error.message === "RATE_LIMITED"');
    expect(captureScript).toContain('error.message === "AUTH_REQUIRED"');
    expect(captureScript).toContain(
      "window.localStorage.removeItem(AUTH_STORAGE_KEY)"
    );
    expect(captureScript).toContain('data-pause-manual>Pause checking');
    expect(captureScript).toContain('data-reset-manual>Exit setup');
    expect(captureScript).toContain("You do not need to wait on this website.");
    expect(captureScript).toContain("No need to wait here.");
    expect(captureScript).toContain("Download the app");
    expect(captureScript).toContain("appear automatically in Notes");
    expect(captureScript).not.toContain('data-app-download-placeholder="true"');
    expect(captureScript).not.toContain("Keep this page open.");
    expect(captureStyles).toContain(".agent-wait-app-card");
    expect(captureStyles).toContain("pointer-events: none;");
    const progressActionsStart = captureScript.indexOf(
      'if (["progress", "timeout"].includes(state))'
    );
    const progressActions = captureScript.slice(
      progressActionsStart,
      captureScript.indexOf('if (state === "result")', progressActionsStart)
    );
    expect(progressActions).toContain('class="agent-wait-app-card"');
    expect(progressActions).toContain('href="https://apps.apple.com/us/app/memova-ai/id6796284954"');
    expect(progressActions).not.toContain("<button");
    expect(captureScript).toContain("Open the app.<br>Find it in<br>Notes.");
    expect(captureScript).toContain("Your Personal Manual is ready in Notes.");
    expect(captureScript).toContain('class="agent-result-app-location"');
    expect(captureScript).toContain("SAVED IN NOTES");
    expect(captureScript).not.toContain("Open full Manual");
    expect(captureScript).not.toContain("Download Personal Manual HTML");
    expect(captureScript).not.toContain("data-download-result");
    expect(captureScript).not.toContain("manualPublicUrl");
    expect(captureScript).not.toContain("manualFlow.publicUrl");
    expect(captureScript).toContain("function clearManualStateFromUrl()");
    expect(captureScript).toContain("function pauseProgressOnPageExit()");
    expect(captureScript).toContain('manualFlow.pauseReason = "page-exit"');
    expect(captureScript).toContain(
      'window.addEventListener("pagehide", pauseProgressOnPageExit)'
    );
    expect(captureStyles).toContain(".agent-progress-controls");
    expect(captureScript).not.toContain("/api/personal-manual/jobs");
    expect(captureScript).not.toContain("createRemoteJob");
    expect(captureScript).not.toContain("fetchRemoteJob");
    expect(captureScript).not.toContain("When the complete HTML is ready");
    expect(captureScript).not.toContain("POST only that HTML");
    expect(captureScript).not.toContain("complete self-contained HTML file");
    expect(captureScript).toContain('srcdoc="${escapeHtml(previewHtml)}"');
    expect(captureScript).toContain("secureManualHtml(manualFlow.resultHtml)");
    expect(captureScript).toContain("script-src 'none'");
    const generatedResult = captureScript.slice(
      captureScript.indexOf("function renderGeneratedResult("),
      captureScript.indexOf("function copyForState(")
    );
    expect(generatedResult).toContain('sandbox=""');
    expect(generatedResult).not.toContain("allow-downloads");
    expect(captureScript).not.toContain("RESULT_URL");
    expect(captureScript).not.toContain("generated-conductor");
    expect(captureScript).not.toContain("5 Codex conversations found");
  });
});

function sampleMarkupAbsolutePaths(script: string) {
  return script.includes('data-src="/personal-manual/neil-armstrong/cover.html?embed=1')
    && script.includes('href="/personal-manual/neil-armstrong/"');
}
