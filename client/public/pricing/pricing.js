(() => {
  "use strict";

  // English stays in the HTML for first paint and visitors without JavaScript.
  const translations = Array.from(document.querySelectorAll("[data-zh]"), element => {
    const attribute = element.dataset.i18nAttr;
    return { element, attribute, english: attribute ? element.getAttribute(attribute) : element.textContent };
  });
  const buttons = document.querySelectorAll("[data-language]");
  const languageFromUrl = () => new URL(window.location.href).searchParams.get("lang") === "zh" ? "zh" : "en";

  const setLanguage = (language, updateUrl = false) => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = language === "zh" ? "订阅方案 — Memova 免费版与 Pro 版" : "Pricing — Memova Free & Pro";
    translations.forEach(({ element, attribute, english }) => {
      const value = language === "zh" ? element.dataset.zh : english;
      if (attribute) element.setAttribute(attribute, value);
      else element.textContent = value;
    });
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.language === language)));
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", language);
      window.history.replaceState(window.history.state, "", url);
    }
  };

  buttons.forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.language, true)));
  window.addEventListener("popstate", () => setLanguage(languageFromUrl()));
  setLanguage(languageFromUrl());
  document.querySelector(".pricing-language").hidden = false;
})();
