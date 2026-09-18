import { runInNewContext } from "node:vm";
import { parseHTML } from "linkedom";

// Render the existing production components at build time. Effects, timers,
// storage and network access stay disabled: this is the anonymous first frame.
function renderInitialPage(code, compact) {
  const { document } = parseHTML('<!doctype html><html><head></head><body><div id="root"></div></body></html>');
  const window = {
    location: { hostname: "memova.ai" },
    localStorage: { getItem: () => null },
    matchMedia: query => ({ matches: compact && query === "(max-width: 900px)" }),
  };
  runInNewContext(code, { document, window, setTimeout: () => 0 }, { timeout: 5000 });
  return document;
}

export function prerenderProductionHomepage(code) {
  const document = renderInitialPage(code, false);
  const compactDocument = renderInitialPage(code, true);
  const page = document.querySelector(".five-home");
  const hero = page?.querySelector("#top");
  if (!hero?.querySelector("h1") || !page.querySelector(".five-header")) {
    throw new Error("Production components did not render the initial homepage");
  }

  // Keep the real header, rail and hero. Later chapters are mounted by the same
  // client code. Avoid a second, separately maintained approximation of the UI.
  for (const section of page.querySelector("main").children) {
    if (section !== hero) section.remove();
  }
  page.id = "memova-static-snapshot";

  // Orbit coordinates are the only visible first-frame values computed from a
  // media query. Preserve both original component results without inline JS.
  const cards = [...page.querySelectorAll(".kb-orbit-card")];
  const compactCards = [...compactDocument.querySelectorAll("#top .kb-orbit-card")];
  if (cards.length !== compactCards.length) throw new Error("Homepage orbit variants differ");
  cards.forEach((card, index) => {
    for (const axis of ["left", "top"]) {
      card.style.setProperty(`--snapshot-wide-${axis}`, card.style[axis]);
      card.style.setProperty(`--snapshot-compact-${axis}`, compactCards[index].style[axis]);
      card.style.removeProperty(axis);
    }
  });
  return {
    markup: page.outerHTML,
    css: `
#memova-static-snapshot .kb-orbit-card {
  left: var(--snapshot-wide-left); top: var(--snapshot-wide-top);
}
@media (max-width: 900px) {
  #memova-static-snapshot .kb-orbit-card {
    left: var(--snapshot-compact-left); top: var(--snapshot-compact-top);
  }
}
`,
  };
}
