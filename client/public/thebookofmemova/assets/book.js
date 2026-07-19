(() => {
  "use strict";

  const body = document.body;
  const pageId = body.dataset.pageId || "library-home";
  const summary = body.dataset.summary || "";

  const progress = document.querySelector("[data-reading-progress]");
  const updateProgress = () => {
    if (!progress) return;
    const root = document.documentElement;
    const range = root.scrollHeight - root.clientHeight;
    const ratio = range > 0 ? root.scrollTop / range : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  document.querySelectorAll("[data-nav-id]").forEach((link) => {
    if (link.dataset.navId === pageId) link.setAttribute("aria-current", "page");
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const state = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((candidate) => {
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
      document.querySelectorAll("[data-library-entry]").forEach((entry) => {
        entry.hidden = state !== "all" && entry.dataset.state !== state;
      });
    });
  });

  document.querySelectorAll("[data-copy-summary]").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.dataset.copySummary || summary;
      if (!text) return;
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "已复制 Agent Summary";
      } catch {
        const selection = document.createElement("textarea");
        selection.value = text;
        selection.setAttribute("readonly", "");
        selection.style.position = "fixed";
        selection.style.opacity = "0";
        document.body.appendChild(selection);
        selection.select();
        document.execCommand("copy");
        selection.remove();
        button.textContent = "已复制 Agent Summary";
      }
      window.setTimeout(() => { button.textContent = original; }, 1600);
    });
  });

  document.querySelectorAll("[data-print]").forEach((button) => {
    button.addEventListener("click", () => window.print());
  });

  try {
    const relative = location.pathname.split("/product-book/")[1];
    if (relative && relative !== "index.html" && relative !== "") {
      localStorage.setItem("memovaBookLastPage", relative);
    }
    const lastPage = localStorage.getItem("memovaBookLastPage");
    const continueLink = document.querySelector("[data-continue-reading]");
    if (continueLink && lastPage) {
      continueLink.href = lastPage;
      continueLink.hidden = false;
    }
  } catch {
    // Local storage is an optional convenience; the book remains fully usable.
  }
})();
