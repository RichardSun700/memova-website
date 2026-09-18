/* A local, on-demand App Store QR dialog. Links remain usable without JS. */
(() => {
  const appStoreUrl = "https://apps.apple.com/us/app/memova-ai/id6796284954";
  let dialog;
  let trigger;

  function createDialog() {
    const element = document.createElement("dialog");
    element.id = "memova-app-download";
    element.className = "memova-app-download";
    element.setAttribute("aria-labelledby", "memova-app-download-title");
    element.setAttribute("aria-describedby", "memova-app-download-description");
    element.innerHTML = `
      <div class="memova-app-download-content">
        <button class="memova-app-download-close" type="button" aria-label="Close app download" autofocus>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
        <img class="memova-app-download-icon" src="/brand/memova-app-icon-liquid-blue.svg" alt="" width="56" height="56">
        <span class="memova-app-download-eyebrow">MEMOVA FOR IPHONE</span>
        <h2 id="memova-app-download-title">Your memory, on the go.</h2>
        <p id="memova-app-download-description">Scan with your iPhone camera<br>to download Memova from the App Store.</p>
        <div class="memova-app-download-code">
          <img src="/brand/memova-app-store-qr.png" width="240" height="240" alt="Scan this QR code to open Memova AI on the App Store">
        </div>
        <a class="memova-download-button memova-app-download-direct" href="${appStoreUrl}" target="_blank" rel="noopener noreferrer" data-app-store-direct>
          Open in App Store <span aria-hidden="true">↗</span>
        </a>
        <span class="memova-app-download-note">Available for iPhone.</span>
      </div>`;
    element.querySelector(".memova-app-download-close").addEventListener("click", () => element.close());
    // The content fills the dialog; a click on the dialog itself is the backdrop.
    element.addEventListener("click", event => {
      if (event.target === element) element.close();
    });
    element.addEventListener("close", () => {
      document.documentElement.classList.remove("memova-app-download-open");
      const returnTo = trigger?.isConnected && trigger.getClientRects().length
        ? trigger
        : document.querySelector(".five-menu");
      returnTo?.focus({ preventScroll: true });
    });
    document.body.append(element);
    return element;
  }

  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.("a.memova-download-button[href]");
    if (!link || link.hasAttribute("data-app-store-direct") || link.href !== appStoreUrl) return;
    // Preserve the native App Store link on iPhone, including Safari and other
    // iOS browsers. Screen width alone would misidentify narrow desktop windows.
    if (/iPhone|iPod/i.test(navigator.userAgent)) return;
    if (typeof HTMLDialogElement === "undefined" || !HTMLDialogElement.prototype.showModal) return;
    dialog ||= createDialog();
    if (dialog.open) return;
    trigger = link;
    dialog.showModal();
    document.documentElement.classList.add("memova-app-download-open");
    event.preventDefault();
  });
})();
